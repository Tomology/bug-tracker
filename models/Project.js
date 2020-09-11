const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    name: {
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
    url: {
      type: String,
    },
    sharedWith: [
      {
        sharee: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
        name: {
          type: String,
        },
      },
    ],
    issues: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
        name: {
          type: String,
        },
        issueName: {
          type: String,
          required: true,
        },
        issueNumber: {
          type: Number,
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
          name: { type: String },
          date: {
            type: Date,
            default: Date.now,
          },
        },
        assignee: [
          {
            user: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "user",
            },
            name: {
              type: String,
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
            name: {
              type: String,
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
  },
  { versionKey: false }
);

module.exports = Project = mongoose.model("project", ProjectSchema);
