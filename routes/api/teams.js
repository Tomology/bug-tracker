const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

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
        teamName: teamName,
        teamDescription: teamDescription,
        creator: req.user.id,
        members: members,
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

      if (members) {
        sendInvite(members);
      }

      res.json(team);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route       POST api/teams/:team_id
// @desc        Edit/Update Team
// @access      Private
router.post("/:team_id", auth, async (req, res) => {
  try {
    let team = await Team.findById(req.params.team_id);

    // Check User
    if (team.creator.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ msg: "Only the team creator can make changes to the team" });
    }
    const { teamName, teamDescription, members } = req.body;

    const updateFields = {};
    if (teamName) updateFields.teamName = teamName;
    if (teamDescription) updateFields.teamDescription = teamDescription;
    if (members) {
      const currentTeamMembers = team.members.map((member) =>
        member._id.toString()
      );

      // Remove any users who already are members/have an invite pending
      const membersToInvite = members
        .map((member) => member._id)
        .filter((member) => currentTeamMembers.indexOf(member) === -1);

      for (let i = 0; i < membersToInvite.length; i++) {
        // Send out invites
        const profile = await Profile.findOne({ user: membersToInvite[i] });
        profile.receivedRequest.unshift(req.params.team_id);
        await profile.save();
        // Add to team members
        team.members.unshift(membersToInvite[i]);
        await team.save();
      }
    }

    team = await Team.findByIdAndUpdate(
      req.params.team_id,
      {
        $set: updateFields,
      },
      { new: true }
    );
    const creator = await User.findById(team.creator).select([
      "firstName",
      "lastName",
    ]);

    const teamMembers = [];
    const projects = [];

    for (let i = 0; i < team.members.length; i++) {
      const member = await User.findById(team.members[i]._id).select([
        "firstName",
        "lastName",
      ]);

      teamMembers.push(member);
    }

    for (let i = 0; i < team.projects.length; i++) {
      const project = await Project.findById(team.projects[i]._id).select([
        "projectName",
        "key",
      ]);

      projects.push(project);
    }

    res.json({ team, creator, teamMembers, projects });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route       DELETE api/teams/:team_id
// @desc        Delete Team
// @access      Private
router.delete("/:team_id", auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.team_id);
    if (req.user.id !== team.creator.toString()) {
      return res
        .status(401)
        .json({ msg: "You can't delete a team you didn't create" });
    }

    // Remove team from creator's teams array
    const creatorProfile = await Profile.findOne({ user: req.user.id });
    removeIndex = creatorProfile.teams.map((team) => team._id).indexOf(team.id);
    creatorProfile.teams.splice(removeIndex, 1);
    await creatorProfile.save();

    // Remove team from team members teams array
    for (let i = 0; i < team.members.length; i++) {
      const teamMember = await Profile.findOne({
        user: team.members[i]._id,
      });
      if (team.members[i].status === "Accepted") {
        removeIndex = teamMember.teams.map((team) => team._id).indexOf(team.id);
        teamMember.teams.splice(removeIndex, 1);
        await teamMember.save();
      } else {
        removeIndex = teamMember.receivedRequest
          .map((request) => request._id)
          .indexOf(team.id);
        teamMember.receivedRequest.splice(removeIndex, 1);
        await teamMember.save();
      }
    }

    await team.remove();
    res.json({ msg: "Team removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route       DELETE api/teams/:team_id/:member_id
// @desc        Remove member from team
// @access      Private
router.delete("/:team_id/:member_id", auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.team_id);
    const teamMember = await Profile.findOne({ user: req.params.member_id });

    // Check user
    const teamCreator = req.user.id === team.creator.toString();
    const memberThemselves = req.user.id === req.params.member_id;

    if (!teamCreator && !memberThemselves) {
      return res
        .status(401)
        .json({ msg: "Unauthorized to remove team member" });
    }

    // Remove member from team
    const removeMemberIndex = team.members
      .map((member) => member._id)
      .indexOf(req.params.member_id);

    if (removeMemberIndex === -1) {
      return res.json({
        msg: "Bad Request - User is not a member of this team ",
      });
    }
    const removedMember = team.members.splice(removeMemberIndex, 1);

    await team.save();

    // Remove team from member's teams
    if (removedMember[0].status === "Invited") {
      const removeRequestIndex = teamMember.receivedRequest
        .map((request) => request._id)
        .indexOf(team.id);
      teamMember.receivedRequest.splice(removeRequestIndex, 1);

      await teamMember.save();
    } else {
      const removeTeamIndex = teamMember.teams
        .map((team) => team._id)
        .indexOf(team.id);

      teamMember.teams.splice(removeTeamIndex, 1);
      await teamMember.save();
    }

    res.json({ msg: "Team member removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route       GET api/teams
// @desc        Get all teams of which you are a member
// @access      Private
router.get("/", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    const teams = [];

    for (let i = 0; i < profile.teams.length; i++) {
      const team = await Team.findById(profile.teams[i])
        .select(["teamName", "creator", "members"])
        .populate("creator", ["firstName", "lastName"]);
      teams.push(team);
    }

    res.json(teams);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route       GET api/teams/:team_id
// @desc        Get a team by id
// @access      Private
router.get("/:team_id", auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.team_id);

    // Check if creator
    const teamCreator = team.creator.toString() === req.user.id;
    const teamMember =
      team.members.map((member) => member._id).indexOf(req.user.id) !== -1;

    // Check if user is member/creator of team
    if (!teamCreator && !teamMember) {
      return res
        .status(401)
        .json({ msg: "You can't access a team of which you aren't a member." });
    }

    const creator = await User.findById(team.creator).select([
      "firstName",
      "lastName",
    ]);

    const teamMembers = [];
    const projects = [];

    for (let i = 0; i < team.members.length; i++) {
      const member = await User.findById(team.members[i]._id).select([
        "firstName",
        "lastName",
      ]);

      teamMembers.push(member);
    }

    for (let i = 0; i < team.projects.length; i++) {
      const project = await Project.findById(team.projects[i]._id).select([
        "projectName",
        "key",
      ]);

      projects.push(project);
    }

    res.json({ team, creator, teamMembers, projects });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
