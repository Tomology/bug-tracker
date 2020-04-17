const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Team = require("../../models/Team");

// @route       GET api/bugtest/:id/request/:request_id
// @desc        Test bugs out
// @access      Private
router.get("/:id/request/:request_id", auth, async (req, res) => {
  const team = await Team.findById(req.params.request_id);
  const currentUserProfile = await Profile.findOne({ user: req.user.id });
  const user = await User.findById(req.user.id);
  try {
    // Remove declined user from members

    const removeMemberIndex = team.members
      .map((member) => member._id)
      .indexOf(req.params.id);

    team.members.splice(removeMemberIndex, 1);

    console.log(team);

    res.json({});
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
