# Platform vision deck — polished org chart handoff

**Date:** 2026-07-07  
**Source:** SharePoint `cursor-inbox/Creating polished PLX org chart.zip`  
**Deployed:** `/presentations/plx-platform-vision/`

## Summary

Rebuilt the platform vision briefing as a first-class PLX microsite (`capabilities-deck` / PAUME pattern, same chassis as `plx-foot-powder.html`): single self-contained HTML at `/presentations/plx-platform-vision.html` with sitebar, hero, seven `/ 0N` sections (org chart, AI-native stack, pillars, MC deep-dive, Portal deep-dive, foundation ladder, operating principles), taglines, reveal-on-scroll motion, print stylesheet, and reduced-motion support. Content ported 1:1 from the design handoff zip. The interim `deck-stage` bundle was retired; the folder URL now redirects to the `.html`.

## Verification

- Playwright screenshots of all 9 sections at 1440px + mobile 390px — layout verified visually
- `npm run typecheck` → exit 0
- `npx vitest run tests/staging-gate.test.ts` → 11 passed

## Rollback

Revert the microsite commit; the deck-stage handoff bundle remains available in `extracted/` here if a re-deploy of the slide format is ever wanted.
