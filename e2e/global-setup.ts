import { FullConfig } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

// Fonction pour réchauffer la base de données serverless
async function warmupServerlessDatabase() {
  try {
    console.log("🔥 Réchauffement de la base de données serverless...");

    // Faire plusieurs tentatives pour "réveiller" la DB
    const maxRetries = 5;
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch("http://localhost:3000/api/health", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          console.log("✅ Base de données serverless prête");
          return;
        }
      } catch (error) {
        console.log(`Tentative ${i + 1}/${maxRetries} - DB pas encore prête`);
        // Attendre progressivement plus longtemps entre les tentatives
        await new Promise((resolve) => setTimeout(resolve, (i + 1) * 2000));
      }
    }

    console.log(
      "⚠️ Impossible de confirmer l'état de la DB, continuons quand même...",
    );
  } catch (error) {
    console.log("⚠️ Erreur lors du warm-up de la DB:", error);
  }
}

// création des répertoires et fichiers nécessaires
async function ensureDirectories() {
  const authDir = path.join("playwright", ".auth");

  // création des répertoires
  if (!fs.existsSync("playwright")) fs.mkdirSync("playwright");
  if (!fs.existsSync(authDir)) fs.mkdirSync(authDir);

  // création des fichiers d'état vides si nécessaire
  const authFiles = [
    path.join(authDir, "user.json"),
    path.join(authDir, "farmer.json"),
    path.join(authDir, "admin.json"),
  ];

  // initialiser les fichiers vides pour éviter les erreurs
  for (const file of authFiles) {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify({ cookies: [], origins: [] }));
    }
  }
}

// configuration globale avant exécution des tests
async function globalSetup(config: FullConfig) {
  try {
    await ensureDirectories();

    // Délai simple pour laisser la DB serverless s'activer
    await new Promise((resolve) => setTimeout(resolve, 5000));
  } catch (error) {
    console.error("Erreur configuration globale:", error);
  }
}

export default globalSetup;
