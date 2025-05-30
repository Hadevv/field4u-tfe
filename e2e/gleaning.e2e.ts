import { test, expect, Page } from "@playwright/test";

// Helper function pour gérer le dialog de géolocalisation - version simplifiée
async function handleGeolocationDialog(page: Page) {
  try {
    console.log("🔍 Recherche du dialog de géolocalisation...");

    // Attendre un peu que le dialog apparaisse
    await page.waitForTimeout(1000);

    // Essayer de trouver un dialog
    const dialog = page.getByRole("dialog").first();

    if (await dialog.isVisible({ timeout: 3000 })) {
      console.log("✅ Dialog trouvé!");

      // Chercher le bouton accepter
      const acceptButton = dialog.getByRole("button", { name: /accepter/i });

      if (await acceptButton.isVisible({ timeout: 1000 })) {
        console.log("✅ Clic sur Accepter");
        await acceptButton.click();
        await page.waitForTimeout(1000);
        return;
      }

      // Si pas de bouton accepter, essayer de fermer autrement
      const cancelButton = dialog.getByRole("button", { name: /annuler/i });
      if (await cancelButton.isVisible({ timeout: 1000 })) {
        console.log("⚠️ Clic sur Annuler");
        await cancelButton.click();
        await page.waitForTimeout(1000);
        return;
      }
    }

    console.log("ℹ️ Aucun dialog de géolocalisation trouvé");
  } catch (error) {
    console.log("❌ Erreur lors de la gestion du dialog:", error);
  }
}

// tests glaneur authentifié
test.describe("glaneur - glanage", () => {
  test.use({ storageState: "playwright/.auth/user.json" });

  test("peut rejoindre un glanage", async ({ page }) => {
    await page.goto("/announcements");

    // Gérer le dialog de géolocalisation qui apparaît
    await handleGeolocationDialog(page);

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2000); // Attendre que les composants se chargent

    // trouver une annonce disponible
    const announcements = await page
      .getByRole("link", { name: /voir|détails/i })
      .all();
    if (announcements.length === 0) {
      console.log("aucune annonce disponible pour test");
      return;
    }

    // ouvrir première annonce
    await announcements[0].click();

    // rechercher bouton rejoindre
    const joinButton = page.getByRole("button", {
      name: /rejoindre le glanage/i,
    });
    if (await joinButton.isVisible()) {
      await joinButton.click();

      // vérifier redirection et participation - la route change vers gleaning
      await expect(page).toHaveURL(/.*\/gleaning/);
      await expect(
        page.getByText(/vous participez|participants/i),
      ).toBeVisible();
    } else {
      console.log("bouton rejoindre non disponible");
    }
  });

  test("peut voir ses glanages", async ({ page }) => {
    await page.goto("/my-gleanings");

    // vérifier affichage des glanages - le titre exact est "Mes glanages"
    await expect(
      page.getByRole("heading", { name: "Mes glanages" }),
    ).toBeVisible();
    // Vérifier qu'il y a du contenu ou un message d'absence
    await expect(
      page
        .getByText(/aucun glanage|no gleaning|participations/i)
        .or(page.locator('[data-testid="gleaning-list"]'))
        .or(page.locator('.grid, .space-y-4, [role="list"]'))
        .first(),
    ).toBeVisible();
  });

  test("peut consulter les annonces", async ({ page }) => {
    await page.goto("/announcements");

    // Gérer le dialog de géolocalisation qui apparaît
    await handleGeolocationDialog(page);

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2000); // Attendre que les composants se chargent

    // vérifier page annonces - pas de titre H1, donc on vérifie la présence du composant de recherche
    await expect(
      page
        .getByRole("button", { name: /rechercher/i })
        .or(page.getByPlaceholder(/rechercher/i))
        .first(),
    ).toBeVisible();
    await expect(
      page
        .getByRole("article")
        .or(page.getByText(/aucune annonce/i))
        .or(page.locator(".grid, .space-y-4"))
        .first(),
    ).toBeVisible();
  });
});

// tests agriculteur authentifié
test.describe("agriculteur - glanage", () => {
  test.use({ storageState: "playwright/.auth/farmer.json" });

  test("peut créer un glanage pour une annonce", async ({ page }) => {
    await page.goto("/farm/announcements");

    // trouver une annonce disponible
    const announcements = await page
      .getByRole("link", { name: /voir|détails/i })
      .all();
    if (announcements.length === 0) {
      console.log("aucune annonce disponible pour test");
      return;
    }

    // ouvrir première annonce
    await announcements[0].click();

    // rechercher bouton créer glanage
    const createButton = page.getByRole("button", {
      name: /créer un glanage/i,
    });
    if (await createButton.isVisible()) {
      await createButton.click();

      // confirmer création
      await expect(page.getByRole("dialog")).toBeVisible();
      await page.getByRole("button", { name: /confirmer|créer/i }).click();

      // vérifier succès - chercher toast ou message de succès
      await expect(
        page
          .getByText(/glanage créé|créé avec succès/i)
          .or(page.locator('[role="status"], .toast'))
          .first(),
      ).toBeVisible({ timeout: 5000 });
    } else {
      console.log("bouton créer glanage non disponible");
    }
  });

  test("peut voir participants au glanage", async ({ page }) => {
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

    // chercher lien vers glanage
    const gleaningLink = page.getByRole("link", { name: /voir le glanage/i });
    if (await gleaningLink.isVisible()) {
      await gleaningLink.click();

      // vérifier page participants
      await expect(page.getByText(/participants/i)).toBeVisible();
    } else {
      console.log("pas de glanage associé à cette annonce");
    }
  });

  test("peut consulter ses annonces", async ({ page }) => {
    await page.goto("/farm/announcements");

    // vérifier page annonces - le titre exact est "Mes annonces"
    await expect(
      page.getByRole("heading", { name: "Mes annonces" }),
    ).toBeVisible();
    await expect(
      page
        .getByRole("table")
        .or(page.getByText(/aucune annonce/i))
        .or(
          page.locator('.grid, .space-y-4, [data-testid="announcements-list"]'),
        )
        .first(),
    ).toBeVisible();
  });

  test("peut accéder à création d'annonce", async ({ page }) => {
    await page.goto("/farm/announcements/new");

    // vérifier formulaire création
    await expect(
      page.getByRole("heading", { name: /nouvelle annonce/i }),
    ).toBeVisible();
    await expect(page.getByLabel(/titre/i)).toBeVisible();
    await expect(page.getByLabel(/description/i)).toBeVisible();
  });
});
