const express = require("express");
const router = express.Router();

// @route       GET api/your-work
// @desc        Test route
// @access      Private
router.get("/", (req, res) => res.send("Your-work route"));

module.exports = router;
