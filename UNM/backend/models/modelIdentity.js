import mongoose from "mongoose";

// Schéma des piliers avec champs multilingues
const pilierSchema = new mongoose.Schema({
  titre: {
    fr: { type: String, required: true },
    en: { type: String },
    zh: { type: String }
  },
  description: {
    fr: { type: String, required: true },
    en: { type: String },
    zh: { type: String }
  }
});

// Schéma principal Entreprise
const entrepriseSchema = new mongoose.Schema(
  {
    titre: {
      fr: { type: String, required: true, trim: true },
      en: { type: String, trim: true },
      zh: { type: String, trim: true }
    },
    historiques: {
      fr: { type: String, required: true },
      en: { type: String },
      zh: { type: String }
    },
    theme: {
      fr: { type: String, required: true },
      en: { type: String },
      zh: { type: String }
    },
    photoIdentite: { type: String },
    photoPiliers: { type: String },

    // Tableau de piliers (max 3)
    piliers: {
      type: [pilierSchema],
      validate: [arrayLimit, "{PATH} exceeds the limit of 3"]
    },

    // Identité : tableau de chaînes multilingues
    identite: {
      fr: { type: [String], validate: [arrayLimit, "{PATH} exceeds the limit of 3"] },
      en: { type: [String], validate: [arrayLimit, "{PATH} exceeds the limit of 3"] },
      zh: { type: [String], validate: [arrayLimit, "{PATH} exceeds the limit of 3"] }
    }
  },
  { timestamps: true }
);

function arrayLimit(val) {
  return val.length <= 3;
}

export default mongoose.model("Entreprise", entrepriseSchema);
