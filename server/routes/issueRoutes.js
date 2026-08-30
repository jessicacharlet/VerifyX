const express = require("express");
const router = express.Router();
const {
  createIssue,
  getIssues,
  updateIssueStatus,
  processReplacement,
} = require("../controllers/issueController");

router.route("/").post(createIssue).get(getIssues);
router.route("/:id").put(updateIssueStatus);
router.route("/:id/replacement").post(processReplacement);

module.exports = router;
