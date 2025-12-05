const multer = require("multer");
const path = require("path");

// Dossier de destination
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/"); // dossier où les images iront
  },
  filename(req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

// Filtre pour accepter seulement les images
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Format non supporté"), false);
};

module.exports = multer({ storage, fileFilter });
