// node src/lib/eye-tracking.check.ts
import assert from "node:assert/strict";
import { pupilOffset } from "./eye-tracking.ts";

const rect = { left: 0, top: 0, width: 100, height: 100 }; // centre at 50,50
const MAX = 2.5;

// dead centre: pupils stay put
assert.deepEqual(pupilOffset(50, 50, rect, MAX), { x: 0, y: 0 });

// pointer far to the right: full deflection, no vertical drift
const right = pupilOffset(900, 50, rect, MAX);
assert.ok(right.x > 0, "looks right");
assert.ok(Math.abs(right.y) < 1e-9, "no vertical drift");
assert.ok(Math.abs(right.x - MAX) < 1e-9, "clamped to max");

// never exceeds max, and never points away from the pointer
for (const [x, y] of [
  [0, 0],
  [50, 0],
  [100, 100],
  [-80, 300],
  [50, 100],
]) {
  const o = pupilOffset(x, y, rect, MAX);
  assert.ok(Math.hypot(o.x, o.y) <= MAX + 1e-9, `clamped at ${x},${y}`);
  assert.ok((x - 50) * o.x + (y - 50) * o.y > 0, `points at pointer ${x},${y}`);
}

// collapsed element (display:none / not laid out): no NaN leaking into the DOM
assert.deepEqual(
  pupilOffset(0, 0, { left: 0, top: 0, width: 0, height: 0 }, MAX),
  {
    x: 0,
    y: 0,
  }
);

console.log("eye-tracking ok");
