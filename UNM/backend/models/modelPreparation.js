const mongoose = require("mongoose");

const preparationItemSchema = new mongoose.Schema({
  photo: { type: String, required: false },
  photo_title: { type: String, required: true },
  photo_desc: { type: String, required: true },
});

const preparationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  title_desc: { type: String, required: true },
  preparation: {
    type: [preparationItemSchema],
    validate: {
      validator: (val) => val.length <= 4,
      message: "La préparation ne peut contenir que 4 éléments maximum.",
    },
    default: [],
  },
});

module.exports = mongoose.model("Preparation", preparationSchema);