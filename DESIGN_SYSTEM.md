# p2s — Design System (v0.1)

Neo-brutalist, dark-first system for the p2s marketing site. Hard edges, one
loud accent, oversized display type, and structural rules instead of shadows.

The **single source of truth for every token is
[`src/design-system/styles/theme.css`](src/design-system/styles/theme.css)**.
Tailwind derives its utilities from that file, and TypeScript reads the colors
back at runtime through `readThemeColor()`, so no token value is ever written
twice.

---

## 1. Color

The palette is derived from the reference direction and shifted so it is
adjacent to, but not identical with, its source.

| Token         | Value     | Role                                                     |
| ------------- | --------- | -------------------------------------------------------- |
| `void`        | `#0e0f12` | Page background. The default surface.                     |
| `abyss`       | `#0b0725` | Recessed surfaces — panels, overlays, the mobile menu.    |
| `carbon`      | `#17181d` | Raised neutral surface.                                   |
| `volt`        | `#a6fa5f` | **Signal accent.** Headline, primary CTA, live states.    |
| `volt-deep`   | `#7ed438` | Pressed / secondary state of the signal accent.           |
| `pulse`       | `#5a16ff` | **Structural accent.** Offset blocks, the ticker band.    |
| `pulse-soft`  | `#8c74ff` | Borders and mid-energy field cells.                       |
| `pulse-pale`  | `#d3c9fb` | Tertiary text on violet, low-energy field cells.          |
| `ember`       | `#ff4d2e` | Reserved. Exactly one focal moment per screen.            |
| `chalk`       | `#ffffff` | Primary text.                                             |
| `ash`         | `#9a9aa6` | Secondary text.                                           |

### Rules

- **Two accents, never three at equal weight.** `volt` carries meaning (this is
  the thing to look at), `pulse` carries structure (this is an edge or a plane).
- **`ember` is rationed** to a single element per viewport. On the hero that
  is the rocket's flame.
- **The one exception is validation.** Failure states in the contact form use
  `ember` and may appear several at a time. The rationing rule governs decorative
  focal points; an error is functional, and suppressing the second one to stay
  inside a colour budget would hide something the visitor needs in order to
  proceed. Nothing else on that screen uses `ember`.
- **No gradients on content.** Gradients exist only in the atmospheric backdrop
  and inside the hero scene, never behind text.

### Contrast

All pairings in use clear WCAG AA:

| Foreground | Background | Ratio    |
| ---------- | ---------- | -------- |
| `volt`     | `void`     | ~15:1    |
| `volt`     | `pulse`    | ~5.6:1   |
| `chalk`    | `void`     | ~18:1    |
| `ash`      | `void`     | ~6.9:1   |
| `void`     | `volt`     | ~15:1    |

---

## 2. Typography

| Role    | Family            | Why                                                                                                  |
| ------- | ----------------- | ---------------------------------------------------------------------------------------------------- |
| Display | **Anton** (400)   | Ultra-condensed, single-weight grotesque. Long uppercase lines fill the full measure without shrinking. |
| Body/UI | **Space Grotesk** | Same family as the reference site. Geometric, slightly mechanical, legible small.                     |
| Mono    | **Space Mono**    | Same superfamily as the body face, so indices and micro-labels share its skeletons.                   |

All three are self-hosted through `next/font/google` — no runtime request to
Google, no layout shift.

> **On the display face.** The reference site uses a licensed custom face whose
> average advance is ~0.22em — roughly Druk XX Condensed territory. Anton, at
> ~0.40em, is the closest freely licensable match and holds the same silhouette
> at hero scale. If you later license a compressed face (Druk, Compacta, PP Right
> Grotesk Compact), swapping it is a one-line change in
> [`src/design-system/fonts.ts`](src/design-system/fonts.ts) — but re-tune
> `--text-hero`, whose viewport term is calibrated to Anton's advance width.

### Scale

