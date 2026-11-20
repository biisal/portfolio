export type Ramp = {
  light: string;
  mid: string;
  base: string;
  deep: string;
  outline: string;
  shadow: string;
};

/**
 * The hues the body cycles through, in order: orange, yellow, pink, blue.
 * Green and cyan are absent on purpose -- the body should never look like it is
 * off, and a full trip round the wheel would put it through both.
 */
export const HUES = [13, 50, 330, 220] as const;

/** The band the body must never enter, degrees. */
export const FORBIDDEN = [70, 200] as const;

/**
 * Shortest way round the wheel from one hue to another, t in 0..1. Used for the
 * fade between cycle steps, so blue -> orange travels back through magenta
 * rather than forward through green.
 */
export function sweep(from: number, to: number, t: number): number {
  const delta = ((((to - from) % 360) + 540) % 360) - 180;
  return (from + delta * t + 360) % 360;
}

/**
 * Fixed saturation and lightness: only the hue moves, so the ramp keeps the
 * depth it was designed with (midday orange was #F9D3C8 / #EF9076 / #E8613C /
 * #C03B17 / #9B3012 / #892A10) and stays legible on a dark page at any hue.
 */
const SAT = 0.789;
const LIGHT = {
  light: 88,
  mid: 70,
  base: 57.3,
  deep: 42,
  outline: 34,
  shadow: 30,
} as const;

/** h in degrees, s and l in 0..1. */
export function hslHex(h: number, s: number, l: number): string {
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  const hex = (x: number) =>
    Math.round(255 * x)
      .toString(16)
      .padStart(2, "0");
  return `#${hex(f(0))}${hex(f(8))}${hex(f(4))}`.toUpperCase();
}

/** The whole mascot ramp for one hue. */
export function rampFor(hue: number): Ramp {
  return {
    light: hslHex(hue, SAT, LIGHT.light / 100),
    mid: hslHex(hue, SAT, LIGHT.mid / 100),
    base: hslHex(hue, SAT, LIGHT.base / 100),
    deep: hslHex(hue, SAT, LIGHT.deep / 100),
    outline: hslHex(hue, SAT, LIGHT.outline / 100),
    shadow: hslHex(hue, SAT, LIGHT.shadow / 100),
  };
}
