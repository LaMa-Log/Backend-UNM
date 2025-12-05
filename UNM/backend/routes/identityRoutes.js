import express from "express";
import multer from "multer";
import { createOrUpdateEntreprise, getEntreprises, deleteEntreprise } from "../Controllers/Identity.js";

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// Upload deux fichiers différents : photoIdentite et photoPiliers
const cpUpload = upload.fields([
  { name: "photoIdentite", maxCount: 1 },
  { name: "photoPiliers", maxCount: 1 }
]);

// Routes
router.post("/", cpUpload, createOrUpdateEntreprise);
router.put("/", cpUpload, createOrUpdateEntreprise);
router.get("/", getEntreprises);
router.delete("/:id", deleteEntreprise);

export default router;
