const mongoose = require("mongoose");

const produitItemSchema = new mongoose.Schema({
  photo: { type: String, required: false },
  photo_title: { type: String, required: true },
  photo_desc: { type: String, required: true },
});

const produitSchema = new mongoose.Schema({
  title: { type: String, required: true },
  title_desc: { type: String, required: true },
  preparation: {
    type: [produitItemSchema],
    validate: {
      validator: (val) => val.length <= 4,
      message: "Le produit ne peut contenir que 4 éléments maximum.",
    },
    default: [],
  },
});

module.exports = mongoose.model("Produit", produitSchema);
