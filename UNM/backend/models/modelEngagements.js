const mongoose = require("mongoose");

const engagementSchema = new mongoose.Schema(
  {
    titre1: {
      fr: { type: String, required: true },
      en: { type: String },
      zh: { type: String }
    },
    descTitre1: {
      fr: { type: String },
      en: { type: String },
      zh: { type: String }
    },
    titre2: {
      fr: { type: String },
      en: { type: String },
      zh: { type: String }
    },
    descTitre2: {
      fr: { type: String },
      en: { type: String },
      zh: { type: String }
    },
    items: [
      {
        fr: { type: String },
        en: { type: String },
        zh: { type: String }
      }
    ] // tableau d’items multilingues
  },
  { timestamps: true }
);

module.exports = mongoose.model("Engagement", engagementSchema);
