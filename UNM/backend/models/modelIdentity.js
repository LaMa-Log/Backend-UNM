import mongoose from "mongoose";

const pilierSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String, required: true }
});

const entrepriseSchema = new mongoose.Schema({
  titre: { type: String, required: true, trim: true },
  historiques: { type: String, required: true },
  theme: { type: String, required: true },
  photoIdentite: { type: String },
  photoPiliers: { type: String },
  piliers: {
    type: [pilierSchema],
    validate: [arrayLimit, "{PATH} exceeds the limit of 3"]
  },
  identite: {
    type: [String],
    validate: [arrayLimit, "{PATH} exceeds the limit of 3"]
  }
}, { timestamps: true });

function arrayLimit(val) {
  return val.length <= 3;
}

export default mongoose.model("Entreprise", entrepriseSchema);
