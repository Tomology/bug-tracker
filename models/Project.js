const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  projectName: {
    type: String,
    required: true,
  },
  key: {
    type: String,
    required: true,
  },
  sharedWith: [
    {
      sharee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    },
  ],
  issues: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
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
      progress: {
        progress: { type: String, default: "Open" },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
      },
      assignee: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
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
            ref: "user",
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

module.exports = Project = mongoose.model("project", ProjectSchema);
