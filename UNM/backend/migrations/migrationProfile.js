import mongoose from "mongoose";
import Profile from "../models/modelProfil.js"; // adapte le chemin selon ton projet

// Connexion à MongoDB
mongoose.connect("mongodb://localhost:27017/tonDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function migrateProfiles() {
  try {
    const profiles = await Profile.find({
      $or: [
        { title: { $type: "string" } },
        { title_desc: { $type: "string" } }
      ]
    });

    console.log(`Profils à migrer : ${profiles.length}`);

    for (const profile of profiles) {
      const updateData = {};

      if (typeof profile.title === "string") {
        updateData.title = { fr: profile.title };
      }
      if (typeof profile.title_desc === "string") {
        updateData.title_desc = { fr: profile.title_desc };
      }

      await Profile.updateOne({ _id: profile._id }, { $set: updateData });
      console.log(`Migré profil ${profile._id}`);
    }

    console.log("Migration terminée ✅");
    process.exit(0);
  } catch (err) {
    console.error("Erreur migration :", err);
    process.exit(1);
  }
}

migrateProfiles();
