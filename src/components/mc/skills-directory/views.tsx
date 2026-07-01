"use client";

import { useState } from "react";

import type { CatalogListResult, SkillDetailResult, SkillSummaryRow } from "@/lib/skills-directory";

import { MarkdownReader } from "../governance-sops/views";
import {
  SKFilterState,
  applyFilters,
  catalogSubtitle,
  deriveTags,
  hasActiveFilters,
  reasonLabel,
} from "./helpers";

function DegradedBanner({ meta }: { meta: CatalogListResult["meta"] }) {
  if (meta.state !== "degraded") return null;
  return (
    <div className="sk-banner" role="alert">
      <span className="dot" aria-hidden />
      <span className="sk-banner-body">
        <span className="sk-banner-ct">Catalog degraded</span>
        {" — "}
        {meta.note ?? "Could not fetch manifest from GitHub."} Run{" "}
        <code className="gs-icode">scripts/bootstrap-company-skills.ps1</code> locally
        until the catalog is readable.
      </span>
    </div>
  );
}

export function IndexView({
  catalog,
  onSelect,
}: {
  catalog: CatalogListResult;
  onSelect: (row: SkillSummaryRow) => void;
}) {
  const [filter, setFilter] = useState<SKFilterState>({});
  const { meta, skills } = catalog;
  const tags = deriveTags(skills);
  const filtered = applyFilters(skills, filter);

  function toggleTag(tag: string) {
    const cur = filter.tags ?? [];
    const next = cur.includes(tag) ? cur.filter((x) => x !== tag) : [...cur, tag];
    setFilter({ ...filter, tags: next.length ? next : undefined });
  }

  return (
    <div>
      <DegradedBanner meta={meta} />

      <div className="sk-meta-strip">
        <span className="sk-meta-item">
          <span className="sk-meta-label">Source</span>
          <span className="sk-meta-value gs-mono">{catalogSubtitle(meta)}</span>
        </span>
        <span className="sk-meta-item">
          <span className="sk-meta-label">Skills</span>
          <span className="sk-meta-value">{skills.length}</span>
        </span>
        <span className="sk-meta-item">
          <span className="sk-meta-label">State</span>
          <span className={`sk-pill ${meta.state}`}>{meta.state}</span>
        </span>
      </div>

      <div className="gs-toolbar">
        <div className="gs-search">
          <span className="gs-search-mag" aria-hidden>
            ⌕
          </span>
          <input
            className="gs-search-input"
            value={filter.text ?? ""}
            placeholder="Search skills…"
            aria-label="Search skills"
            onChange={(e) => setFilter({ ...filter, text: e.target.value || undefined })}
          />
        </div>

        {tags.length > 0 && (
          <div className="gs-chips" role="group" aria-label="Filter by tag">
            {tags.map((tag) => {
              const on = filter.tags?.includes(tag) ?? false;
              return (
                <button
                  key={tag}
                  type="button"
                  className={`gs-chip${on ? " on" : ""}`}
                  aria-pressed={on}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        )}

        {hasActiveFilters(filter) && (
          <button type="button" className="gs-chip clear" onClick={() => setFilter({})}>
            Clear
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="gs-empty">
          {skills.length === 0
            ? "No skills in the company allowlist."
            : "No skills match the current filters."}
        </div>
      ) : (
        <div className="gs-table-catalog" data-testid="sk-index-table">
          <div className="gs-cat-head sk-head" aria-hidden>
            <span>Skill</span>
            <span>ID</span>
            <span>Status</span>
          </div>
          {filtered.map((row) => (
            <button
              key={row.id}
              type="button"
              className={`gs-row ${meta.state === "degraded" ? "hot" : "ok"}`}
              onClick={() => onSelect(row)}
              data-testid="sk-row"
              data-skill-id={row.id}
              data-state={meta.state}
            >
              <span className="gs-row-main">
                <span className="gs-row-top">
                  <span
                    className={`gs-dot ${meta.state === "degraded" ? "hot" : "ok"}`}
                    aria-hidden
                  />
                  <span className="gs-row-title">{row.name}</span>
                  {row.status !== "unknown" && (
                    <span className="sk-status">{row.status}</span>
                  )}
                </span>
                <span className="gs-row-desc">{row.description || row.id}</span>
                {row.tags.length > 0 && (
                  <span className="gs-row-cats">
                    {row.tags.map((t) => (
                      <span key={t} className="gs-cat">
                        {t}
                      </span>
                    ))}
                  </span>
                )}
              </span>
              <span className="gs-cell gs-mono sk-id">{row.id}</span>
              <span className="gs-cell gs-mono">{row.status}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function NoContentPanel({ result }: { result: Extract<SkillDetailResult, { ok: false }> }) {
  return (
    <div className="gs-nocontent degraded" role="alert" data-testid="sk-nocontent">
      <div className="gs-nocontent-hd">
        <span className="gs-dot hot" aria-hidden />
        <span className="gs-nocontent-code">{reasonLabel(result.reason)}</span>
      </div>
      <p className="gs-nocontent-note">{result.note}</p>
      <p className="gs-nocontent-where">
        Allowlist: <code className="gs-icode">config/company-skills-allowlist.json</code>
      </p>
    </div>
  );
}

export function DetailView({
  result,
  onBack,
}: {
  result: SkillDetailResult;
  onBack: () => void;
}) {
  if (!result.ok) {
    return (
      <div data-testid="sk-detail-view">
        <button type="button" className="gs-back" onClick={onBack}>
          ← Back to catalog
        </button>
        <NoContentPanel result={result} />
      </div>
    );
  }

  const { skill, toc, manifestVersion } = result;
  const hasToc = toc.length > 1;

  return (
    <div data-testid="sk-detail-view">
      <button type="button" className="gs-back" onClick={onBack}>
        ← Back to catalog
      </button>

      <div className="ph">
        <div>
          <span className="kk">Company skills · {skill.id}</span>
          <h1 className="gs-doc-title">{skill.name}</h1>
          <p className="sub">{skill.description}</p>
        </div>
        <div className="r" style={{ gap: "var(--p-space-2)", alignItems: "center" }}>
          <span className="sk-pill ready">published</span>
          <span className="gs-pill ro">READ-ONLY</span>
        </div>
      </div>

      <div className="gs-folio">
        <span>
          Manifest <code className="gs-icode">{manifestVersion}</code>
        </span>
        {skill.tags.length > 0 && (
          <span>
            Tags{" "}
            {skill.tags.map((t) => (
              <code key={t} className="gs-icode">
                {t}
              </code>
            ))}
          </span>
        )}
      </div>

      <div className={`gs-doc-layout${hasToc ? " has-toc" : ""}`}>
        {hasToc && (
          <nav className="gs-toc" aria-label="On this page">
            <div className="gs-toc-hd">On this page</div>
            <ol>
              {toc.map((h) => (
                <li key={h.id} className={`gs-toc-l${h.level}`}>
                  <a href={`#${h.id}`}>{h.text}</a>
                </li>
              ))}
            </ol>
          </nav>
        )}
        <MarkdownReader nodes={result.nodes} />
      </div>
    </div>
  );
}
