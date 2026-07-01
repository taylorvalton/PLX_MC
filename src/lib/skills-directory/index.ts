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

export {
  CATALOG_CONFIG_FILES,
  degradedFallbackIds,
  loadCatalogConfig,
  loadCatalogConfigRaw,
  parseCatalogConfig,
  resolveAllowIds,
} from "./catalog";
export { parseAllowlistJson, pointerFromAllowlist } from "./allowlist";
export { packageSkillIds, parseManifestJson, publishedSkills } from "./manifest";
export { createSkillsSource, GithubSkillsSource } from "./github";
export { getSkillDetail, listSkillCatalog } from "./loader";
