import { STAGE } from "./scene-layout";

/** Stars per twinkle group. */
const STARS_PER_GROUP = 34;

/** Beats of the three twinkle groups, in seconds, deliberately coprime-ish. */
const GROUPS = [
  { duration: 3.1, delay: 0 },
  { duration: 4.3, delay: -1.4 },
  { duration: 5.7, delay: -2.9 },
] as const;

/**
 * Deterministic pseudo-random sequence. The field is rendered on the server and
 * hydrated on the client, so both must draw the same stars.
 *
 * @param seed - Starting state.
 */
function sequence(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

/**
 * Star colours: mostly chalk, a few in the pale accent, the odd one in volt.
 *
 * @param roll - A value in `[0, 1)`.
 */
function starColour(roll: number): string {
  if (roll > 0.94) return "var(--color-volt)";
  if (roll > 0.7) return "var(--color-pulse-pale)";
  return "var(--color-chalk)";
}

const field = GROUPS.map((group, index) => {
  const random = sequence(97 + index * 31);
  return {
    ...group,
    stars: Array.from({ length: STARS_PER_GROUP }, () => ({
      x: random() * STAGE.width,
      y: random() * STAGE.height * 0.82,
      r: 0.9 + random() * 1.9,
      fill: starColour(random()),
    })),
  };
});

/**
 * The star field behind everything: three groups of dots twinkling on
 * different beats. One SVG, no images. It covers the whole stage rather than
 * just the sky box, so a tall stage whose sky stops short of the top still has
 * stars up there.
 */
export function Starfield() {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${STAGE.width} ${STAGE.height}`}
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 size-full"
    >
      {field.map((group) => (
        <g
          key={group.duration}
          className="scene-loop scene-stars"
          style={
            {
              "--loop-duration": `${group.duration}s`,
              "--loop-delay": `${group.delay}s`,
            } as React.CSSProperties
          }
        >
          {group.stars.map((star) => (
            <circle
              key={`${star.x.toFixed(1)}-${star.y.toFixed(1)}`}
              cx={star.x.toFixed(1)}
              cy={star.y.toFixed(1)}
              r={star.r.toFixed(2)}
              fill={star.fill}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}
