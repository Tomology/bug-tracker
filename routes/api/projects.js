const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

const Project = require("../../models/Project");
const User = require("../../models/User");

// @route       POST api/projects
// @desc        Create a project
// @access      Private

router.post(
  "/",
  [
    auth,
    [
      check("projectName", "Project name is required").not().isEmpty(),
      check("key", "Key is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      const newProject = new Project({
        projectName: req.body.projectName,
        key: req.body.key,
        name: user.name,
        // add avatar
        user: req.user.id,
      });

      const project = await newProject.save();

      res.json(project);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route       GET api/projects
// @desc        Get all projects
// @access      Private

router.get("/", auth, async (req, res) => {
  try {
    const projects = await Project.find().sort({ date: -1 });
    res.json({ projects });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route       GET api/projects/:id
// @desc        Get project by id
// @access      Private

router.get("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    res.json({ project });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Project not found" });
    }
    res.status(500).send("Server error");
  }
});

// @route       DELETE api/projects/:id
// @desc        Delete project by id
// @access      Private

router.delete("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    // Check user
    if (project.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ msg: "You can't delete a project you didn't create." });
    }

    await project.remove();

    res.json({ msg: "Project removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Project not found" });
    }
    res.status(500).send("Server error");
  }
});

// @route       POST api/projects/issues/:id
// @desc        Create an issue on a project
// @access      Private
router.post(
  "/issues/:id",
  [
    auth,
    [
      check("issueType", "Issue type is required").not().isEmpty(),
      check("summary", "Summary is required").not().isEmpty(),
      check("description", "Description is required").not().isEmpty(),
      check("priority", "Priority is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const project = await Project.findById(req.params.id);

      const newIssue = {
        issueType: req.body.issueType,
        summary: req.body.summary,
        description: req.body.description,
        priority: req.body.priority,
        name: user.name,
        user: req.user.id,
        assignee: req.body.assignee,
        dueDate: req.body.dueDate,
      };

      project.issues.unshift(newIssue);

      await project.save();

      res.json(project.issues);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route       DELETE api/projects/issues/:id/:issue_id
// @desc        Delete an issue
// @access      Private
router.delete("/issues/:id/:issue_id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    // Pull out issue
    const issue = project.issues.find(
      (issue) => issue.id === req.params.issue_id
    );

    // Make sure issue exists
    if (!issue) {
      return res.status(404).json({ msg: "Issue does not exist" });
    }

    // Check user
    if (issue.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ msg: "You can't delete an issue you didn't create." });
    }

    // Remove index
    const removeIndex = project.issues
      .map((issue) => issue.id.toString())
      .indexOf(req.params.issue_id);

    project.issues.splice(removeIndex, 1);
    await project.save();
    res.json(project.issues);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route       POST api/projects/issues/:id/:issue_id/
// @desc        Write comment on issue
// @access      Private
router.post(
  "/issues/:id/:issue_id/",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const project = await Project.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        // add avatar
        user: req.user.id,
      };

      // Find index of issue
      const issueIndex = project.issues
        .map((issue) => issue.id.toString())
        .indexOf(req.params.issue_id);

      project.issues[issueIndex]["comments"].unshift(newComment);

      await project.save();

      res.json(project.issues[issueIndex]["comments"]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route       DELETE api/projects/issues/:id/:issue_id/:comment_id
// @desc        Delete a comment
// @access      Private
router.delete("/issues/:id/:issue_id/:comment_id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    // Pull out issue
    const issue = project.issues.find(
      (issue) => issue.id === req.params.issue_id
    );

    // Make sure issue exists
    if (!issue) {
      return res.status(404).json({ msg: "Issue does not exist" });
    }

    // Pull out comment
    const comment = issue.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }

    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ msg: "You can't delete a comment you didn't create." });
    }

    // Remove index
    const removeIndex = issue.comments
      .map((comment) => comment.id.toString())
      .indexOf(req.params.comment_id);

    issue.comments.splice(removeIndex, 1);
    await project.save();
    res.json(issue.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
