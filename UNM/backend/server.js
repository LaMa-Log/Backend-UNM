import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";

// Charger variables d'environnement
dotenv.config();

// Import des routes et initialisation admin
import { initializeAdmin } from "./Controllers/admin.js";
import authRoutes from "./routes/User.js";
import profileRoutes from "./routes/profilRoutes.js";
import identityRoutes from "./routes/identityRoutes.js";
import preparationRoutes from "./routes/preparationRoutes.js";
import produitRoutes from "./routes/produitRoutes.js";
import typesproduitRoutes from "./routes/typesproduitRoutes.js";
import engagementRoutes from "./routes/engagementsRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";


// Initialiser Express
const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir un dossier d'upload (images, fichiers...)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// --- Connexion MongoDB ---
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: process.env.MONGO_DB_NAME || "unm_database",
  })
  .then(async () => {
    const admin = await initializeAdmin();
    console.log("✅ Admin connecté sur", admin?.email || "aucun email défini");
  })
  .catch((err) => {
    console.error("❌ Erreur MongoDB :", err);
    process.exit(1);
  });

// --- ROUTES API ---
app.use("/api/auth", authRoutes); 
app.use("/api/profiles", profileRoutes); 
app.use("/api/entreprise", identityRoutes);
app.use("/api/preparation", preparationRoutes);
app.use("/api/produit", produitRoutes);
app.use("/api/typesproduit", typesproduitRoutes);
app.use("/api/engagement", engagementRoutes);
app.use("/api/gallery", galleryRoutes);

// Route test
app.get("/", (req, res) => {
  res.json({ message: "Backend UNM fonctionne 🎉" });
});

// --- Middleware global de gestion des erreurs ---
app.use((err, req, res, next) => {
  console.error("🔥 Erreur serveur :", err);
  res.status(500).json({
    error: "Erreur serveur",
    details: err.message,
  });
});

// --- Lancer le serveur ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