| Token         | Value                                | Use                              |
| ------------- | ------------------------------------ | -------------------------------- |
| `text-hero`   | `clamp(2.5rem, 7.6vw, 8.5rem)`       | The hero statement. LH `0.88`.   |
| `text-section`| `clamp(2.5rem, 6.4vw, 6rem)`         | Section headings. LH `0.9`.      |
| `text-display`| `clamp(1.75rem, 5vw, 3.5rem)`        | List labels, menu links.         |
| `text-ticker` | `clamp(1.0625rem, 1.9vw, 1.75rem)`   | Marquee band.                    |
| `text-lede`   | `clamp(1rem, 0.9rem + 0.35vw, 1.1875rem)` | Supporting paragraphs.      |
| `text-nav`    | `0.8125rem`                          | Navigation labels.               |
| `text-eyebrow`| `0.6875rem`                          | Mono micro-labels. Tracking `0.18em`. |

`--text-hero` sets the statement as a column beside the hero's rocket rather
than across the whole measure: its longest line (16 characters, 6.4em in Anton)
runs to about 700px at 1440px wide, which clears the rider, and the floor keeps
the 18 character first line inside a phone column. `--text-section`'s ceiling
keeps a 16-character line inside a seven-column measure at the widest layout.
**Changing the display face invalidates both numbers.**

> **Line height is load-bearing.** Any clipping mask built around a single line
> — the nav link swap, the hero character reveal — breaks if the line height is
> below the face's natural glyph extent (~1.2em for Space Grotesk, ~1.15em for
> Anton), because the glyphs then overflow their own line box and leak past the
> mask. This is why `--text-nav` is `1.4` and not `1`.

---

## 3. Shape & structure

- **Stroke width is `2px` everywhere.** One value, no exceptions.
- **Radius is `0.5rem` (`rounded-brutal`)** on controls; everything else is square.
- **Depth is expressed by offset planes, not shadows.** A control is two stacked
  rectangles; the lower one peeks out by `--offset-distance` (`5px`).
- Container: `--container-shell` = `85rem`, gutters `1.25rem` / `2.5rem` at `lg`.
- Header: `5rem`, `6.5rem` at `lg` (`.header-height` / `.header-offset`).

### The blueprint grid is one layer, not one per section

`BlueprintBackdrop` is mounted once in the root layout and spans the whole
document. It has to be: a grid painted by each section restarts at that
section's own top edge, so wherever a section's height is not an exact multiple
of the 5rem cell, the row at the seam is cut short and reads as a band of
rectangles between two sections.

Two consequences follow, and both are load-bearing:

- **Page sections must not set a background.** An opaque surface above the layer
  hides it. `body` already carries `void`, so dropping `bg-void` from a section
  changes nothing except letting the grid through. Cards and framed panels keep
  theirs — they are meant to read as solid planes sitting *on* the grid.
- **The layer carries no `z-index`.** A negative one would place it beneath the
  body background rather than above it, and it would never be seen. Being
  positioned and first in the document is what puts it above the background and
  below every section.

---

## 4. Motion

Curves and durations live in
[`src/design-system/tokens/motion.ts`](src/design-system/tokens/motion.ts)
(JavaScript, for Motion) and mirror the `--ease-*` properties in the theme layer
(CSS).

| Easing        | Curve                                    | Use                          |
| ------------- | ---------------------------------------- | ---------------------------- |
| `quick`       | `cubic-bezier(0.25, 0.1, 0.25, 1)`       | Hover, press, cross-fades.   |
| `snap`        | `cubic-bezier(0.16, 1, 0.3, 1)`          | Entrances. Expo-out.         |
| `inOutQuick`  | `cubic-bezier(0.455, 0.03, 0.515, 0.955)`| Symmetric transitions.       |

Durations: `instant` 0.12s · `quick` 0.24s · `base` 0.45s · `slow` 0.75s ·
`glacial` 1.05s.

> **Never express horizontal drift as a percentage.** Motion resolves a
> percentage `x` against the *animated element's own width*. A heading line is
> block level and therefore as wide as the whole measure, so a nominal `5%` nudge
> becomes a forty pixel shove: it clears the shell's `1.25rem` gutter, leaves the
> page, and `overflow-x: hidden` clips its first glyph without any other symptom.
> Both section headings use absolute units bounded by that gutter, and any new
> layer that drifts sideways must too.

