const mongoose = require("mongoose");

const engagementSchema = new mongoose.Schema(
  {
    titre1: { type: String, required: true },
    descTitre1: { type: String },
    titre2: { type: String },
    descTitre2: { type: String },
    items: [{ type: String }], // tableau d’items
  },
  { timestamps: true }
);

module.exports = mongoose.model("Engagement", engagementSchema);
