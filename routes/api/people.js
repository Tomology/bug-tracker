const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Team = require("../../models/Team");
const Project = require("../../models/Project");

// @route       GET api/people
// @desc        Get all of a user's 'people'
// @access      Private
router.get("/", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const peopleArr = [];
    for (let i = 0; i < profile.people.length; i++) {
      const contactProfile = await Profile.findOne({
        user: profile.people[i]._id,
      })
        .populate("user", ["firstName", "lastName"])
        .select(["jobTitle", "organization"]);
      peopleArr.push(contactProfile);
    }
    res.json(peopleArr);
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
      }).populate("user", ["firstName", "lastName"]);

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route       GET api/people/:user_id
// @desc        Get specific user's profile
// @access      Private

router.get("/:user_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["firstName", "lastName", "email"]);

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route       POST api/people/:user_id/requests
// @desc        Send 'friends' request
// @access      Private
router.post("/:user_id/requests", auth, async (req, res) => {
  try {
    const person = await User.findById(req.params.user_id);
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

      return res.json(currentUserProfile);
    }

    profile.receivedRequest.unshift(currentUser);
    currentUserProfile.sentRequest.unshift(person);

    await profile.save();
    await currentUserProfile.save();

    res.json(currentUserProfile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route       GET api/people/:user_id/requests
// @desc        Lists all pending requests for current user
// @access      Private
router.get("/:user_id/requests", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Check User
    if (req.params.user_id !== user.id) {
      return res.status(401).json({ msg: "Access Denied" });
    }

    const profile = await Profile.findOne({ user: user._id });

    // Split between team and user requests
    let invites = [];

    for (let i = 0; i < profile.receivedRequest.length; i++) {
      const requestingUserProfile = await Profile.findOne({
        user: profile.receivedRequest[i].id,
      }).populate("user", ["firstName", "lastName"]);
      if (!requestingUserProfile) {
        const requestingTeam = await Team.findById(
          profile.receivedRequest[i].id
        )
          .select(["teamName", "creator"])
          .populate("creator", ["firstName", "lastName"]);
        invites.push(requestingTeam);
      } else {
        invites.push(requestingUserProfile);
      }
    }

    res.json(invites);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route       POST api/people/:user_id/requests/:request_id
// @desc        Accept or decline team/friend requests
// @access      Private
router.post(
  "/:user_id/requests/:request_id",
  [auth, [check("status").isBoolean()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id);

      // Check User
      if (req.params.user_id !== user.id) {
        return res.status(401).json({ msg: "Access Denied " });
      }

      const currentUserProfile = await Profile.findOne({
        user: user.id,
      }).populate("user", ["firstName", "lastName", "email"]);

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
      }).populate("user", ["firstName", "lastName"]);

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
                  .map((request) => request._id)
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
          .indexOf(req.params.user_id);

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

        res.json(requestingUserProfile);
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route       DELETE api/people/:user_id/remove
// @desc        Remove user from contacts
// @access      Private
router.delete("/:user_id/remove", auth, async (req, res) => {
  try {
    const currentUserProfile = await Profile.findOne({ user: req.user.id });
    const removeUserProfile = await Profile.findOne({
      user: req.params.user_id,
    });

    // Check if user in contacts
    if (
      currentUserProfile.people
        .map((person) => person._id)
        .indexOf(req.params.user_id) === -1
    ) {
      res.status(400).json({ msg: "User not in contacts" });
    }

    // Check if user is a mutual team member
    for (let i = 0; i < currentUserProfile.teams.length; i++) {
      const team = await Team.findById(currentUserProfile.teams[i]);

      if (
        team.creator === req.params.user_id ||
        team.members.map((member) => member._id).indexOf(req.params.user_id) !==
          -1
      ) {
        return res.status(400).json({
          msg:
            "Cannot remove user from contacts that is a member of a mutual team. ",
        });
      }
    }

    for (let i = 0; i < removeUserProfile.teams.length; i++) {
      const team = await Team.findById(removeUserProfile.teams[i]);

      if (
        team.creator === req.user._id ||
        team.members.map((member) => member._id).indexOf(req.user.id) !== -1
      ) {
        return res.status(400).json({
          msg:
            "Cannot remove user from contacts that is a member of a mutual team. ",
        });
      }
    }

    // Remove contact from current user's people
    const removeIndexCU = currentUserProfile.people
      .map((person) => person._id)
      .indexOf(req.params.user_id);

    currentUserProfile.people.splice(removeIndexCU, 1);

    await currentUserProfile.save();

    // Remove current user from contact's people
    const removeIndexRU = removeUserProfile.people
      .map((person) => person._id)
      .indexOf(req.user.id);

    removeUserProfile.people.splice(removeIndexRU, 1);

    await removeUserProfile.save();

    res.json({ msg: "User Removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route       POST api/people/:user_id
// @desc        Update or edit profile
// @access      Private
router.post("/:user_id", auth, async (req, res) => {
  const { jobTitle, department, organization, location } = req.body;

  // Build profile object
  const profileFields = {};

  if (jobTitle) profileFields.jobTitle = jobTitle;
  if (department) profileFields.department = department;
  if (organization) profileFields.organization = organization;
  if (location) profileFields.location = location;
  try {
    let profile = await Profile.findOne({ user: req.params.user_id });

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
    ).populate("user", ["firstName", "lastName", "email"]);

    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route       DELETE api/people/:user_id
// @desc        Delete Account
// @access      Private
router.delete("/:user_id", auth, async (req, res) => {
  try {
    // Check user
    if (req.user.id !== req.params.user_id) {
      return res
        .status(401)
        .json({ msg: "You can't delete another user's profile." });
    }

    const profile = await Profile.findOne({ user: req.user.id });
    const user = await User.findById(req.user.id);

    // DELETE ALL OF THE USER'S PROJECTS
    const projectsToDelete = [];
    const projectsToRemoveUserFrom = [];

    // Differentiate between projects
    for (let i = 0; i < profile.projects.length; i++) {
      const userProject = await Project.findById(profile.projects[i]._id);
      if (userProject.user.toString() === req.user.id) {
        projectsToDelete.unshift(profile.projects[i]._id);
      } else {
        projectsToRemoveUserFrom.unshift(profile.projects[i]._id);
      }
    }

    // Remove user from members array for teams they didn't create
    for (let i = 0; i < projectsToRemoveUserFrom.length; i++) {
      const project = await Project.findById(projectsToRemoveUserFrom[i]);
      const removeUserIndex = project.sharedWith
        .map((sharee) => sharee._id)
        .indexOf(req.user.id);
      project.sharedWith.splice(removeUserIndex, 1);
      await project.save();
    }

    // Remove project from users it has been shared with
    for (let i = 0; i < projectsToDelete.length; i++) {
      const project = await Project.findById(projectsToDelete[i]);

      for (let j = 0; j < project.sharedWith.length; j++) {
        const sharedWithUser = await Profile.findOne({
          user: project.sharedWith[j],
        });
        if (!sharedWithUser) {
          const sharedWithTeam = await Team.findById(project.sharedWith[j]);
          const removeProjectIndex = sharedWithTeam.projects
            .map((project) => project._id)
            .indexOf(projectsToDelete[i]);
          sharedWithTeam.projects.splice(removeProjectIndex, 1);
          await sharedWithTeam.save();
        } else {
          const removeProjectIndex = sharedWithUser.projects
            .map((project) => project._id)
            .indexOf(projectsToDelete[i]);
          sharedWithUser.projects.splice(removeProjectIndex, 1);
          await sharedWithUser.save();
        }
      }
    }

    // Delete Project(s)
    for (let i = 0; i < projectsToDelete.length; i++) {
      const projectRemoval = await Project.findById(projectsToDelete[i]);
      await projectRemoval.remove();
    }

    // DELETE ALL OF A USER'S TEAMS
    const teamsToDelete = [];
    const teamsToRemoveUserFrom = [];

    // Differentiate between teams
    for (let i = 0; i < profile.teams.length; i++) {
      const userTeam = await Team.findById(profile.teams[i]._id);
      if (userTeam.creator.toString() === req.user.id) {
        teamsToDelete.unshift(profile.teams[i]._id);
      } else {
        teamsToRemoveUserFrom.unshift(profile.teams[i]._id);
      }
    }

    // Remove user from members array for teams they didn't create
    for (let i = 0; i < teamsToRemoveUserFrom.length; i++) {
      const team = await Team.findById(teamsToRemoveUserFrom[i]);
      const removeUserIndex = team.members
        .map((member) => member._id)
        .indexOf(req.user.id);
      team.members.splice(removeUserIndex, 1);
      await team.save();
    }

    // Remove team from team member's teams
    for (let i = 0; i < teamsToDelete.length; i++) {
      const team = await Team.findById(teamsToDelete[i]);
      for (let j = 0; j < team.members.length; j++) {
        const teamMember = await Profile.findOne({
          user: team.members[j]._id,
        });

        if (team.members[j].status === "Accepted") {
          const removeTeamIndex = teamMember.teams
            .map((team) => team._id)
            .indexOf(teamsToDelete[i]);
          teamMember.teams.splice(removeTeamIndex, 1);
          await teamMember.save();
        } else {
          const removeRequestIndex = teamMember.receivedRequest
            .map((request) => request._id)
            .indexOf(teamsToDelete[i]);
          teamMember.receivedRequest.splice(removeRequestIndex, 1);
          await teamMember.save();
        }
      }
    }

    // Delete Team(s)
    for (let i = 0; i < teamsToDelete.length; i++) {
      const teamRemoval = await Team.findById(teamsToDelete[i]);
      await teamRemoval.remove();
    }

    // Remove from contacts
    for (let i = 0; i < profile.people.length; i++) {
      const friendProfile = await Profile.findOne({
        user: profile.people[i]._id,
      });

      const removeUserIndex = friendProfile.people
        .map((person) => person._id)
        .indexOf(req.user.id);
      friendProfile.people.splice(removeUserIndex, 1);
      await friendProfile.save();
    }

    // Remove from sentRequest
    for (let i = 0; i < profile.sentRequest.length; i++) {
      const friendProfile = await Profile.findOne({
        user: profile.sentRequest[i]._id,
      });

      const removeUserIndex = friendProfile.receivedRequest
        .map((request) => request._id)
        .indexOf(req.user.id);

      friendProfile.receivedRequest.splice(removeUserIndex, 1);
      await friendProfile.save();
    }

    // Remove from receivedRequest
    for (let i = 0; i < profile.receivedRequest.length; i++) {
      const friendProfile = await Profile.findOne({
        user: profile.receivedRequest[i]._id,
      });

      if (!friendProfile) {
        const teamRequest = await Team.findById(profile.receivedRequest[i]._id);

        const removeUserIndex = teamRequest.members
          .map((member) => member._id)
          .indexOf(req.user.id);
        teamRequest.members.splice(removeUserIndex, 1);
        await teamRequest.save();
      } else {
        const removeUserIndex = friendProfile.sentRequest
          .map((request) => request._id)
          .indexOf(req.user.id);
        friendProfile.sentRequest.splice(removeUserIndex, 1);
        await friendProfile.save();
      }
    }

    // Delete User & Profile
    await user.remove();
    await profile.remove();

    res.json({ msg: "Account Deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
