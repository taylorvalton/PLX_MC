"use client";

import Link from "next/link";
import { useState } from "react";

const MCP_URL = "https://mc.plxcustomer.io/api/cursor/mcp";

async function copyText(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

export function WelcomeClient() {
  const [copied, setCopied] = useState(false);

  async function onCopyUrl() {
    const ok = await copyText(MCP_URL);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="mc-welcome-ctas" data-testid="welcome-ctas">
      <Link className="mc-welcome-cta mc-welcome-cta-primary" href="/">
        Open Mission Control
      </Link>
      <p className="mc-welcome-hint">
        Most colleagues only need that button. Sign in with your work Microsoft
        account — you&apos;re done.
      </p>

      <details className="mc-welcome-details">
        <summary>I use Cursor with AI agents (optional)</summary>

        <section className="mc-welcome-card" aria-labelledby="connect-cursor-heading">
          <h2 id="connect-cursor-heading">Connect Cursor</h2>
          <ol className="mc-welcome-steps">
            <li>
              Ask Vince (or your admin) to add you to the team PLX-MC Cursor MCP —
              they give you the API key. You should not hunt for secrets yourself.
            </li>
            <li>
              In Cursor, open{" "}
              <a href="https://cursor.com/agents" rel="noreferrer">
                cursor.com/agents
              </a>{" "}
              (or Cursor Settings → MCP) and add a server.
            </li>
            <li>
              Paste the URL below with <strong>Copy</strong>.{" "}
              <strong>Do not open this URL in Chrome/Edge</strong> — it is not a
              website; a browser tab will look broken on purpose.
            </li>
          </ol>
          <label className="mc-welcome-label" htmlFor="mcp-url">
            MCP URL (copy into Cursor only)
          </label>
          <div className="mc-welcome-copy-row">
            <code id="mcp-url">{MCP_URL}</code>
            <button type="button" onClick={() => void onCopyUrl()}>
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="mc-welcome-hint">
            Headers / keys stay in team Cursor MCP config — never paste secrets
            into email or this page.
          </p>
        </section>

        <section className="mc-welcome-card" aria-labelledby="skills-heading">
          <h2 id="skills-heading">Company skills (optional)</h2>
          <p>
            Skills are files agents use on your laptop. If you only browse Mission
            Control, skip this.
          </p>
          <p>
            <strong>Easiest:</strong> book 10 minutes with Vince — they run the
            one-time install with you. You do not need to choose folders or learn
            the terminal.
          </p>
          <p>
            Technical self-serve (after PLX_MC is already cloned): Windows PowerShell
            in that repo folder →{" "}
            <code>.\scripts\bootstrap-company-skills.ps1</code>. Details:{" "}
            <a
              href="https://github.com/petralabx/PLX_MC/blob/main/docs/runbooks/mc-for-colleagues.md"
              rel="noreferrer"
            >
              colleague guide
            </a>
            .
          </p>
        </section>
      </details>
    </div>
  );
}
