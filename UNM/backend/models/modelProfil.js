import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    // Champs multilingues
    title: {
      fr: { type: String, required: true, trim: true },
      en: { type: String, trim: true },
      zh: { type: String, trim: true },
    },
    title_desc: {
      fr: { type: String, required: true },
      en: { type: String },
      zh: { type: String },
    },

    // Photo de profil
    profilePhoto: { type: String }, // URL ou chemin du fichier
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