### Choreography

Every full page load opens with the page loader (below). The page's entrance
is one sequence that starts the moment the loader begins to lift, not on
mount, so nothing plays out unseen behind it: the header slides in, the hero
statement types in per character (`0.016s` apart, from `heroEntranceDelay`),
the rocket flies in, then copy, actions and the ticker band. Motion components
wait on `useIntroReady()`; CSS animations are held by `html[data-intro="pending"]`.

### The page loader

The short logotype's letters arrive one at a time, 90ms apart, each whole:
its share of the black silhouette, its violet extrusion and its face move as
one. They arrive empty, face and extrusion dimmed, and then fill with colour in
reading order as the page loads, face and extrusion swept by the same rising
edge so each letter fills as one block: the P over the first third of the progress, the 2 over the
second, the S over the last. Underneath, a bar tracks the same progress: a dark
track split into ten segments over a pulse plane offset like every control,
filled from the left with volt hazard stripes that march while it loads, led by
a chalk edge. Progress is real: images in the document, web fonts, and the
window's `load` event.

- **One silhouette, three letters.** The source draws the black outline as a
  single shape. `LogoMark` gives each letter its share of it through a mask made
  of that letter's face and extrusion grown by a stroke, which reproduces the
  artwork to within a few pixels at the joins while letting each letter be its
  own unit.
- **Honest but paced.** Progress follows the real load but may not outrun a
  2.2s minimum, so a fast connection still sees the build, and gives up waiting
  after 7s, so a slow one is never walled off.
- **Shutter.** At 100% the letters hold full and the `void` panel lifts like a
  shutter with a volt leading edge, and a `pulse` panel behind it follows a beat
  late: two offset planes, like every control on the site.
- **Frame by frame without React.** Bar and letter fills are written straight
  to the DOM each frame, with easing timed in seconds rather than frames so it runs
  the same at 60Hz and 120Hz. React renders only on stage changes.
- **Once per visit, and on every home reload.** A blocking script in the
  document head (`INTRO_BOOT_SCRIPT`) decides before the first paint. The first
  full load of a visit plays the loader, and is recorded in `sessionStorage`.
  A manual reload of the home page plays it again and starts the page at the
  top: the browser's scroll restoration is switched off for that document,
  since the browser restores after the load event. Every other full load of a
  visit that has seen it (reloads of other pages, navigations Next.js completes
  with a full load, such as links to routes that do not exist yet) skips it:
  the script hides the loader, unlocks scrolling and releases the entrance
  animations before any bundle script runs, so nothing flashes. Client-side
  navigations never remount the root layout and never show it. `/lab` replays
  it on demand with `always`.
- **No scrollbar, no shift.** Scrolling is locked by CSS from the first paint
  (`html[data-loader]`, rendered by the root layout) until the loader has
  gone, not merely started to lift. The page always reserves the scrollbar's
  gutter, so unlocking never shifts the layout, and the loader spans `100vw`
  to cover that gutter too.
- **Reduced motion** skips the letters' entrance and fades out. **No
  JavaScript** hides the loader and releases the held animations through a
  `<noscript>` style.
- The inline mark comes from `LogoMark`, a server component, so its path data
  ships in the HTML and never in a client bundle. The header uses the plain SVG
  file instead. Both come from `bun run brand:prepare`.

### Reduced motion

`MotionProvider` sets `reducedMotion="user"`, which drops transform and layout
animations across the whole tree. On top of that the marquee renders a single
static pass, and the hero scene holds its composed picture with no motion.

---

## 5. Architecture

