import { expect, test } from "@playwright/test";

import { openSidebar, waitForHydration } from "./helpers";

const CATALOG_FIXTURE = {
  meta: {
    sourceRepo: "taylorvalton/plx-cursor-skills",
    version: "1.0.0",
    gitRef: "f5013b3014f024a1828a9d273d93e7bfc8872271",
    pinTag: "v1.0.0",
    packageId: "plx-engineering-core",
    state: "ready",
  },
  skills: [
    {
      id: "create-skill",
      name: "Create Skill",
      description: "Guide for authoring Cursor skills.",
      status: "published",
      tags: ["authoring"],
    },
    {
      id: "wterm-preflight",
      name: "Wterm Preflight",
      description: "Local CI gate before commit/push.",
      status: "published",
      tags: ["ci"],
    },
  ],
};

const DETAIL_FIXTURE = {
  ok: true,
  skill: CATALOG_FIXTURE.skills[0],
  manifestVersion: "1.0.0",
  toc: [{ id: "when-to-use", level: 2, text: "When to use" }],
  nodes: [
    {
      type: "heading",
      level: 1,
      id: "create-skill",
      text: [{ type: "text", value: "Create Skill" }],
    },
    {
      type: "heading",
      level: 2,
      id: "when-to-use",
      text: [{ type: "text", value: "When to use" }],
    },
    {
      type: "paragraph",
      text: [{ type: "text", value: "Use when authoring a new skill." }],
    },
  ],
};

test.describe("MC Skills Directory", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/skills-directory", (route) => {
      if (route.request().method() !== "GET") {
        return route.fulfill({ status: 405, body: "Method Not Allowed" });
      }
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: CATALOG_FIXTURE }),
      });
    });

    await page.route("**/api/skills-directory/**", (route) => {
      if (route.request().method() !== "GET") {
        return route.fulfill({ status: 405, body: "Method Not Allowed" });
      }
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: DETAIL_FIXTURE }),
      });
    });

    await page.goto("/");
    await waitForHydration(page);
    await openSidebar(page, "Skills directory");
    await expect(page.locator("[data-testid='sk-screen']")).toBeVisible();
  });

  test("sidebar item lives in System of record and is active", async ({ page }) => {
    const navItem = page.locator("nav.mc-side button", { hasText: "Skills directory" });
    await expect(navItem).toBeVisible();
    await expect(navItem).toHaveClass(/active/);
  });

  test("index lists company skills from fixture catalog", async ({ page }) => {
    const rows = page.locator("[data-testid='sk-row']");
    await expect(rows).toHaveCount(2);
    await expect(rows.first()).toContainText("Create Skill");
    await expect(page.locator(".sk-meta-value").first()).toContainText("plx-cursor-skills");
  });

  test("search filters the catalog", async ({ page }) => {
    await page.locator(".gs-search-input").fill("preflight");
    await expect(page.locator("[data-testid='sk-row']")).toHaveCount(1);
    await expect(page.locator("[data-testid='sk-row']").first()).toContainText("Wterm Preflight");
  });

  test("opens a skill and renders SKILL.md reader", async ({ page }) => {
    await page.locator("[data-testid='sk-row'][data-skill-id='create-skill']").click();
    const detail = page.locator("[data-testid='sk-detail-view']");
    await expect(detail).toBeVisible();
    await expect(detail.locator(".gs-doc-title")).toContainText("Create Skill");
    await expect(page.locator("[data-testid='gs-reader']")).toContainText("When to use");

    await page.locator(".gs-back").first().click();
    await expect(page.locator("[data-testid='sk-index-table']")).toBeVisible();
  });

  test("read-only lens — no editing affordances", async ({ page }) => {
    const screen = page.locator("[data-testid='sk-screen']");
    await expect(screen.locator("textarea")).toHaveCount(0);
    await expect(screen.locator("input:not(.gs-search-input)")).toHaveCount(0);
  });
});
