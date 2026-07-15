import { describe, expect, it } from "vitest";

import {
  isUnauthenticatedBrowserGet,
  mcpBrowserHelpHtml,
} from "@/lib/mcp/browser-help";

describe("mcp browser help", () => {
  it("treats HTML Accept GET without key as browser help", () => {
    const req = new Request("https://mc.plxcustomer.io/api/cursor/mcp", {
      headers: { accept: "text/html,application/xhtml+xml" },
    });
    expect(isUnauthenticatedBrowserGet(req)).toBe(true);
  });

  it("treats Sec-Fetch-Dest document as browser help", () => {
    const req = new Request("https://mc.plxcustomer.io/api/cursor/mcp", {
      headers: { "sec-fetch-dest": "document" },
    });
    expect(isUnauthenticatedBrowserGet(req)).toBe(true);
  });

  it("does not offer browser help when an API key is present", () => {
    const req = new Request("https://mc.plxcustomer.io/api/cursor/mcp", {
      headers: {
        accept: "text/html",
        "x-api-key": "secret",
      },
    });
    expect(isUnauthenticatedBrowserGet(req)).toBe(false);
  });

  it("does not offer browser help for JSON clients", () => {
    const req = new Request("https://mc.plxcustomer.io/api/cursor/mcp", {
      headers: { accept: "application/json" },
    });
    expect(isUnauthenticatedBrowserGet(req)).toBe(false);
  });

  it("does not offer browser help for POST", () => {
    const req = new Request("https://mc.plxcustomer.io/api/cursor/mcp", {
      method: "POST",
      headers: { accept: "text/html" },
    });
    expect(isUnauthenticatedBrowserGet(req)).toBe(false);
  });

  it("renders help HTML that points at /welcome and forbids browser use", () => {
    const html = mcpBrowserHelpHtml("https://mc.plxcustomer.io/welcome");
    expect(html).toContain("not a website");
    expect(html).toContain("https://mc.plxcustomer.io/welcome");
    expect(html).toContain("do not click it");
  });
});