```
src/
├─ app/                     Route shell. Server components only.
├─ content/                 Copy and data. No JSX.
├─ design-system/
│  ├─ fonts.ts              next/font instances
│  ├─ styles/               theme.css · base.css · utilities.css
│  └─ tokens/               motion.ts · theme-colors.ts
├─ components/
│  ├─ brand/ icons/ providers/
│  ├─ form/                 FieldFrame · TextField · TextAreaField · SelectField
│  └─ ui/                   OffsetButton · MicroTag · Marquee · SplitText ·
│                           GrainOverlay · BlueprintBackdrop
├─ features/
│  ├─ site-header/          header, nav link, menu toggle, mobile panel
│  ├─ site-footer/          footer, footer link
│  ├─ intro/                page loader, intro-ready context, load progress
│  ├─ hero/                 section, headline, ticker
│  ├─ services/             section, service row
│  ├─ work/                 section, case file card, plate, rail, fingerprint
│  ├─ approach/             section, principle card
│  ├─ team/                 section, founder card
│  ├─ contact/              section, form, validation rules, server action
│  ├─ cursor/               mode resolution, pointer state, renderer
│  └─ scene/                rocket scene: layout, layers, loops, /lab review page
├─ hooks/
└─ lib/                     cn.ts · math.ts · scroll-to-section.ts
```

The rocket scene's artwork is prepared by a script in
[`design/scene/`](design/scene/README.md) and served from `public/scene/`.

The app icons are built from `public/brand/logo-short-favicon.png` by
`bun run favicon:prepare` ([`design/brand/favicon.mjs`](design/brand/favicon.mjs)):
a 16/32/48px `favicon.ico`, a 512px `icon.png`, a 180px `apple-icon.png` on
`void` (iOS blacks out transparency), and 192, 512 and maskable 512px icons in
`public/icons/` for the manifest in `src/app/manifest.ts`. The mark is three
times wider than it is tall: fitted into a square it filled the width but only
6 of 16px of height. The tab icons (`favicon.ico`, `icon.png`) therefore fill
the square on both axes, stretching the mark vertically, which reads as p2s at
tab sizes; the home screen and manifest icons, shown large, keep its
proportions.

### How the principles land here

- **Single responsibility.** The scene's layout lives in one module in the
  illustration's pixel space; the component only converts and animates it, and
  every loop is a keyframe in one stylesheet.
- **Open/closed.** `OffsetButton` tones and sizes are lookup maps; a new tone is
  a new entry, not an edit to the component.
- **Liskov.** `OffsetButton` renders a real `<a>` when given an `href` and a real
  `<button>` otherwise, so semantics always match behaviour.
- **Interface segregation.** Props are narrow and purpose-built. `OffsetButton`
  takes a label, a destination *or* a handler, and a tone — not a spread of
  every native button attribute.
- **Dependency inversion.** Features depend on content *interfaces*
  (`HeroContent`, `NavigationItem`, `Capability`) and receive data as props from
  the page. The hero depends on `RocketScene` for its backdrop and places the
  rig and the depth of its own copy through props and exported depths.

### Documentation convention

TSDoc block comments on every exported symbol. No inline `//` comments — where a
line needs explaining, the explanation belongs in the block above the symbol or
in a named constant.

---

## 6. The hero scene

The whole first screen is an illustrated scene: a cat riding a rocket up through
a violet night. The artwork, its preparation and every layer's motion are
described in [`design/scene/README.md`](design/scene/README.md); what matters to
the page is how the copy lives inside it.

- **The statement is layered into the sky.** It sits in front of the back
  clouds and behind the mid clouds, the rig and the front clouds, so clouds
  sail across its lower lines. That works only because nothing between the
  section and the layers creates a stacking context: the stage has no
  containment, no transform and no opacity, and every layer, the type included,
  is ordered by the depths exported as `SCENE_DEPTH`. Wrapping the headline or
  the stage in an animated element would silently flatten it.
- **Two boxes.** The sky is composed in the illustration's proportions and
  fitted over the section like a cover image, anchored bottom-left of centre so
  the densest clouds frame the copy. The rig (flame, rocket, rider) has its own
  box, placed right on wide screens and below the copy on narrow ones, where the
  copy reserves its height so the two never collide. On tall phones the sky
  stops growing past 2.2× the screen width and leaves the top to gradient and
  stars.
- **The rider is fixed to the rocket.** The rig floats and pitches as one piece;
  nothing on it moves on its own, so the cat never slides on the hull.
