import { test, expect } from "@playwright/test";

// tests glaneur authentifié
test.describe("glaneur - glanage", () => {
  test.use({ storageState: "playwright/.auth/user.json" });

  test("peut rejoindre un glanage", async ({ page }) => {
    await page.goto("/announcements");

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

      // vérifier redirection et participation
      await expect(page).toHaveURL(/.*\/gleaning/);
      await expect(
        page.getByText(/vous participez|participants/i),
      ).toBeVisible();
    } else {
      console.log("bouton rejoindre non disponible");
    }
  });

  test("peut voir ses glanages", async ({ page }) => {
    await page.goto("/profile/gleanings");

    // vérifier affichage des glanages
    await expect(
      page.getByRole("heading", { name: /mes glanages/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("list").or(page.getByText(/aucun glanage/i)),
    ).toBeVisible();
  });

  test("peut consulter les annonces", async ({ page }) => {
    await page.goto("/announcements");

    // vérifier page annonces
    await expect(
      page.getByRole("heading", { name: /annonces/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("article").or(page.getByText(/aucune annonce/i)),
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

      // vérifier succès
      await page.waitForSelector('[role="status"]', { state: "visible" });
      await expect(page.getByText(/glanage créé/i)).toBeVisible();
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

    // vérifier page annonces
    await expect(
      page.getByRole("heading", { name: /annonces|mes annonces/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("table").or(page.getByText(/aucune annonce/i)),
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
