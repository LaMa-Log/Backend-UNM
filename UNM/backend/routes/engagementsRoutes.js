const express = require("express");
const router = express.Router();
const engagementController = require("../Controllers/engagements");

// CRUD complet
router.post("/", engagementController.createEngagement);
router.get("/", engagementController.getAllEngagements);
router.get("/:id", engagementController.getEngagementById);
router.put("/:id", engagementController.updateEngagement);
router.delete("/:id", engagementController.deleteEngagement);

module.exports = router;
