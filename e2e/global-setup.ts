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
    console.log("✅ configuration globale e2e terminée");
  } catch (error) {
    console.error("❌ erreur configuration globale:", error);
  }
}

export default globalSetup;
