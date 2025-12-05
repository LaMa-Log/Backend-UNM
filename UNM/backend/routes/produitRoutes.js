const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploads");
const ctrl = require("../Controllers/produit");

router.post(
  "/",
  upload.array("photos", 4),
  ctrl.createProduit
);

router.get("/", ctrl.getProduits);

router.put(
  "/:id",
  upload.array("photos", 4),
  ctrl.updateProduit
);

router.delete("/:id", ctrl.deleteProduit);

module.exports = router;