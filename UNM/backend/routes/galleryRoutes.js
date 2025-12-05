import express from "express";
import multer from "multer";
import path from "path";
import { createPhoto, getAllPhotos, deletePhoto } from "../Controllers/gallery.js";

const router = express.Router();

// Multer pour uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// Routes CRUD
router.post("/", upload.single("photo"), createPhoto);
router.get("/", getAllPhotos);
router.delete("/:id", deletePhoto);

export default router;
