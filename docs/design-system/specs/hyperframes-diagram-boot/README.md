# Petra Lab-X · Cross-Section Diagnostic Boot

A HyperFrames composition. 1920×1080 · 6s · single scene.

## Concept
The PLX-N-014 cross-section diagram boots like a lab instrument coming online. Page chrome fades in, a scan bar sweeps the field, the rings draw themselves, sample particles populate, the active core blooms with a pulse ring, and callout leader lines extend to their labels — ending on the static hero state. Continuous subtle motion (core breathing, particle drift) plays out the last 1.2s.

## Requirements
- **Node.js 22+** — [nodejs.org](https://nodejs.org/)
- **FFmpeg** — `brew install ffmpeg` / `apt install ffmpeg` / [ffmpeg.org](https://ffmpeg.org/)

Verify: `npx hyperframes doctor`

## Preview
```bash
npx hyperframes preview
```

Opens HyperFrames Studio at `http://localhost:3002` for frame-accurate scrubbing.

## Render
```bash
npx hyperframes render index.html -o output.mp4
```

1920×1080 / 30fps by default.

## Refine with Claude Code
```bash
npx skills add heygen-com/hyperframes
npx hyperframes lint
npx hyperframes preview
```

Things to consider polishing:
- Beat 4 particle stagger may want tightening (0.04 → 0.03)
- The core pulse ring is a one-shot — could be a 2-cycle for more "alive"
- Scan bar opacity could ramp instead of step
- Consider a `light-leak` shader cut from boot diagnostic into the held hero state at ~4.4s
