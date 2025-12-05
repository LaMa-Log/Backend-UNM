const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploads");
const ctrl = require("../Controllers/preparation");

router.post(
  "/",
  upload.array("photos", 4),
  ctrl.createPreparation
);

router.get("/", ctrl.getPreparations);

router.put(
  "/:id",
  upload.array("photos", 4),
  ctrl.updatePreparation
);

router.delete("/:id", ctrl.deletePreparation);

module.exports = router;