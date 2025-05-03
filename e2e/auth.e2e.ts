import { test, expect } from "@playwright/test";

// tests d'authentification pour utilisateurs non connectés
test.describe("authentification - publique", () => {
  test("page de connexion s'affiche correctement", async ({ page }) => {
    await page.goto("/auth/signin");

    // vérifier présence des éléments de connexion
    await expect(
      page.getByRole("heading", { name: /connectez-vous/i }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: /utiliser un mot de passe/i })
      .click();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Mot de passe")).toBeVisible();
  });

  test("connexion avec identifiants valides", async ({ page }) => {
    await page.goto("/auth/signin");
    await page
      .getByRole("button", { name: /utiliser un mot de passe/i })
      .click();
    await page.getByLabel("Email").fill("gleaner@field4u.be");
    await page.getByLabel("Mot de passe").fill("password123");
    await page
      .getByRole("button", { name: /connexion avec mot de passe/i })
      .click();

    // vérifier la connexion réussie
    await expect(page.getByRole("button", { name: /gleaner/i })).toBeVisible({
      timeout: 10000,
    });
  });

  test("échec connexion avec identifiants invalides", async ({ page }) => {
    await page.goto("/auth/signin");
    await page
      .getByRole("button", { name: /utiliser un mot de passe/i })
      .click();
    await page.getByLabel("Email").fill("invalid@field4u.be");
    await page.getByLabel("Mot de passe").fill("wrongpassword");
    await page
      .getByRole("button", { name: /connexion avec mot de passe/i })
      .click();

    // vérifier le message d'erreur
    await expect(page).toHaveURL(/.*signin/, { timeout: 10000 });
    await expect(page.getByRole("alert")).toBeVisible({ timeout: 10000 });
  });

  test("inscription avec informations valides", async ({ page }) => {
    const testEmail = `e2e-test-${Date.now()}@example.com`;

    await page.goto("/auth/signup");
    await expect(page.getByRole("heading", { name: /sign up/i })).toBeVisible();

    // remplir formulaire inscription
    await page.getByLabel("Name").fill("Test User");
    await page.getByLabel("Email").fill(testEmail);
    await page.getByLabel("Password", { exact: true }).fill("password123");
    await page.getByLabel("Verify Password").fill("password123");
    await page.getByRole("button", { name: /submit/i }).click();

    // vérifier redirection vers onboarding
    await expect(page).toHaveURL(/.*onboarding/, { timeout: 15000 });
    console.log(`test user created: ${testEmail}`);
  });
});

// tests pour utilisateurs déjà authentifiés
test.describe("authentification - utilisateur connecté", () => {
  test.use({ storageState: "playwright/.auth/user.json" });

  test("déconnexion fonctionne correctement", async ({ page }) => {
    await page.goto("/");

    // ouvrir menu utilisateur et se déconnecter
    await page.getByRole("button", { name: /gleaner/i }).click();
    await page.waitForSelector('[role="menu"]', { timeout: 5000 });
    await page.getByRole("menuitem", { name: /déconnexion/i }).click();

    // vérifier retour à page de connexion
    await expect(page).toHaveURL(/.*signin/, { timeout: 10000 });
  });

  test("utilisateur connecté est redirigé depuis la page connexion", async ({
    page,
  }) => {
    await page.goto("/auth/signin");
    await expect(page).not.toHaveURL(/.*signin/, { timeout: 10000 });
  });
});