- **A veil, not a panel.** Between the back clouds and the type, a soft gradient
  in `abyss` darkens whatever drifts behind the copy. From the top on narrow
  screens, from the left on wide ones.
- **Copy and actions above everything.** The tags, lede, actions and
  availability sit at the interface depth, so they stay readable and clickable
  whatever passes.
- **Entrance.** The rig flies in from the lower left once on load, while the
  statement types in character by character as before.

## 7. The services index

Six rows, full-bleed, separated by 2px rules.

- **Flood.** A volt plane scales from a left origin across the row. Scaling
  rather than sliding a full-width block keeps the work on the compositor at any
  viewport width.
- **No layout shift.** The deliverable chips and the summary occupy the same
  cell and trade places, so the row height never changes mid-interaction and
  nothing moves out from under the cursor.
- **Keyboard parity.** Both states are variants on the link itself
  (`whileHover` / `whileFocus`), so tabbing to a row produces exactly the same
  reveal as hovering it. Verified with real `Tab` navigation, not programmatic
  `.focus()` — the latter does not raise `:focus-visible` and will mislead you.
- **Touch.** Below `lg` the chips are removed and the summary is always visible,
  because a touch device never produces a hover state and the copy would
  otherwise be unreachable.
- **Scroll layers.** An outlined `02` drifts upward behind the section while the
  two heading lines drift horizontally against each other. Rows wipe in from the
  left on entry, staggered by 60ms.

## 8. The work deck

Case files are dealt rather than listed. Each card pins one header strip lower
than the one before it, so the strips accumulate into a legible column of
everything already read — a drawer of files, not a carousel.

- **The stack is the index.** `--deck-strip` is both the height of a card's
  header strip and the vertical step between pinned cards. One value for both is
  what makes the strips sit flush instead of overlapping or leaving gaps.
- **Pinning is measured, not assumed.** A card pinned at an offset that pushes
  its lower edge past the viewport hides part of itself *with no way to scroll to
  it* — not moving is the whole point of pinning.
  [`use-deck-stacking.ts`](src/features/work/use-deck-stacking.ts) therefore
  tests the arithmetic against real measurements (deepest offset + tallest card +
  gutter ≤ viewport height) and only then sets `data-stacked`. Everywhere else
  the deck is a plain vertical stack of the same cards in the same order. This is
  what makes the section safe to hand real copy: a summary two lines longer than
  the placeholder changes the answer, and the hook recomputes it instead of
  stacking regardless.
- **The last card never pins, and no amount of trailing space changes that.** A
  sticky element is constrained to the *content box* of its containing block, and
  the last card's own bottom edge already sits on that boundary — there is
  nowhere left to hold it. `padding-bottom` does not move a content box, so
  trailing space buys nothing but an empty screen: measured across 0, 90, 160,
  240 and 405px of deck padding, the dwell is zero in every one. The deck
  therefore carries none, and lifts away as one the moment the last card lands.
  Buying the last card a real hold would mean extending the containing block
  itself, and it would cost exactly as much blank space as it bought in dwell —
  which is the trade this section declines.
- **Marks are generated, not drawn.**
  [`project-fingerprint.ts`](src/features/work/project-fingerprint.ts) hashes a
  project's id into a vertically symmetric nine by nine grid. Adding a project to
  the content file is enough to give it a mark — nothing is authored by hand, and
  nothing waits on photography that does not exist yet. The generator is seeded
  rather than random because the grid is rendered on the server and again on the
  client, and a different result on each pass would trip hydration. Symmetry is
  what makes a pseudo-random grid read as a designed mark rather than as noise.
- **Two accents inside one graphic.** A minority of cells take `volt`; the rest
  carry the silhouette in `chalk/20` over a `pulse` block offset by
  `--offset-distance`, so the mark obeys the same depth rule as the action
  controls and separates further on engagement.
- **No layout shift, keyboard parity.** Every reveal — the strip flood, the
  heading step, the volt rule, the plate separating — is a variant on the link
  itself, so tabbing to a card produces exactly the same result as hovering it.
  Verified with real `Tab` navigation.
