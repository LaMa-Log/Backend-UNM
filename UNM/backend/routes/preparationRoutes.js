const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploads"); // ton middleware multer
const ctrl = require("../Controllers/preparation");

// CREATE : accepte jusqu'à 4 photos
router.post(
  "/",
  upload.array("photos", 5),
  ctrl.createPreparation
);

// READ : possibilité de passer ?lang=fr|en|zh
router.get("/", ctrl.getPreparations);

// UPDATE : accepte jusqu'à 4 photos
router.put(
  "/:id",
  upload.array("photos", 5),
  ctrl.updatePreparation
);

module.exports = router;
