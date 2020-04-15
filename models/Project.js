const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    // if user deletes profile, their name on the project remains.
    type: String,
  },
  avatar: {
    type: String,
  },
  projectName: {
    type: String,
    required: true,
  },
  key: {
    type: String,
    required: true,
  },
  issues: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      issueType: {
        type: String,
        required: true,
      },
      summary: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      priority: {
        type: String,
        required: true,
      },
      assignee: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        },
      ],
      dueDate: {
        type: Date,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      comments: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          text: {
            type: String,
            required: true,
          },
          name: {
            type: String,
          },
          avatar: {
            type: String,
          },
          date: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Project = mongoose.model("Project", ProjectSchema);
