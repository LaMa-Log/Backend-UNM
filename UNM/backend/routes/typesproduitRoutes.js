// routes/typeProduitRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploads");
const typeProduitController = require("../Controllers/typesProduit");

router.post("/", upload.array("photos", 2), typeProduitController.createTypeProduit);

router.get("/", typeProduitController.getAllTypeProduits);

router.get("/:id", typeProduitController.getTypeProduitById);

router.put("/:id", upload.array("photos", 2), typeProduitController.updateTypeProduit);

router.delete("/:id", typeProduitController.deleteTypeProduit);

module.exports = router;
