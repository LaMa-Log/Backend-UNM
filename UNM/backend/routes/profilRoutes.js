const express = require("express");
const multer = require("multer");
const { createProfile, getProfiles, updateProfile, deleteProfile } = require("../Controllers/Profil");

const router = express.Router();

// Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });
// Routes
router.post("/", upload.single("profilePhoto"), createProfile);
router.get("/", getProfiles);
router.put("/", upload.single("profilePhoto"), updateProfile);
router.delete("/:id", deleteProfile);

module.exports = router; // <-- ici module.exports
