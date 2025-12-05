// models/TypeProduit.js
const mongoose = require('mongoose');

const contenuSchema = new mongoose.Schema({
  titreContenu: { type: String, required: true },
  items: [{ type: String }] // tableau de plusieurs items
});

const typeProduitSchema = new mongoose.Schema({
  titreProduit: { type: String, required: true },
  descProduit: { type: String },
  photoProduit: { type: String }, 
  contenus: [contenuSchema] 
}, { timestamps: true });

module.exports = mongoose.model('TypeProduit', typeProduitSchema);
