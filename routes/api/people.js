const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Team = require("../../models/Team");

// @route       GET api/people
// @desc        Get all of a user's 'people'
// @access      Private
router.get("/", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const people = profile.people;
    res.json({ people });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route       POST api/people/search
// @desc        Search for people
// @access      Private

router.post(
  "/search",
  [auth, [check("email", "Please include a valid email").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id);
      const searchEmail = req.body.email;

      // Make sure user can't find themselves
      if (searchEmail === user.email) {
        return res.status(404).json({
          msg: "Can't find user. Make sure email is spelt correctly.",
        });
      }

      // Pull out person
      const person = await User.findOne({ email: searchEmail });

      // Make sure person exists
      if (!person) {
        return res.status(404).json({
          msg: "Can't find user. Make sure email is spelt correctly.",
        });
      }

      // Find profile
      const profile = await Profile.findOne({
        user: person.id,
      }).populate("user", ["name", "email"]);

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route       GET api/people/:id
// @desc        Get specific user's profile
// @access      Private

router.get("/:id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.id,
    }).populate("user", ["name", "email"]);

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route       POST api/people/:id/requests
// @desc        Send 'friends' request
// @access      Private
router.post("/:id/requests", auth, async (req, res) => {
  try {
    const person = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!person) {
      res.status(404).json({ msg: "User not found" });
    }

    const profile = await Profile.findOne({ user: person.id });
    const currentUserProfile = await Profile.findOne({ user: req.user.id });

    // Can't send request to yourself
    if (person.id === currentUser.id) {
      return res.status(400).json({ msg: "Can't send a request to yourself" });
    }

    // Check if contact already
    if (
      profile.people.filter((person) => person.id === req.user.id).length > 0
    ) {
      return res
        .status(400)
        .json({ msg: "This user is already in your contacts" });
    }

    // Check if request already sent

    if (
      currentUserProfile.sentRequest.filter(
        (request) => request.id === profile.user.toString()
      ).length > 0
    ) {
      return res
        .status(400)
        .json({ msg: "A request has already been sent to this user" });
    }

    // If user sends request to a user who has already sent them a request, automatically add to contacts
    if (
      currentUserProfile.receivedRequest.filter(
        (request) => request.id === person.id
      ).length > 0
    ) {
      // Remove from sentRequest array
      const sentRequestIndex = profile.sentRequest
        .map((request) => request.id)
        .indexOf(req.user.id);
      profile.sentRequest.splice(sentRequestIndex, 1);

      // Remove from receivedRequest array
      const receivedRequestIndex = currentUserProfile.receivedRequest
        .map((request) => request.id)
        .indexOf(person.id);
      currentUserProfile.receivedRequest.splice(receivedRequestIndex, 1);

      // Add to people array
      profile.people.unshift(req.user.id);
      currentUserProfile.people.unshift(person);

      await profile.save();
      await currentUserProfile.save();

      return res.json({ profile, currentUserProfile });
    }

    profile.receivedRequest.unshift(currentUser);
    currentUserProfile.sentRequest.unshift(person);

    await profile.save();
    await currentUserProfile.save();

    res.json({ profile, currentUserProfile });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route GET api/people/:id/requests
// @desc Lists all pending requests for current user
// @access Private
router.get("/:id/requests", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Check User
    if (req.params.id !== user.id) {
      return res.status(401).json({ msg: "Access Denied" });
    }

    const profile = await Profile.findOne({ user: user.id });

    // Split between team and user requests
    let teamInvites = [];
    let userInvites = [];

    for (let i = 0; i < profile.receivedRequest.length; i++) {
      const requestingUserProfile = await Profile.findOne({
        user: profile.receivedRequest[i].id,
      });
      if (!requestingUserProfile) {
        teamInvites.push(profile.receivedRequest[i]);
      } else {
        userInvites.push(profile.receivedRequest[i]);
      }
    }

    res.json({ teamInvites: teamInvites, userInvites: userInvites });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route       POST api/people/:id/requests/:request_id
// @desc        Accept or decline team/friend requests
// @access      Private
router.post(
  "/:id/requests/:request_id",
  [auth, [check("status").isBoolean()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id);

      // Check User
      if (req.params.id !== user.id) {
        return res.status(401).json({ msg: "Access Denied " });
      }

      const currentUserProfile = await Profile.findOne({ user: user.id });

      // Check if request received
      if (
        currentUserProfile.receivedRequest.filter(
          (request) => request.id === req.params.request_id
        ).length === 0
      ) {
        return res
          .status(400)
          .json({ msg: "You haven't received a request from this user." });
      }

      // Determine whether team or user invite
      const requestingUserProfile = await Profile.findOne({
        user: req.params.request_id,
      });

      if (!requestingUserProfile) {
        // Team Accept/Decline
        const team = await Team.findById(req.params.request_id);

        // Remove from receivedRequest
        const receivedRequestIndex = currentUserProfile.receivedRequest
          .map((request) => request.id)
          .indexOf(req.params.request_id);

        currentUserProfile.receivedRequest.splice(receivedRequestIndex, 1);

        // If Accept
        if (req.body.status === true) {
          // Add team to profile
          currentUserProfile.teams.unshift(req.params.request_id);

          // Change status to accepted
          await Team.findOneAndUpdate(
            {
              _id: team.id,
              "members._id": req.user.id,
            },
            { $set: { "members.$.status": "Accepted" } }
          );

          // Add all "accepted" team members to user's contacts and vice versa
          const accepted = team.members
            .filter((member) => member.status === "Accepted")
            .map((member) => member._id);

          const currentUserPeople = currentUserProfile.people.map(
            (member) => member._id
          );

          for (let i = 0; i < accepted.length; i++) {
            if (
              currentUserPeople.indexOf(accepted[i]) === -1 &&
              req.user.id !== accepted[i].toString()
            ) {
              currentUserProfile.people.unshift(accepted[i]);
              const teamMemberProfile = await Profile.findOne({
                user: accepted[i],
              });
              teamMemberProfile.people.unshift(user.id);

              // Check if team member has sent a friend's request to user

              if (
                currentUserProfile.receivedRequest
                  .map((request) => request._id)
                  .indexOf(teamMemberProfile.user) > -1
              ) {
                // Remove received request
                const removeReceivedIndex = currentUserProfile.receivedRequest
                  .map((request) => request._id)
                  .indexOf(teamMemberProfile.user);

                currentUserProfile.receivedRequest.splice(
                  removeReceivedIndex,
                  1
                );

                // Remove sent request
                const removeSentIndex = teamMemberProfile.sentRequest
                  .map((request) => request._id)
                  .indexOf(currentUserProfile.user);

                teamMemberProfile.sentRequest.splice(removeSentIndex, 1);

                await teamMemberProfile.save();
                await currentUserProfile.save();
              }

              // Check if current user has sent a friends request to team member
              if (
                currentUserProfile.sentRequest
                  .map((request) => request_id)
                  .indexOf(teamMemberProfile.user) > -1
              ) {
                // Remove sent request
                const removeSentIndex = currentUserProfile.sentRequest
                  .map((request) => request._id)
                  .indexOf(teamMemberProfile.user);

                currentUserProfile.sentRequest.splice(removeSentIndex, 1);

                // Remove received request
                const removeReceivedIndex = teamMemberProfile.receivedRequest
                  .map((request) => request._id)
                  .indexOf(currentUserProfile.user);

                teamMemberProfile.receivedRequest.splice(
                  removeReceivedIndex,
                  1
                );

                await teamMemberProfile.save();
                await currentUserProfile.save();
              }

              await teamMemberProfile.save();
              await currentUserProfile.save();
            }
          }

          await currentUserProfile.save();

          return res.json({ currentUserProfile });
        }
        // Remove declined member from team
        const removeMemberIndex = team.members
          .map((member) => member._id)
          .indexOf(req.params.id);

        team.members.splice(removeMemberIndex, 1);

        await team.save();
        await currentUserProfile.save();

        res.json({ team });
      } else {
        // User Accept/Decline
        // Remove from receivedRequest
        const receivedRequestIndex = currentUserProfile.receivedRequest
          .map((request) => request.id)
          .indexOf(req.params.request_id);

        currentUserProfile.receivedRequest.splice(receivedRequestIndex, 1);

        // Remove from sentRequest
        const sentRequestIndex = requestingUserProfile.sentRequest
          .map((request) => request.id)
          .indexOf(req.user.id);

        requestingUserProfile.sentRequest.splice(sentRequestIndex, 1);

        // If Accept

        if (req.body.status === true) {
          currentUserProfile.people.unshift(req.params.request_id);
          requestingUserProfile.people.unshift(req.user.id);
        }

        await currentUserProfile.save();
        await requestingUserProfile.save();

        res.json({ currentUserProfile, requestingUserProfile });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route       POST api/people/:id
// @desc        Update or edit profile
// @access      Private
router.post("/:id", auth, async (req, res) => {
  const { jobTitle, department, organization, location } = req.body;

  // Build profile object
  const profileFields = {};
  profileFields.user = req.user.id;
  if (jobTitle) profileFields.jobTitle = jobTitle;
  if (department) profileFields.department = department;
  if (organization) profileFields.organization = organization;
  if (location) profileFields.location = location;
  try {
    let profile = await Profile.findOne({ user: req.params.id });

    // Check user
    if (profile.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ msg: "You do not have permission to edit this profile" });
    }

    profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileFields },
      { new: true }
    );

    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
