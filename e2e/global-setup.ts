import { FullConfig } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

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
