// skills-directory domain module barrel.

export type {
  AllowlistConfig,
  CatalogListResult,
  CatalogMeta,
  CatalogPointer,
  ContentFetchResult,
  ManifestFetchResult,
  SkillDetailResult,
  SkillSummaryRow,
  SkillsManifest,
  SkillsSourceReader,
} from "./types";

export { parseAllowlistJson, pointerFromAllowlist } from "./allowlist";
export { parseManifestJson, publishedSkills } from "./manifest";
export { createSkillsSource, GithubSkillsSource } from "./github";
export { getSkillDetail, listSkillCatalog } from "./loader";
