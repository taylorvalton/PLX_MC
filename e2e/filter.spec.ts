import { expect, test } from "@playwright/test";

import { gotoBoard } from "./helpers";

// SPEC §6 #2 — The filter bar: chips add/remove, a live result count, `/`
// focuses the filter input, `Esc` clears it, and the filter persists across the
// board ↔ list tab switch (WorkViews stays mounted across the lens switch).

test.describe("filter bar", () => {
  test.beforeEach(async ({ page }) => {
    await gotoBoard(page);
  });

  test("`/` focuses the filter input from anywhere on the views surface", async ({ page }) => {
    const input = page.locator(".filterbar .fb-input");
    await expect(input).toBeVisible();
    await expect(input).not.toBeFocused();

    // Press "/" while focus is on a neutral, non-interactive region (the page
    // header text — NOT a card, which would open the task detail).
    await page.locator(".mc-main .ph .sub").click();
    await page.keyboard.press("/");
    await expect(input).toBeFocused();
    // "/" is consumed as a focus chord, not typed into the input.
    await expect(input).toHaveValue("");
  });

  test("text filter narrows the board live and the count matches", async ({ page }) => {
    const total = await page.locator(".mc .tcard").count();
    expect(total).toBeGreaterThan(1);

    const input = page.locator(".filterbar .fb-input");
    await input.fill("Finance");

    // Live narrow: fewer cards than the unfiltered total, and the live count
    // chip reflects the same number of matches.
    const narrowed = page.locator(".mc .tcard");
    await expect(async () => {
      const n = await narrowed.count();
      expect(n).toBeGreaterThan(0);
      expect(n).toBeLessThan(total);
    }).toPass();
    const shown = await narrowed.count();
    await expect(page.locator(".filterbar .fb-count")).toContainText(String(shown));

    // Every visible card actually matches the query (id/title/labels).
    for (const card of await narrowed.all()) {
      await expect(card).toContainText(/Finance/i);
    }
  });

  test("a priority facet chip adds, shows a live count, and removes", async ({ page }) => {
    const total = await page.locator(".mc .tcard").count();

    // Open the Priority facet popover and select "High".
    await page.locator(".filterbar .fb-pill", { hasText: "Priority" }).click();
    await page.locator(".filterbar .fb-pop .fb-opt", { hasText: "High" }).click();

    // An active, removable chip appears for the facet.
    const chip = page.locator(".filterbar .fb-chip", { hasText: "Priority · High" });
    await expect(chip).toBeVisible();

    // The board narrows and the count chip matches the visible cards.
    const narrowed = page.locator(".mc .tcard");
    await expect(async () => {
      expect(await narrowed.count()).toBeLessThan(total);
    }).toPass();
    const shown = await narrowed.count();
    expect(shown).toBeGreaterThan(0);
    await expect(page.locator(".filterbar .fb-count")).toContainText(String(shown));

    // Removing the chip restores the full board.
    await chip.click();
    await expect(page.locator(".filterbar .fb-chip", { hasText: "Priority · High" })).toHaveCount(0);
    await expect(page.locator(".mc .tcard")).toHaveCount(total);
  });

  test("`Esc` clears an active filter", async ({ page }) => {
    const total = await page.locator(".mc .tcard").count();

    const input = page.locator(".filterbar .fb-input");
    await input.fill("Finance");
    await expect(page.locator(".mc .tcard")).not.toHaveCount(total);

    // Esc while the input is focused clears all filters (the in-input handler).
    await input.press("Escape");
    await expect(input).toHaveValue("");
    await expect(page.locator(".mc .tcard")).toHaveCount(total);

    // And the global, no-field Esc-clear works too: set a facet, blur, Esc.
    await page.locator(".filterbar .fb-pill", { hasText: "Priority" }).click();
    await page.locator(".filterbar .fb-pop .fb-opt", { hasText: "High" }).click();
    await expect(page.locator(".filterbar .fb-chip")).toHaveCount(1);
    await page.locator(".mc-main .ph .sub").click(); // neutral focus (not a card)
    await page.keyboard.press("Escape");
    await expect(page.locator(".filterbar .fb-chip")).toHaveCount(0);
    await expect(page.locator(".mc .tcard")).toHaveCount(total);
  });

  test("the active filter persists across the board ↔ list tab switch", async ({ page }) => {
    const input = page.locator(".filterbar .fb-input");
    await input.fill("Finance");
    const narrowedOnBoard = await page.locator(".mc .tcard").count();
    expect(narrowedOnBoard).toBeGreaterThan(0);

    // Switch to the List lens via the view switcher (WorkViews stays mounted).
    await page.locator(".tb .vsw button", { hasText: /^List$/ }).click();

    // The filter text survived and the list is still narrowed to the matches.
    await expect(page.locator(".filterbar .fb-input")).toHaveValue("Finance");
    const listRows = page.locator(".mc .list .lrow:not(.head)");
    await expect(listRows).toHaveCount(narrowedOnBoard);

    // Switch back to Board — still filtered.
    await page.locator(".tb .vsw button", { hasText: /^Board$/ }).click();
    await expect(page.locator(".filterbar .fb-input")).toHaveValue("Finance");
    await expect(page.locator(".mc .tcard")).toHaveCount(narrowedOnBoard);
  });
});
