const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Team = require("../../models/Team");

// @route       N/A
// @desc        Test bugs out
// @access      Private
router.get("/:project_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    const allProjectIds = [...profile.projects];

    for (let i = 0; i < profile.teams.length; i++) {
      const team = await Team.findById(profile.teams[i]._id);
      team.projects.map((project) => allProjectIds.unshift(project));
    }

    if (
      allProjectIds
        .map((project) => project._id.toString())
        .indexOf(req.params.project_id) === -1
    ) {
      return res.status(401).json({ msg: "Unauthorized to access project" });
    }

    res.json(allProjectIds);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
