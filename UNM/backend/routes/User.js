const express = require("express");
const router = express.Router();
const authController = require("../Controllers/userController");
const auth = require("../middlewares/auth");


router.post("/login", authController.login);

// Route protégée
router.get("/profile", auth, (req, res) => {
  res.json({ message: "Bienvenue dans ton profil", user: req.user });
});

module.exports = router;
