import { test, expect } from "@playwright/test";

test("sign-in page renders form", async ({ page }) => {
  await page.goto("/sign-in");
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Mot de passe")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Se connecter" }),
  ).toBeVisible();
});

test("sign-up page renders form with name field", async ({ page }) => {
  await page.goto("/sign-up");
  await expect(page.getByLabel("Prénom")).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Mot de passe")).toBeVisible();
});

test("dashboard redirects to sign-in when unauthenticated", async ({
  page,
}) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/sign-in/);
});
