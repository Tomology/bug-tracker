const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const projectAccess = require("../../middleware/projectAccess");

const Project = require("../../models/Project");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Team = require("../../models/Team");

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
      const profile = await Profile.findOne({ user: req.user.id });

      const { projectName, key, sharedWith } = req.body;

      const newProject = new Project({
        projectName: projectName,
        key: key,
        user: req.user.id,
        sharedWith: sharedWith,
      });

      const project = await newProject.save();

      profile.projects.unshift(project.id);

      await profile.save();

      // If shared, add project to the user/team

      const shareProject = (sharedWithArray) => {
        sharedWithArray.map(async (sharee) => {
          const sharedWithProfile = await Profile.findOne({ user: sharee._id });
          if (!sharedWithProfile) {
            const sharedWithTeam = await Team.findById(sharee._id);
            sharedWithTeam.projects.unshift(project.id);
            await sharedWithTeam.save();
          }
          sharedWithProfile.projects.unshift(project.id);
          await sharedWithProfile.save();
        });
      };

      if (sharedWith) {
        shareProject(sharedWith);
      }

      res.json({ project, profile });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route       POST api/projects/:project_id
// @desc        Update/Edit Project
// @access      Private
router.post("/:project_id", auth, async (req, res) => {
  try {
    let project = await Project.findById(req.params.project_id);

    // Check user
    if (req.user.id !== project.user.toString()) {
      return res
        .status(401)
        .json({ msg: "You can't edit a project you didn't create. " });
    }

    const { projectName, key, sharedWith } = req.body;

    // Create update object
    const updateFields = {};
    if (projectName) updateFields.projectName = projectName;
    if (key) updateFields.key = key;
    if (sharedWith) {
      const currentSharees = project.sharedWith.map((sharee) =>
        sharee._id.toString()
      );
      // Remove users/teams with whom the project has already been shared
      const newSharees = sharedWith
        .map((sharee) => sharee._id)
        .filter((sharee) => currentSharees.indexOf(sharee) === -1);

      for (let i = 0; i < newSharees.length; i++) {
        const shareeProfile = await Profile.findOne({ user: newSharees[i] });
        if (!shareeProfile) {
          const team = await Team.findById(newSharees[i]);
          console.log(team);
          team.projects.unshift(project.id);
          project.sharedWith.unshift(newSharees[i]);
          await team.save();
          await project.save();
        } else {
          shareeProfile.projects.unshift(project.id);
          project.sharedWith.unshift(newSharees[i]);
          await shareeProfile.save();
          await project.save();
        }
      }
    }

    project = await Project.findByIdAndUpdate(
      req.params.project_id,
      {
        $set: updateFields,
      },
      { new: true }
    );

    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route       DELETE api/projects/:project_id/:shared_with_id
// @desc        Unshare Project with User
// @access      Private
router.delete("/:project_id/:shared_with_id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.project_id);
    const shareeProfile = await Profile.findOne({
      user: req.params.shared_with_id,
    });
    const team = await Team.findById(req.params.shared_with_id);

    // Check whether project creator, user themselves, or team creator
    let projectCreator = req.user.id === project.user.toString();
    let userThemselves = false;
    let teamCreator = false;
    if (team) {
      teamCreator = req.user.id === team.creator.toString();
    }

    if (shareeProfile) {
      userThemselves = req.user.id === shareeProfile.user.toString();
    }

    if (
      projectCreator === false &&
      userThemselves === false &&
      teamCreator === false
    ) {
      return res.json({ msg: "You are unauthorized to remove user" });
    }

    if (team) {
      const removeIndex = team.projects
        .map((project) => project.id)
        .indexOf(req.params.project_id);

      if (removeIndex === -1) {
        return res.json({ msg: "Bad Request - Team" });
      }

      team.projects.splice(removeIndex, 1);
      await team.save();
    }

    if (shareeProfile) {
      const removeIndex = shareeProfile.projects
        .map((project) => project.id)
        .indexOf(req.params.project_id);

      if (removeIndex === -1) {
        return res.json({ msg: "Bad Request - User" });
      }

      shareeProfile.projects.splice(removeIndex, 1);
      await shareeProfile.save();
    }

    const removeIndex = project.sharedWith
      .map((sharee) => sharee.id)
      .indexOf(req.params.shared_with_id);

    project.sharedWith.splice(removeIndex, 1);

    await project.save();

    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route       GET api/projects
// @desc        Get all projects
// @access      Private

router.get("/", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    const allProjectIds = [...profile.projects];

    // Get all team projects ids
    for (let i = 0; i < profile.teams.length; i++) {
      const teamProjects = await Team.findById(profile.teams[i]._id);
      teamProjects.projects.map((project) => allProjectIds.unshift(project));
    }

    // Get all projects and remove duplicates
    const allProjects = [];
    for (let i = 0; i < allProjectIds.length; i++) {
      const project = await Project.findById(allProjectIds[i]).select([
        "projectName",
        "key",
        "user",
      ]);

      if (
        allProjects
          .map((item) => item._id.toString())
          .indexOf(project._id.toString()) === -1
      ) {
        allProjects.unshift(project);
      }
    }

    res.json(allProjects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route       GET api/projects/:project_id
// @desc        Get project by id
// @access      Private

router.get("/:project_id", [auth, projectAccess], async (req, res) => {
  try {
    const project = await Project.findById(req.params.project_id);

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

// @route       DELETE api/projects/:project_id
// @desc        Delete project by id
// @access      Private

router.delete("/:project_id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.project_id);

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    // Check user
    if (project.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ msg: "You can't delete a project you didn't create." });
    }

    // Remove project from all users/teams it has been shared with
    project.sharedWith.map(async (sharee) => {
      const shareProfile = await Profile.findOne({ user: sharee._id });
      if (!shareProfile) {
        const shareTeam = await Team.findById(sharee._id);
        const removeIndex = shareTeam.projects
          .map((project) => project._id)
          .indexOf(req.params.id);
        shareTeam.projects.splice(removeIndex, 1);

        await shareTeam.save();
      } else {
        const removeIndex = shareProfile.projects
          .map((project) => project._id)
          .indexOf(req.params.id);
        shareProfile.projects.splice(removeIndex, 1);

        await shareProfile.save();
      }
    });

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

// @route       POST api/projects/:project_id/issues
// @desc        Create an issue on a project
// @access      Private
router.post(
  "/:project_id/issues",
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
      const project = await Project.findById(req.params.project_id);

      const {
        issueType,
        summary,
        description,
        priority,
        assignee,
        dueDate,
      } = req.body;

      const newIssue = {
        issueType: issueType,
        summary: summary,
        description: description,
        priority: priority,
        name: user.name,
        user: req.user.id,
        assignee: assignee,
        dueDate: dueDate,
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

// @route       POST api/projects/:project_id/issues/:issue_id
// @desc        Change progress on an issue
// @access      Private
router.post("/project_id/issues/:issue_id", auth, async (req, res) => {
  try {
    let project = await Project.findById(req.params.project_id);
    const {
      issueType,
      summary,
      description,
      priority,
      progress,
      assignee,
      dueDate,
    } = req.body;

    if (!progress) {
      return res.status(400).json({ msg: "Bad Request" });
    }

    project = await Project.findOneAndUpdate(
      {
        _id: project.id,
        "issues._id": req.params.issue_id,
      },
      {
        $set: {
          "issues.$.progress.progress": `${progress}`,
          "issues.$.progress.user": `${req.user.id}`,
        },
      },
      { new: true }
    );

    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route       DELETE api/projects/:project_id/issues/:issue_id
// @desc        Delete an issue
// @access      Private
router.delete("/:project_id/issues/:issue_id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.project_id);

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

// @route      POST api/projects/:project_id/issues/:issue_id/comments
// @desc       Write comment on issue
// @access     Private
router.post(
  "/:project_id/issues/:issue_id/comments",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const project = await Project.findById(req.params.project_id);

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

// @route       DELETE api/projects/:project_id/issues/:issue_id/comments/:comment_id
// @desc        Delete a comment
// @access      Private
router.delete(
  "/:project_id/issues/:issue_id/comments/:comment_id",
  auth,
  async (req, res) => {
    try {
      const project = await Project.findById(req.params.project_id);

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
  }
);

module.exports = router;
