const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
  },
  teamDescription: {
    type: String,
  },
  members: [
    {
      member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      status: {
        type: String,
        default: "Invited",
      },
    },
  ],
  projects: [
    {
      project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "project",
      },
    },
  ],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

module.exports = Team = mongoose.model("team", TeamSchema);
