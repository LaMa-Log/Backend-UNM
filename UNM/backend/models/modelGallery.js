import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
  photo: { type: String, required: true }, // Nom du fichier uploadé
}, { timestamps: true });

export default mongoose.model("Gallery", gallerySchema);
