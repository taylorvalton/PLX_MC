# Design Tokens — Petra Lab-X · Diagnostic Boot

## Palette
| Token | Hex | Use |
|---|---|---|
| `--paper` | `#f3ede1` | Background (warm cream, apothecary stock) |
| `--ink` | `#0c1a14` | Primary text, structural lines |
| `--accent` | `#0a3a2a` | Forest — active core fill, inner ring, italic emphasis |
| `--accent-2` | `#14523a` | Forest tint — reserved |
| `--hot` | `#d96a4a` | Coral — sample marker, rust particles, scan bar |
| `--muted` | `#5a6b5e` | Lipid particles, secondary copy |
| `--grid` | `rgba(12,26,20,0.18)` | Page frame border |

## Typography
| Family | Use | Notes |
|---|---|---|
| Instrument Serif | Display, italic emphasis (e.g. "5.0%", "5.4 — 6.8") | Editorial, lab-paper feel |
| Inter Tight | Body — currently unused in this scene; reserved for future scenes | |
| JetBrains Mono | All labels, callouts, readout, FIG/SAMPLE/SCALE | Tracking 0.22em uppercase |

## Motion principles
- **Editorial cadence, not flashy.** Eases are mostly `power2.inOut` and `power3.out`. One `back.out` for the center crosshair dot. One `expo.out` for the core bloom.
- **Stagger the population.** Particles use a `start` stagger so they read as systematic instrumentation, not random.
- **Subtle hold.** The final 1.2s holds with a single core breath cycle and a gentle hot-particle drift — never enough to distract from a static reading.
