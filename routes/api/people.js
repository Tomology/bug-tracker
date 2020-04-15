const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");
const Profile = require("../../models/Profile");

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
        (request) => request.id === person.id.toString()
      ).length > 0
    ) {
      // Remove from sentRequest array
      const sentRequestIndex = profile.sentRequest.map((request) =>
        request.id.toString().indexOf(req.user.id)
      );
      profile.sentRequest.splice(sentRequestIndex, 1);

      // Remove from receivedRequest array
      const receivedRequestIndex = currentUserProfile.receivedRequest.map(
        (request) => request.id.indexOf(person.id.toString())
      );
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
    res.json(profile.receivedRequest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route       POST api/people/:id/requests/:request_id
// @desc        Accept or decline friend requests
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

      const requestingUserProfile = await Profile.findOne({
        user: req.params.request_id,
      });

      // Check if friend request received
      if (
        currentUserProfile.receivedRequest.filter(
          (request) => request.id === req.params.request_id
        ).length === 0
      ) {
        return res
          .status(400)
          .json({ msg: "You haven't received a request from this user." });
      }

      // Remove from receivedRequest
      const receivedRequestIndex = currentUserProfile.receivedRequest.map(
        (request) => request.id.indexOf(user.id.toString())
      );

      currentUserProfile.receivedRequest.splice(receivedRequestIndex, 1);

      // Remove from sentRequest
      const sentRequestIndex = requestingUserProfile.sentRequest
        .map((request) => request.id.toString())
        .indexOf(req.user.id);

      requestingUserProfile.sentRequest.splice(sentRequestIndex, 1);

      // If Approve

      if (req.body.status === true) {
        currentUserProfile.people.unshift(req.params.request_id);
        requestingUserProfile.people.unshift(req.user.id);
      }

      await currentUserProfile.save();
      await requestingUserProfile.save();

      res.json({ currentUserProfile, requestingUserProfile });
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
