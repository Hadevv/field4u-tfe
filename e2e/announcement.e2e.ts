import { test, expect } from "@playwright/test";

// tests agriculteur authentifié
test.describe("agriculteur - annonces", () => {
  test.use({ storageState: "playwright/.auth/farmer.json" });

  test("peut créer une nouvelle annonce", async ({ page }) => {
    await page.goto("/farm/announcements/new");

    // vérifier formulaire création
    await expect(
      page.getByRole("heading", { name: /nouvelle annonce/i }),
    ).toBeVisible();

    // remplir formulaire
    await page.getByLabel(/titre/i).fill("test annonce tomates e2e");
    await page.getByLabel(/description/i).fill("tomates bio à glaner");

    // sélectionner champ et type culture
    await page.getByRole("combobox", { name: /champ|parcelle/i }).click();
    await page.getByRole("option").first().click();
    await page.getByRole("combobox", { name: /culture|type/i }).click();
    await page.getByRole("option", { name: /tomates/i }).click();

    // quantité
    await page.getByLabel(/quantité/i).fill("50");

    // dates (demain à la semaine prochaine)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    await page
      .getByLabel(/date début/i)
      .fill(tomorrow.toISOString().split("T")[0]);
    await page
      .getByLabel(/date fin/i)
      .fill(nextWeek.toISOString().split("T")[0]);

    // publier
    await page.getByLabel(/publier|visible/i).check();
    await page.getByRole("button", { name: /créer|publier/i }).click();

    // vérifier création
    await page.waitForURL(/farm\/announcements/);
    await expect(page.getByText("test annonce tomates e2e")).toBeVisible();
  });

  test("peut supprimer une annonce", async ({ page }) => {
    await page.goto("/farm/announcements");

    // trouver une annonce
    const announcements = await page
      .getByRole("link", { name: /voir|détails/i })
      .all();
    if (announcements.length === 0) {
      console.log("aucune annonce disponible pour test");
      return;
    }

    // ouvrir première annonce
    await announcements[0].click();

    // supprimer l'annonce
    await expect(
      page.getByRole("button", { name: /supprimer/i }),
    ).toBeVisible();
    await page.getByRole("button", { name: /supprimer/i }).click();

    // confirmer suppression
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: /confirmer|oui/i }).click();

    // vérifier suppression
    await page.waitForURL(/farm\/announcements/);
    await expect(page.getByText(/supprimée|annonce supprimée/i)).toBeVisible();
  });
});

// tests glaneur authentifié
test.describe("glaneur - annonces", () => {
  test.use({ storageState: "playwright/.auth/user.json" });

  test("peut consulter les annonces", async ({ page }) => {
    await page.goto("/announcements");

    // vérifier page annonces
    await expect(
      page.getByRole("heading", { name: /annonces/i }),
    ).toBeVisible();
    await expect(page.getByRole("article")).toBeVisible();
  });

  test("peut consulter détails d'une annonce", async ({ page }) => {
    await page.goto("/announcements");

    // trouver une annonce
    const announcements = await page
      .getByRole("link", { name: /voir|détails/i })
      .all();
    if (announcements.length === 0) {
      console.log("aucune annonce disponible pour test");
      return;
    }

    // ouvrir première annonce
    await announcements[0].click();

    // vérifier détails
    await expect(page.getByRole("heading")).toBeVisible();
    await expect(page.getByText(/description/i)).toBeVisible();
    await expect(
      page.getByRole("button", { name: /rejoindre|participer/i }),
    ).toBeVisible();
  });

  test("peut ajouter aux favoris", async ({ page }) => {
    await page.goto("/announcements");

    // trouver bouton favoris
    const favoriteButtons = await page
      .getByRole("button", { name: /favori|ajouter/i })
      .all();
    if (favoriteButtons.length === 0) {
      console.log("aucun bouton favori disponible");
      return;
    }

    // ajouter aux favoris
    await favoriteButtons[0].click();

    // vérifier confirmation
    await expect(page.getByText(/ajouté aux favoris/i)).toBeVisible();
  });
});
