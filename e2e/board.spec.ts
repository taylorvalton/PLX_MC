import { expect, test } from "@playwright/test";

import { boardColumns, cardById, gotoBoard } from "./helpers";

// SPEC §6 — Board renders the bucket/stage columns + task cards; a card opens
// the detail. The default axis is `band` (To do / In progress / Done); we also
// confirm the lifecycle stage axis renders its 9 columns (the product spine).
test.describe("board renders and a card opens the detail", () => {
  test.beforeEach(async ({ page }) => {
    await gotoBoard(page);
  });

  test("default band board shows the three lifecycle bands as columns with cards", async ({ page }) => {
    // Default group-by = band → exactly the three bands, in order.
    await expect(boardColumns(page)).toHaveCount(3);
    await expect(page.locator(".mc .board .bcol .bhead .nm")).toHaveText([
      /To do/,
      /In progress/,
      /Done/,
    ]);

    // The fixture seeds 15 go-live tasks; at least one card is on the board.
    await expect(page.locator(".mc .tcard").first()).toBeVisible();
    await expect(await page.locator(".mc .tcard").count()).toBeGreaterThan(0);
  });

  test("switching to the stage axis renders the 9-stage lifecycle columns", async ({ page }) => {
    await page.locator(".tb .seg").first().locator("button", { hasText: /^Stage$/ }).click();
    // The 9 gated lifecycle stages (Backlog … Verified).
    await expect(boardColumns(page)).toHaveCount(9);
    await expect(page.locator(".mc .board .bcol .bhead .nm").first()).toContainText("Backlog");
    await expect(page.locator(".mc .board .bcol .bhead .nm").last()).toContainText("Verified");
  });

  test("clicking a task card opens its detail view", async ({ page }) => {
    // TASK-221 (WMS integration) is in the seed plan.
    const card = cardById(page, "TASK-221").first();
    await expect(card).toBeVisible();
    await card.click();

    // The detail view shows the Back affordance and the task id in its header.
    await expect(page.getByRole("button", { name: /← Back/ })).toBeVisible();
    await expect(page.locator(".mc .td .thead .kk")).toContainText("TASK-221");
    await expect(page.locator(".mc .td h1")).toContainText("WMS integration");
  });
});
