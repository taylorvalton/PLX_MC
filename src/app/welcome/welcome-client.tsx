"use client";

import Link from "next/link";
import { useState } from "react";

const MCP_URL = "https://mc.plxcustomer.io/api/cursor/mcp";

const MCP_HEADERS = `x-api-key: <from team Cursor MCP / AWS Secrets Manager>
x-mc-operator-email: <your @petrasoap.com or @petralabx.com email>
x-mc-repo: petralabx/PLX_MC
x-mc-runtime: cursor`;

async function copyText(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

export function WelcomeClient() {
  const [copied, setCopied] = useState<"url" | "headers" | null>(null);

  async function onCopy(kind: "url" | "headers", value: string) {
    const ok = await copyText(value);
    if (ok) {
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 2000);
    }
  }

  return (
    <div className="mc-welcome-ctas" data-testid="welcome-ctas">
      <Link className="mc-welcome-cta mc-welcome-cta-primary" href="/">
        Open Mission Control
      </Link>

      <section className="mc-welcome-card" aria-labelledby="connect-cursor-heading">
        <h2 id="connect-cursor-heading">Connect Cursor</h2>
        <p>
          Register the team HTTP MCP at{" "}
          <a href="https://cursor.com/agents" rel="noreferrer">
            cursor.com/agents
          </a>
          . Keys stay in team MCP / Secrets Manager — never paste secrets here.
        </p>
        <label className="mc-welcome-label" htmlFor="mcp-url">
          MCP URL
        </label>
        <div className="mc-welcome-copy-row">
          <code id="mcp-url">{MCP_URL}</code>
          <button type="button" onClick={() => void onCopy("url", MCP_URL)}>
            {copied === "url" ? "Copied" : "Copy"}
          </button>
        </div>
        <label className="mc-welcome-label" htmlFor="mcp-headers">
          Headers (placeholders only)
        </label>
        <div className="mc-welcome-copy-row mc-welcome-copy-row-block">
          <pre id="mcp-headers">{MCP_HEADERS}</pre>
          <button type="button" onClick={() => void onCopy("headers", MCP_HEADERS)}>
            {copied === "headers" ? "Copied" : "Copy"}
          </button>
        </div>
        <a
          className="mc-welcome-text-link"
          href="https://github.com/petralabx/PLX_MC/blob/main/docs/runbooks/plx-mc-mcp-team-registration.md"
          rel="noreferrer"
        >
          Full MCP registration runbook
        </a>
      </section>

      <a
        className="mc-welcome-cta"
        href="https://github.com/petralabx/PLX_MC/blob/main/docs/SKILLS-SOP.md"
        rel="noreferrer"
      >
        Install company skills
      </a>
    </div>
  );
}