- **Sticky and `overflow`.** No ancestor of the deck may set `overflow: hidden`,
  which is why the section's backdrop is scoped to its own clipped layer instead
  of the section clipping itself the way the services section does. `body` keeps
  `overflow-x: hidden`, and that is safe only because `html` stays `visible`: the
  declaration then propagates to the viewport rather than making `body` a scroll
  container that sticky would resolve against.

The position rail is decorative and hidden from assistive technology — the list
it mirrors is already in the document. It appears only from `2xl`, where there is
margin beside the shell to put it in without stealing width from the cards. Its
marker is a proportional read of the deck's scroll rather than a record of pin
events, because the deepest card settles only as the deck starts to lift and a
mapping keyed to pinning would leave the last marker dark throughout.

## 9. The approach section

Three rules p2s works by — code quality, security, plain communication — one
card each, closed by a line that puts them in writing.

- **Cards are two planes, like every control.** An opaque face over a `pulse`
  block offset by 6px. On hover the face lifts 2px, the block drops to 10px,
  the border turns `volt` and the rule under the title runs the full measure.
  The cards are not links, so nothing in them claims a focus state it cannot
  act on.
- **Each promise ends in a readout.** A mono block printed like the output of
  a command (`$ review --strict`), checks on the left and their state in
  `volt` on the right, joined by a dotted leader. Lines print one at a time
  once the card is in view. It turns a promise into something that reads as
  checkable, and is the section's visual signature.
- **Pinned to the bottom.** The readout sits on the card's bottom edge, so cards
  side by side end on the same line whatever their copy. Titles are kept close
  in length so all three break into the same number of lines at 1024px.
- **Three abreast from `lg`, stacked below.** Each card keeps 10px of room on
  its right and bottom for the offset plane, so the block never touches the
  card beside or below it.

## 10. The team section

The two founders side by side, each a portrait over their role, name, what they
do on a project and the areas they own.

- **The portraits wear the brand until you look closer.** At rest the photo is
  held in greyscale, slightly pushed in, under a `pulse`-to-`volt` gradient
  blended in hard light: a duotone that keeps the face legible. Hovering the
  photo itself (not the copy beneath it) lifts the gradient off from the bottom up like the page loader's shutter, led by
  a `volt` edge, while the photo settles back and regains its colour, the
  frame's border turns `volt` and the offset `pulse` plane behind it parts.
- **Touch screens get the reveal too.** They have no hover, so there the
  portrait reveals itself while it is mostly on screen and washes back over as
  it leaves, rather than staying tinted for good.
- **The one gradient on content.** The colour rules keep gradients off content;
  this one sits on a photo, never behind text, and exists to bring two
  unrelated photographs into the palette.
- **Placeholders.** Names, bios and portraits are stand-ins. The portraits come
  from a public avatar service that `next.config.ts` allows for that reason
  alone; replace them with files under `public/team/` and drop the pattern.

## 11. The contact form

Six fields, two of them selects this system had to build itself.

- **Validation runs twice, and the second time is the one that counts.** The
  rules in [`contact-request.ts`](src/features/contact/contact-request.ts) are
  pure functions that take their messages as an argument, so the same code runs
  in the browser for an instant answer and again inside the server action for a
  verdict. A request arriving over the network never went near the form and
  cannot be assumed to have passed anything.
- **Nothing is marked wrong too early.** Validation mode is `onTouched`: a field
  says nothing while a visitor is filling it for the first time, and from the
  moment they leave it the message tracks every keystroke. Complaining before
  someone has finished their first attempt is the fastest way to make a form
  feel hostile.
- **The failure slot is always there.** Every field reserves the height of one
  message line whether or not one is showing, so revealing an error never moves
  the control the visitor was about to reach for.
- **Focus is CSS, not state.** `FieldFrame` lights up through `focus-within`,
  which is why an input, a textarea and a listbox trigger all behave identically
  without reporting anything back — and why the visual state cannot drift out of
  step with the real one.
- **The native focus ring is replaced, not removed.** `outline-none` on its own
  would be a straightforward accessibility regression. Focus here turns the
  border `volt` against `carbon` and lifts a `pulse` block out from behind the
  control, clearing the non-text contrast requirement several times over.
