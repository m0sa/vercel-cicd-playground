import { test, expect } from "@playwright/test";

test.describe("Signup Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display step 1 with email and password fields", async ({
    page,
  }) => {
    await expect(
      page.getByRole("heading", { name: "Sign Up" })
    ).toBeVisible();
    await expect(page.getByText("Step 1 of 2")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Next" })).toBeVisible();
  });

  test("should show validation errors on step 1 for empty fields", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.getByTestId("email-error")).toBeVisible();
    await expect(page.getByTestId("password-error")).toBeVisible();
  });

  test("should show validation error for invalid email", async ({ page }) => {
    await page.getByLabel("Email").fill("not-an-email");
    await page.getByLabel("Password").fill("validpass123");
    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.getByTestId("email-error")).toBeVisible();
  });

  test("should show validation error for short password", async ({ page }) => {
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password").fill("short");
    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.getByTestId("password-error")).toBeVisible();
  });

  test("should advance to step 2 with valid inputs", async ({ page }) => {
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password").fill("securepass123");
    await page.getByRole("button", { name: "Next" }).click();

    await expect(page.getByText("Step 2 of 2")).toBeVisible();
    await expect(page.getByLabel("Name")).toBeVisible();
    await expect(page.getByTestId("confirm-email")).toContainText(
      "test@example.com"
    );
    await expect(
      page.getByRole("button", { name: "Sign Up" })
    ).toBeVisible();
  });

  test("should navigate back from step 2 to step 1 preserving data", async ({
    page,
  }) => {
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password").fill("securepass123");
    await page.getByRole("button", { name: "Next" }).click();

    await page.getByRole("button", { name: "Back" }).click();

    await expect(page.getByText("Step 1 of 2")).toBeVisible();
    await expect(page.getByLabel("Email")).toHaveValue("test@example.com");
    await expect(page.getByLabel("Password")).toHaveValue("securepass123");
  });

  test("should show validation error on step 2 for empty name", async ({
    page,
  }) => {
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password").fill("securepass123");
    await page.getByRole("button", { name: "Next" }).click();

    await page.getByRole("button", { name: "Sign Up" }).click();
    await expect(page.getByTestId("name-error")).toBeVisible();
  });

  test("should complete full signup flow and show success", async ({
    page,
  }) => {
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password").fill("securepass123");
    await page.getByRole("button", { name: "Next" }).click();

    await page.getByLabel("Name").fill("Jane Doe");
    await page.getByRole("button", { name: "Sign Up" }).click();

    await expect(page.getByTestId("success-message")).toBeVisible();
    await expect(page.getByText("Jane Doe")).toBeVisible();
    await expect(page.getByTestId("success-email")).toContainText(
      "test@example.com"
    );
  });
});
