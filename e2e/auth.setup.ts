import { test as setup, expect, Page } from "@playwright/test";

// fichiers de stockage d'état pour chaque type d'utilisateur
const GLEANER_AUTH_FILE = "playwright/.auth/user.json";
const FARMER_AUTH_FILE = "playwright/.auth/farmer.json";
const ADMIN_AUTH_FILE = "playwright/.auth/admin.json";

// fonction réutilisable pour l'authentification des utilisateurs
async function setupUserAuth(
  page: Page,
  email: string,
  password: string,
  targetUrl: string,
  roleSpecificSelector: string,
  authFile: string,
) {
  // connexion via la page de connexion
  await page.goto("/auth/signin");

  // attendre que la page soit complètement chargée
  await page.waitForLoadState("networkidle");

  // cliquer sur "utiliser un mot de passe" et remplir le formulaire
  await page.getByRole("button", { name: /utiliser un mot de passe/i }).click();
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Mot de passe").fill(password);

  // cliquer sur le bouton de connexion et attendre la redirection
  await Promise.all([
    page.waitForNavigation({ timeout: 30000 }),
    page.getByRole("button", { name: /connexion avec mot de passe/i }).click(),
  ]);

  // attendre que la page d'accueil soit chargée après la connexion
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2000); // attendre un peu plus pour s'assurer que l'authentification est complète

  // vérifier qu'on est bien connecté en vérifiant un élément commun aux utilisateurs connectés
  await expect(
    page.getByRole("button", { name: new RegExp(email.split("@")[0], "i") }),
  ).toBeVisible({ timeout: 15000 });

  // aller à la page spécifique au rôle pour confirmer les droits
  await page.goto(targetUrl);
  await page.waitForLoadState("networkidle");

  // vérifier la présence d'un élément spécifique au rôle
  await expect(
    page.getByRole("heading", { name: new RegExp(roleSpecificSelector, "i") }),
  ).toBeVisible({ timeout: 15000 });

  // sauvegarder l'état d'authentification une fois tout confirmé
  await page.context().storageState({ path: authFile });
  console.log(`Authentification réussie pour ${email} (${authFile})`);
}

// setup pour glaneur
setup("authentifier glaneur", async ({ page }) => {
  await setupUserAuth(
    page,
    "gleaner@field4u.be",
    "password123",
    "/my-gleanings",
    "mes glanages",
    GLEANER_AUTH_FILE,
  );
});

// setup pour agriculteur
setup("authentifier agriculteur", async ({ page }) => {
  await setupUserAuth(
    page,
    "farmer@field4u.be",
    "password123",
    "/farm",
    "mon exploitation|ferme",
    FARMER_AUTH_FILE,
  );
});

// setup pour administrateur
setup("authentifier administrateur", async ({ page }) => {
  await setupUserAuth(
    page,
    "admin@field4u.be",
    "password123",
    "/admin/dashboard",
    "dashboard",
    ADMIN_AUTH_FILE,
  );
});
