import { test, expect } from "@playwright/test";

test.describe("confirm-before-commit", () => {
  test("cancel leaves no commit", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("request-commit").click();
    await expect(page.getByTestId("gate-state")).toHaveText("awaiting_confirm");
    await page.getByTestId("cancel-commit").click();
    await expect(page.getByTestId("commit-log")).toContainText("Cancelled");
    await expect(page.getByTestId("commit-log")).not.toContainText("Committed");
  });

  test("confirm executes commit", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("commit-message").fill("Ship confirm-gate demo");
    await page.getByTestId("request-commit").click();
    await page.getByTestId("confirm-commit").click();
    await expect(page.getByTestId("commit-log")).toContainText("Committed");
    await expect(page.getByTestId("commit-log")).toContainText(
      "Ship confirm-gate demo",
    );
    await expect(page.getByTestId("gate-state")).toHaveText("idle");
  });
});
