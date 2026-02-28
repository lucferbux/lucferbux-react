import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("should navigate to the News page", async ({ page }) => {
    await page.goto("/");
    await page.locator('a[href="/news"]').first().click();
    await expect(page).toHaveURL(/\/news/);
    await expect(page.locator("h2").first()).toBeVisible();
  });

  test("should navigate to the Projects page", async ({ page }) => {
    await page.goto("/");
    await page.locator('a[href="/projects"]').first().click();
    await expect(page).toHaveURL(/\/projects/);
    await expect(page.locator("h2").first()).toBeVisible();
  });

  test("should navigate to the Posts page", async ({ page }) => {
    await page.goto("/");
    await page.locator('a[href="/posts"]').first().click();
    await expect(page).toHaveURL(/\/posts/);
    await expect(page.locator("h2").first()).toBeVisible();
  });

  test("should navigate to the Admin login page", async ({ page }) => {
    await page.goto("/admin/login");
    // The login form should be visible
    await expect(
      page.getByRole("button", { name: /sign in/i })
    ).toBeVisible();
  });

  test("should redirect unknown routes to the home page", async ({ page }) => {
    await page.goto("/this-does-not-exist");
    // NotFoundPage redirects to "/"
    await expect(page).toHaveURL("/");
  });
});
