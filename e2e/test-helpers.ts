import { Page, expect, Locator } from "@playwright/test";

/**
 * attendre que la base de données serverless soit prête pour les tests
 */
export async function waitForServerlessDB(
  page: Page,
  maxRetries = 3,
): Promise<void> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await page.request.get("/api/health");
      if (response.ok()) {
        const data = await response.json();
        if (data.status === "ok") {
          console.log("✅ DB serverless prête");
          return;
        }
      }
    } catch (error) {
      console.log(`🔄 Tentative ${i + 1}/${maxRetries} - DB pas encore prête`);
    }
    await page.waitForTimeout((i + 1) * 3000);
  }
}

export async function robustSignIn(
  page: Page,
  email: string,
  password: string,
): Promise<void> {
  await page.goto("/auth/signin");
  await page.waitForLoadState("domcontentloaded");

  await page.waitForTimeout(3000);

  await page.getByText("utiliser un mot de passe").click();
  await page.getByPlaceholder("adresse e-mail").fill(email);
  await page.locator('input[type="password"]').fill(password);

  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      await page
        .getByRole("button", { name: "connexion avec mot de passe" })
        .click();

      await page.waitForURL((url) => !url.href.includes("/auth/signin"), {
        timeout: 30000,
      });
      return;
    } catch (error) {
      attempts++;
      if (attempts === maxAttempts) {
        throw new Error(
          `Connexion échouée après ${maxAttempts} tentatives pour ${email}`,
        );
      }

      await page.waitForTimeout(5000 * attempts);
      await page.reload();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(2000);
      await page.getByText("utiliser un mot de passe").click();
      await page.getByPlaceholder("adresse e-mail").fill(email);
      await page.locator('input[type="password"]').fill(password);
    }
  }
}

export async function waitForElementWithRetry(
  page: Page,
  selector: Locator,
  options: { timeout?: number; retries?: number } = {},
): Promise<void> {
  const { timeout = 20000, retries = 2 } = options;

  for (let i = 0; i < retries; i++) {
    try {
      await expect(selector).toBeVisible({ timeout });
      return;
    } catch (error) {
      if (i === retries - 1) throw error;

      await page.waitForTimeout(3000);
      await page.reload();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(2000);
    }
  }
}

export async function robustNavigate(
  page: Page,
  url: string,
  waitForSelector?: string,
): Promise<void> {
  await waitForServerlessDB(page, 2);

  await page.goto(url);
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(3000);

  if (waitForSelector) {
    await page.waitForSelector(waitForSelector, { timeout: 20000 });
  }
}