- **The select is a rebuild, not a restyle.** `<select>` draws its popup in the
  operating system and cannot be brought into this palette, so `SelectField`
  implements the ARIA select-only combobox pattern: one tab stop, the active
  option published through `aria-activedescendant` rather than focused, pointer
  presses inside the list cancelled so the trigger keeps focus while a choice
  lands, and arrows, `Home`, `End`, `Enter`, `Space`, `Escape` and a
  first-character jump all handled. Choosing also marks the field touched, since
  picking an option is a finished act in a way that typing a first character is
  not.
- **Choices serialise to `value`, never to `label`**, so the copy can be
  rewritten without invalidating anything already received.
- **Nothing is delivered until `CONTACT_WEBHOOK_URL` is set**, and the action
  reports failure rather than success while it is missing. A form that thanks
  people for messages it silently dropped is worse than one that is visibly not
  finished.

## 12. The cursor

Two hard-edged planes: a core square that marks the exact position with no lag,
and a 40px ring that trails it on a spring.

| State     | Ring                                          |
| --------- | --------------------------------------------- |
| `default` | Square outline, 2px.                           |
| `action`  | Scales to 1.45 and rotates 45° into a diamond. |
| `text`    | Collapses to a solid 2×48px caret bar.         |
| pressed   | Snaps to 0.72, border thickens, fill appears.  |

- **Two shapes, not one resized.** Prose and controls get visibly different
  transformations, so the cursor tells you what you are over before you read it.
- **`difference` blend.** The layer inverts whatever is beneath it. This is
  functional, not decorative: a fixed colour would vanish over the volt planes
  that flood the services rows. It also happens to resolve to palette hues
  everywhere — white over `void` reads white, over `volt` reads violet.
- **Mode resolution is a pure function** (`cursor-mode.ts`) and action wins over
  text, which is what makes nesting behave: a heading inside a link resolves to
  `action`. `data-cursor="action" | "text"` is the opt-in for anything the
  default selectors miss.
- **Position is a motion value, not React state.** `pointermove` fires every
  frame; routing that through a render would drop frames. Only mode, press, and
  visibility are React state, and each changes at most on a boundary crossing.
- **Every variant declares every key.** Motion does not reset properties a
  variant omits, so a variant setting `scaleX` next to one setting `scale` would
  compound into a permanently squashed ring.

### Accessibility trade-off

Suppressing the native cursor overrides the user's system cursor settings —
size, colour, and high-contrast schemes. To limit the blast radius it mounts
only for `(pointer: fine)`, so touch and stylus users are untouched, and the
`cursor: none` rule is scoped to a class present only while the component is
mounted. Reduced-motion users get the cursor without the follow spring. If you
want a stronger guarantee, the next step is a visible preference toggle that
unmounts the component — worth doing before launch.

## 13. Verified

Typecheck, ESLint, and `next build` pass; the route prerenders as static.
Measured in-browser at 1440×900, 915×910 and 375×812: no horizontal overflow at
any width, the hero statement clears the rider and its actions clear the flame
at 1024 and 1440 wide, nav link masks show zero bleed at rest,
services rows invert identically on hover and keyboard focus, header elevation
and mobile panel (open / Escape / scroll lock) all behave. Cursor states settle
on their exact variant values and it mounts only for fine pointers.

The work deck was measured at 1600×900, 1536×900, 1440×900, 1280×800, 1024×720,
882×910, 768×1024 and 375×812. It stacks at and above 1280×800 (deepest offset
232 + tallest card 523 + gutter 32 = 787 against 800 available) and correctly
declines to stack at 1024×720, where the same sum reaches 883. Pinned cards
settle exactly one `--deck-strip` apart (112 / 152 / 192) and converge without
ever exposing more than a strip of the card beneath as the deck lifts away. The
last card's bottom edge and the closing action sit 96px apart — the section's own
`lg:mt-24` rhythm — and are on screen together. Hover and real `Tab` focus produce identical
variant values on every layer. No horizontal overflow at any width; the rail
clears the card by 36px at 1536 and never renders below it.

