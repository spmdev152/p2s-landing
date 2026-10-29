# Rocket scene

A cat riding a rocket up through a violet night, assembled from separately
generated pieces of artwork and animated in CSS. It is the landing page's hero;
review it on its own at `/lab`.

## Pipeline

```bash
bun run scene:prepare
```

`source/` holds the artwork as delivered, renamed for what it is, plus
`reference.png`: the full illustration the pieces were cut from.
`prepare.mjs` trims each piece to its alpha bounds, caps it at the largest size
the scene can display, writes it to `public/scene/`, and records every output's
pixel size in `src/content/scene-manifest.json`. A JPEG of the reference is
exported alongside for the review page's overlay.

To swap a piece, replace its file in `source/` and run the script again.

## Layout

Everything is placed in `src/features/scene/scene-layout.ts`, in the pixel
space of the reference illustration (1672×941), so any number can be checked
against it. The stage converts them to percentages and is fluid.

The rig was calibrated by template matching each piece against the reference,
searching position and scale for the lowest colour error; the flame, which
differs from the reference, is pinned by its head just inside the nozzle and
turned onto the flight axis (27.5°).

## Layers, back to front

| Layer | Motion |
| --- | --- |
| Sky gradient and star field (SVG, seeded) | Three star groups twinkle on uneven beats |
| Planets | Slow sway |
| Orbs and sparkles | Breathe and turn |
| Far clouds, faint | Drift across in ~110s |
| Back clouds | Drift across in ~60s |
| Speed lines | Cross along the flight axis in ~2s |
| Mid clouds | Drift across in ~50s, over the hero headline's lower lines |
| Rig: flame, cat, rocket | Floats and pitches as one piece (5.2s); flame gutters (0.46s). The cat sits behind the hull, astride it |
| Front clouds | Drift across in ~30s, in front of the flame's tail |

Nearer layers move faster, which is the parallax. Every drifting cloud is
doubled half a lap apart so the sky never empties between passes, and each
cloud's delay is set so the scene opens on the composed picture.

## Performance

- Transform and opacity only, on the compositor. Travel across the sky is
  measured against the sky box's width (`--box-w`, set by the stage), small
  in-place motions in percentages of the element, so motion scales with the
  stage.
- The sky is fitted over any stage like a cover image; the rig has its own box
  so a layout can place it independently. See the hero section in
  `DESIGN_SYSTEM.md` for how the headline is layered between the clouds.
- Served through `next/image` as AVIF or WebP at the size the stage needs:
  about 170 KB for the whole scene at desktop size, from ~9 MB of source PNGs.
- Paused whenever the stage is off screen or the tab is hidden; no motion at all
  under `prefers-reduced-motion`, leaving the composed picture.
- `--scene-speed` scales every loop at once; the review page uses it for
  slow-motion inspection.
