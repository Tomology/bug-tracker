const Profile = require("../models/Profile");
const Team = require("../models/Team");

module.exports = async function (req, res, next) {
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
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid User" });
  }
};
