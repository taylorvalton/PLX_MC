/**
 * Browser-facing help for /api/cursor/mcp.
 * Unauthenticated browser GETs should not look like a broken API.
 */

export function isUnauthenticatedBrowserGet(req: Request): boolean {
  if (req.method !== "GET") return false;
  if (req.headers.get("x-api-key")?.trim()) return false;
  const auth = req.headers.get("authorization")?.trim() ?? "";
  if (auth) return false;

  const accept = (req.headers.get("accept") ?? "").toLowerCase();
  if (accept.includes("text/html")) return true;
  if (req.headers.get("sec-fetch-dest") === "document") return true;
  return false;
}

export function mcpBrowserHelpHtml(welcomeUrl = "https://mc.plxcustomer.io/welcome"): string {
  const safeWelcome = welcomeUrl.replace(/"/g, "&quot;");
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>PLX-MC MCP — not a web page</title>
  <style>
    body { margin: 0; font-family: Georgia, "Times New Roman", serif; background: #f6f6f4; color: #1a1a1a; }
    main { max-width: 36rem; margin: 0 auto; padding: 2.5rem 1.25rem; }
    h1 { font-size: 1.75rem; font-weight: 400; line-height: 1.2; margin: 0 0 0.75rem; }
    p { font-family: system-ui, sans-serif; font-size: 1rem; line-height: 1.5; color: #444; }
    .note { margin-top: 1.5rem; padding: 1rem 1.1rem; border: 1px solid #ddd; background: #fff; font-family: system-ui, sans-serif; }
    a { color: #0b57d0; }
    code { font-family: ui-monospace, monospace; font-size: 0.9em; }
  </style>
</head>
<body>
  <main>
    <h1>This is not a website you open in a browser</h1>
    <p>
      <code>/api/cursor/mcp</code> is a Cursor MCP connection endpoint.
      Opening it here without a team API key correctly returns an error —
      that does <strong>not</strong> mean Mission Control is down.
    </p>
    <div class="note">
      <p style="margin:0 0 0.75rem"><strong>What to do instead</strong></p>
      <p style="margin:0">
        Go back to
        <a href="${safeWelcome}">Mission Control Welcome</a>
        and follow <em>Connect Cursor</em> (copy the URL into Cursor — do not click it).
        If you only use Mission Control in the browser, you can skip MCP entirely.
      </p>
    </div>
  </main>
</body>
</html>`;
}
