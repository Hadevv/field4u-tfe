import { test, expect } from "@playwright/test";

// tests pour onboarding après inscription
test.describe("onboarding", () => {
  test("onboarding glaneur", async ({ page }) => {
    // email unique pour ce test
    const testEmail = `e2e-test-${Date.now()}@example.com`;

    // inscription utilisateur
    await page.goto("/auth/signup");
    await page.getByLabel("Name").fill("Test Gleaner");
    await page.getByLabel("Email").fill(testEmail);
    await page.getByLabel("Password", { exact: true }).fill("Password123!");
    await page.getByLabel("Verify Password").fill("Password123!");

    // soumettre et attendre la redirection avec timeout plus long
    await Promise.all([
      page.waitForNavigation({ timeout: 30000 }),
      page.getByRole("button", { name: /submit/i }).click(),
    ]);

    // vérifier qu'on est sur la page onboarding avec le vrai titre
    await expect(
      page.getByRole("heading", { name: /rejoignez la communauté field4u/i }),
    ).toBeVisible({ timeout: 30000 });

    // étape 1: choix du rôle glaneur (utiliser un sélecteur plus direct)
    await page.getByText("Glaneur", { exact: true }).click({ timeout: 15000 });

    // attendre que le formulaire se charge complètement
    await page.waitForTimeout(1000);

    // étape 2: formulaire glaneur - cibler directement les combobox par leur position
    // Premier combobox (ville principale)
    const allComboboxes = page.getByRole("combobox");
    await allComboboxes.first().click({ timeout: 15000 });

    // remplir le champ de recherche
    await page.getByPlaceholder(/rechercher une ville/i).fill("Bruxelles");
    await page.waitForTimeout(2000); // attendre les résultats de la recherche

    // sélectionner la première option dans la liste
    await page.getByRole("option").first().click({ timeout: 15000 });
    await page.waitForTimeout(1000);

    // Deuxième combobox (code postal) - attendre un peu et essayer
    await page.waitForTimeout(2000); // laisser le temps au formulaire de réagir
    await allComboboxes.nth(1).click({ timeout: 15000 });

    await page.getByPlaceholder(/rechercher un code postal/i).fill("1000");
    await page.waitForTimeout(2000);
    // sélectionner le premier code postal
    await page.getByRole("option").first().click({ timeout: 15000 });
    await page.waitForTimeout(1000);

    // accepter les conditions
    await page.getByLabel(/j'accepte les conditions/i).check();
    await page.getByRole("button", { name: /continuer/i }).click();

    // étape 3: règles et finalisation
    await expect(
      page
        .locator("div")
        .filter({ hasText: /règle.*pour les glaneurs/i })
        .first(),
    ).toBeVisible({
      timeout: 15000,
    });
    await page.getByRole("button", { name: /accepter les règles/i }).click();
    await page.waitForTimeout(1000); // attendre après l'acceptation des règles
    await page.getByRole("button", { name: /finaliser/i }).click();

    // vérifier redirection vers la page d'accueil (pas profile)
    await expect(page).toHaveURL("/", { timeout: 30000 });
    console.log(`test gleaner created: ${testEmail}`);
  });

  test("onboarding agriculteur", async ({ page }) => {
    // Augmenter le timeout de la page complète pour ce test
    test.slow();

    // email unique pour ce test
    const testEmail = `e2e-test-farmer-${Date.now()}@example.com`;

    // inscription utilisateur
    await page.goto("/auth/signup");
    await page.getByLabel("Name").fill("Test Farmer");
    await page.getByLabel("Email").fill(testEmail);
    await page.getByLabel("Password", { exact: true }).fill("Password123!");
    await page.getByLabel("Verify Password").fill("Password123!");

    // soumettre
    await page.getByRole("button", { name: /submit/i }).click();
    await page.waitForURL(/.*onboarding/, { timeout: 30000 });

    // vérifier qu'on est sur la page onboarding avec le vrai titre
    await expect(
      page.getByRole("heading", { name: /rejoignez la communauté field4u/i }),
    ).toBeVisible({ timeout: 30000 });

    // étape 1: choix du rôle agriculteur
    await page
      .getByText("Agriculteur", { exact: true })
      .click({ timeout: 15000 });

    // attendre que le formulaire d'exploitation soit visible
    const farmNameField = page.getByLabel(/nom de l'exploitation/i);
    await expect(farmNameField).toBeVisible({ timeout: 15000 });

    // étape 2: formulaire agriculteur
    await farmNameField.fill("ferme test e2e");

    // pour le champ ville - utiliser position des combobox
    const allComboboxes = page.getByRole("combobox");
    await allComboboxes.first().click({ timeout: 15000 });

    // remplir le champ de recherche
    const citySearchInput = page.getByPlaceholder(/rechercher une ville/i);
    await expect(citySearchInput).toBeVisible({ timeout: 15000 });
    await citySearchInput.fill("Namur");

    // attendre que les options soient visibles avant de cliquer
    await page.waitForSelector("role=option", { timeout: 15000 });
    await page.getByRole("option").first().click();

    // attendre que le champ de code postal soit disponible - deuxième combobox
    await page.waitForTimeout(2000); // laisser le temps au formulaire de réagir
    await allComboboxes.nth(1).click({ timeout: 15000 });

    // remplir le code postal
    const postalSearchInput = page.getByPlaceholder(
      /rechercher un code postal/i,
    );
    await expect(postalSearchInput).toBeVisible({ timeout: 15000 });
    await postalSearchInput.fill("5000");

    // attendre que les options soient visibles avant de cliquer
    await page.waitForSelector("role=option", { timeout: 15000 });
    await page.getByRole("option").first().click();

    // contact
    await page.getByLabel(/contact/i).fill("contact@fermetest.be");

    // accepter les conditions
    await page.getByLabel(/j'accepte les conditions/i).check();

    // cliquer sur continuer et attendre la navigation - le bouton pourrait avoir un autre nom
    const continueButton = page.getByRole("button", {
      name: /enregistrer|continuer/i,
    });
    await expect(continueButton).toBeEnabled({ timeout: 15000 });
    await continueButton.click();

    // attendre la transition vers l'étape des règles
    await page.waitForTimeout(2000);

    // étape 3: règles et finalisation attendre spécifiquement que la page des règles soit chargée
    // Le texte exact est "Règles pour les Agriculteurs"
    const rulesContent = page
      .locator("div")
      .filter({ hasText: /règles pour les agriculteurs/i })
      .first();
    await expect(rulesContent).toBeVisible({ timeout: 15000 });

    // cliquer sur accepter les règles
    const acceptRulesButton = page.getByRole("button", {
      name: /accepter les règles/i,
    });
    await expect(acceptRulesButton).toBeVisible({ timeout: 15000 });
    await acceptRulesButton.click();

    // attendre que le bouton finaliser soit disponible
    const finalizeButton = page.getByRole("button", { name: /finaliser/i });
    await expect(finalizeButton).toBeVisible({ timeout: 15000 });
    await finalizeButton.click();

    // vérifier redirection vers la page d'accueil (pas profile)
    await expect(page).toHaveURL("/", { timeout: 30000 });
    console.log(`test farmer created: ${testEmail}`);
  });

  test("validation des champs requis", async ({ page }) => {
    // email unique pour ce test
    const testEmail = `e2e-test-validate-${Date.now()}@example.com`;

    // inscription utilisateur
    await page.goto("/auth/signup");
    await page.getByLabel("Name").fill("Test Validation");
    await page.getByLabel("Email").fill(testEmail);
    await page.getByLabel("Password", { exact: true }).fill("Password123!");
    await page.getByLabel("Verify Password").fill("Password123!");

    // soumettre
    await Promise.all([
      page.waitForNavigation({ timeout: 30000 }),
      page.getByRole("button", { name: /submit/i }).click(),
    ]);

    // vérifier qu'on est sur la page onboarding avec le vrai titre
    await expect(
      page.getByRole("heading", { name: /rejoignez la communauté field4u/i }),
    ).toBeVisible({ timeout: 30000 });

    // choisir rôle glaneur
    await page.getByText("Glaneur", { exact: true }).click({ timeout: 15000 });

    // tenter de continuer sans remplir les champs obligatoires
    await page.getByRole("button", { name: /continuer/i }).click();

    // vérifier apparition des messages d'erreur en utilisant un sélecteur CSS plus générique
    const errorMessages = page.locator(".text-destructive");
    await expect(errorMessages).toHaveCount(await errorMessages.count(), {
      timeout: 15000,
    });
    expect(await errorMessages.count()).toBeGreaterThan(0);

    // vérifier qu'on reste sur la page onboarding
    await expect(
      page.getByText(/changer de rôle/i, { exact: false }),
    ).toBeVisible({ timeout: 15000 });
    console.log(`validation test user: ${testEmail}`);
  });
});
