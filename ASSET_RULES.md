# Asset Rules — Images & GIFs Only

## Scope
These rules apply to all still image and animated GIF deliverables committed to this repository. Video, audio, and other asset types are documented elsewhere.

## Naming Convention
- Use lowercase, hyphen-separated descriptors: `<subject>-<context>-<variant>.<ext>`
- Prefix with the asset type when helpful (e.g., `hero-`, `thumb-`, `poster-`).
- Avoid dates unless they disambiguate near-identical shots; prefer semantic descriptors over numbers.
- Final export extensions: `.webp` (primary), optional `.avif`; legacy fallbacks belong in compatibility packs only.

### Examples
# Asset Notes

- Only commit final web assets (`.webp`, optional `.avif`, `.gif`, thumbs/posters). Keep PSD/RAW/AE stuff elsewhere.
- Naming: lowercase hyphen stem `<subject>-<context>-<variant>` (e.g., `hero-wolf-pack-dusk.webp`). Thumbs use `-thumb`, posters `poster-`.
- Stills: max long edge 1920 px → WebP q~80, optional AVIF q~45, plus ~520 px thumb. Strip metadata.
- GIFs: ≤1280 px wide, ≤10 MB. Deliver GIF + poster WebP + thumb WebP. Master animation files stay out of repo.
- Alt text stays short/literal with subject + viewpoint (+ motion cue). Tag each asset with 2–4 lowercase hyphen tags.
5. **Thumbnail:** Resize to ~520 px long edge, export another WebP named `thumb-<stem>.webp`.
