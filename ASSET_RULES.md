# Asset Rules — Images & GIFs Only

## Scope
These rules apply to all still image and animated GIF deliverables committed to this repository. Video, audio, and other asset types are documented elsewhere.

## Naming Convention
- Use lowercase, hyphen-separated descriptors: `<subject>-<context>-<variant>.<ext>`
- Prefix with the asset type when helpful (e.g., `hero-`, `thumb-`, `poster-`).
- Avoid dates unless they disambiguate near-identical shots; prefer semantic descriptors over numbers.
- Final export extensions: `.webp` (primary), optional `.avif`; legacy fallbacks belong in compatibility packs only.

### Examples
- `hero-wolf-pack-dusk.webp`
- `thumb-wolf-pack-dusk.webp`
- `poster-wolf-pack-path.avif`
- `loop-wolf-trail-sign.gif`

## Stills (Web-Optimized Images)
- Resize so the long edge is ≤1920px; prefer even dimensions for better compression.
- Export primary version as WebP (quality 80–90). Optional AVIF export for high-density displays.
- Generate a thumbnail around 520px on the long edge (maintain aspect ratio) using the same naming stem (`thumb-<name>.webp`).
- Strip all EXIF/metadata from final exports.
- Store masters (RAW/PSD/etc.) inside `assets/img/_src/`; publish optimized assets alongside `index.html` consumers.

## GIFs (Animated)
- Set the exported width ≤1280px (scale proportionally as needed).
- Target file size ≤10 MB; allow lossy optimization to hit budget (e.g., palette reduction, frame dropping with easing).
- Deliver the optimized GIF and a matching poster frame (`poster-<name>.webp`, taken from frame 1).
- Generate a thumbnail WebP (`thumb-<name>.webp`, ~520px long edge) for listing views.
- Keep working GIF sources (AE, MP4 references) inside `assets/gif/_src/`.

## Alt Text Guidelines
- Keep alt text short and literal (≤12 words where practical).
- Include the primary subject and viewpoint/perspective.
- Note essential motion cues for GIFs (e.g., “animated howl sequence”).

### Examples
- `hero-wolf-pack-dusk.webp` → “Three wolves howling on a cliff at dusk, side view.”
- `loop-wolf-trail-sign.gif` → “Trail sign flickers while snow blows toward camera.”

## Tagging
- Maintain a shared tag list (placeholder file: `TAXONOMY_PLACEHOLDER.md`). Update once taxonomy is finalized.
- Use 2–4 descriptive tags per asset covering subject, mood, and usage.
- Tags are lowercase, hyphenated, singular nouns where possible.

### Examples
| Asset | Suggested Tags |
| --- | --- |
| `hero-wolf-pack-dusk.webp` | `wolf`, `dusk`, `hero`, `pack` |
| `loop-wolf-trail-sign.gif` | `trail-sign`, `snow`, `loop`, `ui` |
| `poster-wolf-pack-path.webp` | `wolf`, `poster`, `path` |

## Folder Flow Diagram
```
Capture / Concept
        │
        ▼
assets/img/_src/         assets/gif/_src/
        │                        │
        ├── prep (color, crop)    ├── prep (timing, palette)
        ▼                        ▼
Optimized exports (.webp/.avif)   Optimized GIF + poster/thumbnail
        │                        │
        └──> referenced by site templates & manifests
```
