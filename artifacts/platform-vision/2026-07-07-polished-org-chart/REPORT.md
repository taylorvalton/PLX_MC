# Platform vision deck — polished org chart handoff

**Date:** 2026-07-07  
**Source:** SharePoint `cursor-inbox/Creating polished PLX org chart.zip`  
**Deployed:** `/presentations/plx-platform-vision/`

## Summary

Replaced the legacy 14-slide scroll deck with the 8-slide design handoff bundle (org chart, AI-native stack, pillars, MC/Portal/Infra deep-dives, operating principles). Added home/sign-in links to the deck.

## Verification

- `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:9876/index.html` → 200 (local static serve)
- `npm run typecheck` → exit 0
- `npx vitest run tests/staging-gate.test.ts` → 11 passed

## Rollback

Restore `public/presentations/plx-platform-vision.html` monolith from git history; remove `public/presentations/plx-platform-vision/` folder; revert inbox/sign-in link commits.
