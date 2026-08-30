const express = require("express");
const router = express.Router();
const { createIssue, getIssues, updateIssueStatus } = require("../controllers/issueController");

router.route("/").post(createIssue).get(getIssues);
router.route("/:id").put(updateIssueStatus);

module.exports = router;
