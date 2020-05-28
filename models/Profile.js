const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    jobTitle: {
      type: String,
    },
    department: {
      type: String,
    },
    organization: {
      type: String,
    },
    location: {
      type: String,
    },
    projects: [
      {
        project: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "project",
        },
      },
    ],
    teams: [
      {
        team: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "team",
        },
      },
    ],
    people: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
      },
    ],
    sentRequest: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
      },
    ],
    receivedRequest: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
      },
    ],
  },
  { versionKey: false }
);

module.exports = Profile = mongoose.model("profile", ProfileSchema);
