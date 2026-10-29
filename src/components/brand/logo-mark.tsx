import { cn } from "@/lib/cn";

import { LOGO_LETTERS, LOGO_SILHOUETTE, LOGO_VIEWBOX, type LogoPath } from "./logo-geometry";

/**
 * Props accepted by {@link LogoMark}.
 */
export interface LogoMarkProps {
  /**
   * Prefix for the ids inside the SVG. Must be unique on the page, since the
   * masks and clip paths are referenced by id.
   */
  readonly id: string;
  /**
   * Draws every letter as a gauge: its face and its extrusion dimmed, with
   * their colour rising together from the bottom through one clip rectangle
   * per letter, with the class `logo-fill` and a `data-letter` naming the
   * letter. The rectangles render empty; whoever drives the gauge sets their
   * `y` and `height`.
   */
  readonly fillable?: boolean;
  /** Additional classes applied to the SVG. */
  readonly className?: string;
}

/**
 * How far each letter's share of the silhouette reaches beyond its face and
 * extrusion, in view box units. Comfortably wider than the black outline, and
 * narrower than the gaps between letters at their tops and feet.
 */
const SILHOUETTE_REACH = 44;

/** Opacity of a letter's face and extrusion before they fill. */
const EMPTY_OPACITY = 0.16;

function Path({ path, fill = path.fill }: { readonly path: LogoPath; readonly fill?: string }) {
  return <path fill={fill} fillRule="evenodd" transform={`translate(${path.x} ${path.y})`} d={path.d} />;
}

/**
 * A letter's paths, drawn either plainly or as a gauge: dimmed, with a full
 * copy on top clipped by the letter's fill rectangle. The face and the
 * extrusion of a letter reference the same rectangle, so they fill as one.
 */
function Fillable({
  paths,
  clipId,
}: {
  readonly paths: readonly LogoPath[];
  readonly clipId: string | null;
}) {
  const drawn = paths.map((path) => <Path key={`${path.x}-${path.y}`} path={path} />);

  if (clipId === null) {
    return drawn;
  }

  return (
    <>
      <g opacity={EMPTY_OPACITY}>{drawn}</g>
      <g clipPath={`url(#${clipId})`}>{paths.map((path) => <Path key={`${path.x}-${path.y}`} path={path} />)}</g>
    </>
  );
}

/**
 * The short logotype, inlined and split letter by letter so each letter can be
 * animated as a whole.
 *
 * The source draws the black silhouette as a single shape behind all three
 * letters. Here each letter takes its own share of it through a mask made of
 * that letter's face and extrusion, grown by a stroke, so the artwork is
 * unchanged but every letter, outline included, is its own unit. The original
 * back-to-front order is kept (silhouettes, then extrusions, then faces), and
 * every piece of a letter carries the class `logo-letter-<key>` (`p`, `two`,
 * `s`), so styles can move a letter's pieces together. Faces also carry
 * `logo-face`.
 *
 * Renders fine on the server and carries no animation of its own. Use the
 * plain file in `public/brand/` wherever the mark only needs to be shown; this
 * inline version costs its full path data in the page.
 */
export function LogoMark({ id, fillable = false, className }: LogoMarkProps) {
  const { x, y, width, height } = LOGO_VIEWBOX;

  return (
    <svg aria-hidden viewBox={`${x} ${y} ${width} ${height}`} className={cn("block overflow-visible", className)}>
      <defs>
        {LOGO_LETTERS.map((letter) => (
          <mask
            key={letter.key}
            id={`${id}-silhouette-${letter.key}`}
            maskUnits="userSpaceOnUse"
            x={x - SILHOUETTE_REACH}
            y={y - SILHOUETTE_REACH}
            width={width + SILHOUETTE_REACH * 2}
            height={height + SILHOUETTE_REACH * 2}
          >
            <g stroke="white" strokeWidth={SILHOUETTE_REACH * 2} strokeLinejoin="round">
              {[letter.face, ...letter.extrusion].map((path) => (
                <Path key={`${path.x}-${path.y}`} path={path} fill="white" />
              ))}
            </g>
          </mask>
        ))}

        {fillable
          ? LOGO_LETTERS.map(({ key, fillBounds }) => (
              <clipPath key={key} id={`${id}-fill-${key}`}>
                <rect
                  className="logo-fill"
                  data-letter={key}
                  x={fillBounds.x}
                  y={fillBounds.y + fillBounds.height}
                  width={fillBounds.width}
                  height={0}
                />
              </clipPath>
            ))
          : null}
      </defs>

      <g className="logo-silhouette">
        {LOGO_LETTERS.map(({ key }) => (
          <g key={key} className={`logo-letter-${key}`} mask={`url(#${id}-silhouette-${key})`}>
            <Path path={LOGO_SILHOUETTE} />
          </g>
        ))}
      </g>

      <g className="logo-extrusion">
        {LOGO_LETTERS.map(({ key, extrusion }) => (
          <g key={key} className={`logo-letter-${key}`}>
            <Fillable paths={extrusion} clipId={fillable ? `${id}-fill-${key}` : null} />
          </g>
        ))}
      </g>

      <g className="logo-faces">
        {LOGO_LETTERS.map(({ key, face }) => (
          <g key={key} className={`logo-face logo-letter-${key}`}>
            <Fillable paths={[face]} clipId={fillable ? `${id}-fill-${key}` : null} />
          </g>
        ))}
      </g>
    </svg>
  );
}
