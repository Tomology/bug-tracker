const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Team = require("../../models/Team");

// @route       POST api/teams
// @desc        Start a team
// @access      Private
router.post(
  "/",
  [auth, [check("teamName", "Team name is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      const { teamName, teamDescription, members } = req.body;

      const newTeam = new Team({
        teamName: req.body.teamName,
        teamDescription: req.body.teamDescription,
        creator: req.user.id,
        members: [...members],
      });

      const team = await newTeam.save();

      // Add team to user's team array
      profile.teams.unshift(team.id);
      await profile.save();

      // Send out invites to members
      const sendInvite = (memberArray) => {
        memberArray.map(async (member) => {
          const memberProfile = await Profile.findOne({ user: member._id });
          memberProfile.receivedRequest.unshift(team.id);
          await memberProfile.save();
        });
      };

      sendInvite(members);

      res.json({ team, profile });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
