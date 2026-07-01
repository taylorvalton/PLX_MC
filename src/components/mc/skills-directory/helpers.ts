// Pure helpers for the MC Skills Directory screen.

import type { CatalogListResult, SkillSummaryRow } from "@/lib/skills-directory";

export interface SKFilterState {
  text?: string;
  tags?: string[];
}

export function deriveTags(skills: SkillSummaryRow[]): string[] {
  const set = new Set<string>();
  for (const s of skills) for (const t of s.tags) set.add(t);
  return [...set].sort((a, b) => a.localeCompare(b));
}

export function matchesText(row: SkillSummaryRow, q: string): boolean {
  const t = q.toLowerCase();
  return (
    row.id.toLowerCase().includes(t) ||
    row.name.toLowerCase().includes(t) ||
    row.description.toLowerCase().includes(t) ||
    row.tags.some((tag) => tag.toLowerCase().includes(t))
  );
}

export function applyFilters(rows: SkillSummaryRow[], filter: SKFilterState): SkillSummaryRow[] {
  return rows.filter((row) => {
    if (filter.text?.trim() && !matchesText(row, filter.text.trim())) return false;
    if (filter.tags?.length && !filter.tags.some((tag) => row.tags.includes(tag))) {
      return false;
    }
    return true;
  });
}

export function hasActiveFilters(filter: SKFilterState): boolean {
  return Boolean(filter.text?.trim() || filter.tags?.length);
}

export function reasonLabel(reason: string): string {
  const labels: Record<string, string> = {
    token_missing: "GitHub auth missing",
    permission_denied: "Permission denied",
    rate_limit: "Rate limited",
    not_found: "Not found",
    network_error: "Network error",
    invalid_manifest: "Invalid manifest",
    skill_not_found: "Skill not found",
    source_empty: "Source empty",
  };
  return labels[reason] ?? reason;
}

export function catalogSubtitle(meta: CatalogListResult["meta"]): string {
  const parts = [meta.sourceRepo];
  if (meta.version && meta.version !== "—") parts.push(`v${meta.version}`);
  if (meta.pinTag) parts.push(meta.pinTag);
  return parts.join(" · ");
}
