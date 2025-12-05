const User = require("../models/modelUsers");

require("dotenv").config();


const email = process.env.EMAIL;
const password = process.env.PASSWORD;

async function initializeAdmin() {
  try {
    // Vérifie si l'admin existe déjà
    const adminExists = await User.findOne({ email });
    if (!adminExists) {
      const admin = new User({ email, password });
      await admin.save();
      console.log("Utilisateur admin créé !");
    } else {
      console.log("L'utilisateur admin existe déjà.");
    }
  } catch (err) {
    console.error("Erreur lors de l'initialisation de l'admin :", err);
  }
}

module.exports = { initializeAdmin };
