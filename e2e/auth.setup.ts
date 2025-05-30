import { test as setup, Page } from "@playwright/test";
import { robustSignIn, waitForElementWithRetry } from "./test-helpers";

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
  await page.addInitScript(() => {
    Object.defineProperty(window, "__e2e_test", { value: true });
  });

  await robustSignIn(page, email, password);

  // Naviguer vers la page spécifique au rôle
  await page.goto(targetUrl);
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(3000);

  // Vérifier la présence d'un élément spécifique au rôle
  const roleElement = page
    .getByRole("heading", { name: new RegExp(roleSpecificSelector, "i") })
    .first();

  await waitForElementWithRetry(page, roleElement, {
    timeout: 25000,
    retries: 2,
  });

  await page.context().storageState({ path: authFile });
}

// setup pour glaneur
setup("authentifier glaneur", async ({ page }) => {
  await setupUserAuth(
    page,
    "gleaner@field4u.be",
    "Password123!",
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
    "Password123!",
    "/farm/announcements",
    "mes annonces",
    FARMER_AUTH_FILE,
  );
});

// setup pour administrateur
setup("authentifier administrateur", async ({ page }) => {
  await setupUserAuth(
    page,
    "admin@field4u.be",
    "Password123!",
    "/admin/dashboard",
    "dashboard|administration",
    ADMIN_AUTH_FILE,
  );
});