The contact form was driven end to end at 1440×900, 882×910 and 375×812. Leaving
a required field empty raises its message with the frame's height unchanged
(105px before and after), sets `aria-invalid` and points `aria-describedby` at
the message. The select opens on click, keeps focus on its trigger, moves its
active option with the arrow keys, commits on `Enter` without submitting the
form, and closes on `Escape` without choosing. Submission was verified against a
local receiver: the payload arrives with the option `value`s rather than their
labels, and the panel replaces the form. With `CONTACT_WEBHOOK_URL` unset the
same submission reports failure instead. The listbox aligns to its field and
stays inside the viewport at 375px.

The document grid was checked across the services/work seam, which falls 24px
into a cell: every row is now a uniform 5rem through it. Both section headings
were swept across their full scroll range at 882×910 and 375×812 and hold a
minimum left edge of 4px — inside the gutter at every position. Before the fix
they reached −13px (services) and −22px (work) and lost their first glyph.

> **Testing note.** The Browser pane throttles `requestAnimationFrame` to ~2
> frames per 500ms while backgrounded, so a fixed `await` after triggering an
> animation reads a half-finished interpolation and looks like a frozen
> component. Sample the value repeatedly until it stops changing instead.

## 14. The footer

A full-bleed band closing the page, the bottom counterpart of the header: its
surface (`carbon` at half strength) and its horizontal rules run from edge to
edge of the viewport, its top rule is the header's `volt/25`, and its content
keeps to the page's measure. It sits flush against the bottom of the document.

- **Cells, not open columns.** One grid split by the system's 2px rules: the
  statement, the index and the disciplines, then a closing row with the
  notices. Every cell in a row shares one height, so each piece is pinned to
  its cell's edges rather than floating in open space.
- **One top line, one bottom line.** The eyebrow and both column titles share
  the top line, and the closing sentence sits on the statement cell's bottom
  edge. The footer carries no logo: the header's mark is always one scroll
  away.
- **Aligned to the header.** The outer cells carry no padding on their outer
  side, so the content starts and ends exactly where the header's mark and
  action do.
- **Five, three, four.** On wide screens the cells take five, three and four
  columns, which still holds "Software Development" on one line at 1024px.
  Below `lg` the statement spans the band and the lists split the row beneath;
  on phones every cell stacks.
- **The notices are the grid's last row.** From `xl` the closing row splits
  into cells whose vertical rules carry on from the cells above. Below that the
  copyright and the rights notice travel together, opposite the signature from
  `lg` and stacked above it below that.
- **No address and no back-to-top control.** The contact section sits directly
  above with the form and the direct email, and the header is always one
  scroll away.

## 15. In-page navigation

Every link to a section of the landing page (header, mobile panel, hero
actions, services and footer) goes through `scrollToSection`
([`src/lib/scroll-to-section.ts`](src/lib/scroll-to-section.ts)): a smooth
glide, an instant jump under reduced motion, and the hash mirrored in the
address bar. Next.js's own hash handling is bypassed because it skips the
scroll whenever the section's top edge is already on screen and resets to the
top of the document first, which makes a smooth glide stutter.

## 16. Not yet built

Real founder names, bios and portraits. The routes some links still point at — the
four `/work/*` case studies, `/work`, and the six `/services/*` detail pages.
Also outstanding: an OG image, and real proof points — the service summaries
and **every project in
[`src/content/projects.ts`](src/content/projects.ts)** are placeholder copy.

**Launch blocker.** `CONTACT_WEBHOOK_URL` must point at something that accepts a
JSON `POST` — an inbox relay, a CRM endpoint, an automation platform — or the
contact form cannot deliver and will tell every visitor so.

> **Replacing the placeholder projects.** Names, summaries, tags and metrics can
> all change freely; the deck measures itself and will simply stop stacking on
> viewports that can no longer hold a card. To keep it stacking on laptops, aim
> for summaries around 240 characters and at most three metrics. Changing a
> project's `id` changes its generated mark, so treat the id as permanent once a
> case study is published.
