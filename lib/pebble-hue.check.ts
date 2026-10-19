// node lib/pebble-hue.check.ts
import assert from "node:assert/strict";
import { FORBIDDEN, HUES, rampFor, sweep } from "./pebble-hue.ts";

const [LO, HI] = FORBIDDEN;
const lum = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return (
    0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)
  );
};

// the requirement: no green, no cyan, ever -- and the fade between one step and
// the next must not cross it either. blue -> orange has to come back through
// magenta, not go forward through green.
const hueInBand = (h: number) => {
  const n = ((h % 360) + 360) % 360;
  return n >= LO && n <= HI;
};
for (const h of HUES) {
  assert.ok(!hueInBand(h), `hue ${h} is in the ${LO}..${HI} green band`);
}
for (let i = 0; i < HUES.length; i++) {
  const from = HUES[i];
  const to = HUES[(i + 1) % HUES.length];
  for (let s = 0; s <= 200; s++) {
    const h = sweep(from, to, s / 200);
    assert.ok(
      !hueInBand(h),
      `fade ${from} -> ${to} enters green at ${h.toFixed(1)}`
    );
  }
  assert.deepEqual(sweep(from, to, 0), from);
  assert.deepEqual(sweep(from, to, 1), to);
}

// hue 13 still reproduces the palette the design was built on, exactly
assert.deepEqual(rampFor(13), {
  light: "#F9D3C8",
  mid: "#EF9076",
  base: "#E8613C",
  deep: "#C03B17",
  outline: "#9B3012",
  shadow: "#892A10",
});

// every hue in the wheel is well formed and the ramp stays ordered light -> dark,
// which is what keeps the bevel and outline reading as depth instead of flat plate
for (let h = 0; h < 360; h++) {
  const r = rampFor(h);
  for (const [name, c] of Object.entries(r)) {
    assert.match(c, /^#[0-9A-F]{6}$/, `${name} at hue ${h} is ${c}`);
  }
  assert.ok(
    lum(r.light) > lum(r.mid) &&
      lum(r.mid) > lum(r.base) &&
      lum(r.base) > lum(r.deep) &&
      lum(r.deep) > lum(r.outline) &&
      lum(r.outline) > lum(r.shadow),
    `ramp out of order at hue ${h}`
  );
}

// each step of the cycle is a real colour change, not a near-repeat
for (let i = 0; i < HUES.length; i++) {
  const a = rampFor(HUES[i]).base;
  const b = rampFor(HUES[(i + 1) % HUES.length]).base;
  const [ar, ag, ab] = [1, 3, 5].map((o) => parseInt(a.slice(o, o + 2), 16));
  const [br, bg, bb] = [1, 3, 5].map((o) => parseInt(b.slice(o, o + 2), 16));
  const dist = Math.hypot(ar - br, ag - bg, ab - bb);
  assert.ok(dist > 60, `${a} -> ${b} is only ${dist.toFixed(1)} apart`);
}

// and the four are distinct
assert.equal(new Set(HUES.map((h) => rampFor(h).base)).size, HUES.length);

console.log("pebble-hue ok");
