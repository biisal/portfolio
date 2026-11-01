// node lib/stickman/pose.check.ts
import assert from "node:assert/strict";
import { BODY, blendPose, computePose, solveArm, solveLeg } from "./pose.ts";
import type { Limb, Pose, PoseInput, PosePhase } from "./pose.ts";

const EPS = 1e-9;
const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y);

const allPoints = (p: Pose) => [
  p.head,
  p.neck,
  p.shoulder,
  p.hip,
  ...p.legNear,
  ...p.legFar,
  ...p.armNear,
  ...p.armFar,
];

const finite = (p: Pose) =>
  allPoints(p).every((q) => Number.isFinite(q.x) && Number.isFinite(q.y));

const legsIntact = (p: Pose) =>
  [p.legNear, p.legFar].every(
    (l: Limb) =>
      Math.abs(dist(l[0], l[1]) - BODY.thigh) < EPS &&
      Math.abs(dist(l[1], l[2]) - BODY.shin) < EPS
  );

const armsIntact = (p: Pose) =>
  [p.armNear, p.armFar].every(
    (l: Limb) =>
      Math.abs(dist(l[0], l[1]) - BODY.upper) < EPS &&
      Math.abs(dist(l[1], l[2]) - BODY.fore) < EPS
  );

const input = (over: Partial<PoseInput> = {}): PoseInput => ({
  phase: "walk",
  walkPhase: 0,
  walkAmt: 1,
  k: 0,
  vyNorm: 0,
  fall: false,
  lean: 0,
  ...over,
});

/* ---------- leg IK ---------- */

{
  const hip = { x: 0, y: -25 };

  // A reachable target is hit exactly and the bones keep their length.
  const reachable = solveLeg(hip, { x: 8, y: -4 });
  assert.ok(dist(reachable[2], { x: 8, y: -4 }) < EPS, "reaches the target");
  assert.ok(Math.abs(dist(reachable[0], reachable[1]) - BODY.thigh) < EPS);
  assert.ok(Math.abs(dist(reachable[1], reachable[2]) - BODY.shin) < EPS);

  // Straight down: the knee sticks out forward, not backward.
  const down = solveLeg(hip, { x: 0, y: -2 });
  assert.ok(down[1].x > 0, "knee bends forward");

  // Out of reach: the foot is as far as it can go, along the same direction.
  const far = solveLeg(hip, { x: 300, y: -25 });
  assert.ok(Number.isFinite(far[2].x) && Number.isFinite(far[2].y));
  assert.ok(dist(far[0], far[2]) <= BODY.thigh + BODY.shin);
  assert.ok(far[2].x > 0 && Math.abs(far[2].y - hip.y) < 1e-6, "same heading");
  assert.ok(Math.abs(dist(far[0], far[1]) - BODY.thigh) < EPS);

  // Target exactly on the hip: no division by zero.
  const onHip = solveLeg(hip, hip);
  assert.ok(onHip.every((q) => Number.isFinite(q.x) && Number.isFinite(q.y)));
}

/* ---------- arm FK ---------- */

{
  const s = { x: 0, y: -20 };
  const hang = solveArm(s, 0, 0);
  assert.ok(Math.abs(hang[2].y - (s.y + BODY.upper + BODY.fore)) < EPS);
  assert.ok(Math.abs(hang[2].x) < EPS, "hangs straight down");

  const up = solveArm(s, Math.PI, 0);
  assert.ok(up[2].y < s.y - 19, "angle PI reaches straight up");

  const fwd = solveArm(s, Math.PI / 2, 0);
  assert.ok(fwd[2].x > 19, "angle PI/2 reaches forward");
}

/* ---------- walk cycle ---------- */

{
  let minHipY = Infinity;
  let maxHipY = -Infinity;
  for (let a = 0; a < Math.PI * 2; a += 0.05) {
    const p = computePose(input({ walkPhase: a }));
    assert.ok(finite(p), `finite at ${a}`);
    assert.ok(legsIntact(p), `legs keep their length at ${a}`);
    assert.ok(armsIntact(p), `arms keep their length at ${a}`);
    assert.ok(p.head.y < p.neck.y && p.neck.y < p.hip.y, `upright at ${a}`);
    assert.ok(p.legNear[2].y <= 1e-9, `near foot above ground at ${a}`);
    assert.ok(p.legFar[2].y <= 1e-9, `far foot above ground at ${a}`);
    minHipY = Math.min(minHipY, p.hip.y);
    maxHipY = Math.max(maxHipY, p.hip.y);
  }
  assert.ok(maxHipY - minHipY > 1, "the hip bobs while walking");

  // Mid-stride: feet are wide apart.
  const wide = computePose(input({ walkPhase: Math.PI / 2 }));
  assert.ok(
    Math.abs(wide.legNear[2].x - wide.legFar[2].x) > 20,
    "wide stance mid-stride"
  );

  // Legs and arms are in opposition: near foot forward means near hand back.
  assert.ok(wide.legNear[2].x > wide.legFar[2].x);
  assert.ok(wide.armNear[2].x < wide.armFar[2].x, "arms swing against legs");

  // The gait is periodic.
  const a = computePose(input({ walkPhase: 1.3 }));
  const b = computePose(input({ walkPhase: 1.3 + Math.PI * 2 }));
  assert.ok(dist(a.legNear[2], b.legNear[2]) < 1e-9, "one cycle is 2*PI");
}

/* ---------- standing still ---------- */

{
  const idle = computePose(input({ walkAmt: 0, walkPhase: 2.2 }));
  const idle2 = computePose(input({ walkAmt: 0, walkPhase: 5.5 }));
  assert.ok(dist(idle.legNear[2], idle2.legNear[2]) < EPS, "idle ignores gait");
  assert.ok(finite(idle) && legsIntact(idle));
  // walkAmt blends smoothly: halfway sits between the two.
  const half = computePose(input({ walkAmt: 0.5, walkPhase: Math.PI / 2 }));
  const walk = computePose(input({ walkAmt: 1, walkPhase: Math.PI / 2 }));
  assert.ok(
    Math.abs(half.legNear[2].x - idle.legNear[2].x) <
      Math.abs(walk.legNear[2].x - idle.legNear[2].x),
    "partway between standing and walking"
  );
}

/* ---------- every phase, everywhere ---------- */

{
  const phases: PosePhase[] = ["walk", "crouch", "air", "land"];
  for (const phase of phases) {
    for (let k = 0; k <= 1.0001; k += 0.05) {
      for (const vyNorm of [-1, -0.3, 0, 0.6, 1]) {
        for (const fall of [false, true]) {
          for (const walkAmt of [0, 0.5, 1]) {
            const p = computePose(
              input({ phase, k, vyNorm, fall, walkAmt, walkPhase: k * 6 })
            );
            const tag = `${phase} k=${k.toFixed(2)} vy=${vyNorm} fall=${fall}`;
            assert.ok(finite(p), `finite: ${tag}`);
            assert.ok(p.head.y < p.hip.y, `head above hip: ${tag}`);
            assert.ok(p.legNear[2].y <= 1e-9, `no ground penetration: ${tag}`);
            assert.ok(p.legFar[2].y <= 1e-9, `no ground penetration: ${tag}`);
          }
        }
      }
    }
  }

  // Crouching really does get lower than standing.
  const stand = computePose(input({ phase: "crouch", walkAmt: 0, k: 0 }));
  const squat = computePose(input({ phase: "crouch", walkAmt: 0, k: 1 }));
  assert.ok(squat.hip.y > stand.hip.y + 5, "crouch lowers the hip");

  // Airborne: hands higher than the head when rising.
  const rise = computePose(input({ phase: "air", k: 0.3, vyNorm: -1 }));
  assert.ok(rise.armNear[2].y < rise.head.y, "arms up on the way up");

  // Landing squashes, then recovers.
  const hit = computePose(input({ phase: "land", walkAmt: 0, k: 0 }));
  const done = computePose(input({ phase: "land", walkAmt: 0, k: 1 }));
  assert.ok(hit.hip.y > done.hip.y + 4, "landing squash recovers");

  // Continuity at the phase boundaries (no pop).
  const walkEnd = computePose(input({ phase: "walk", walkAmt: 0 }));
  const landEnd = computePose(input({ phase: "land", walkAmt: 0, k: 1 }));
  assert.ok(
    dist(walkEnd.hip, landEnd.hip) < 1e-9,
    "land ends where walk starts"
  );
  const crouchEnd = computePose(input({ phase: "crouch", walkAmt: 0, k: 1 }));
  const airStart = computePose(input({ phase: "air", walkAmt: 0, k: 0 }));
  assert.ok(
    dist(crouchEnd.hip, airStart.hip) < 1e-9,
    "air starts where crouch ends"
  );
  const airEnd = computePose(input({ phase: "air", k: 1, vyNorm: 1 }));
  const landStart = computePose(input({ phase: "land", walkAmt: 0, k: 0 }));
  assert.ok(
    dist(airEnd.hip, landStart.hip) < 1e-9,
    "land starts where air ends"
  );
}

/* ---------- blending ---------- */

{
  const a = computePose(input({ walkAmt: 0 }));
  const b = computePose(input({ phase: "crouch", walkAmt: 0, k: 1 }));
  const at0 = blendPose(a, b, 0);
  const at1 = blendPose(a, b, 1);
  assert.deepEqual(at0.hip, a.hip);
  assert.deepEqual(at1.hip, b.hip);
  assert.deepEqual(at0.legNear[2], a.legNear[2]);
  assert.deepEqual(at1.legNear[2], b.legNear[2]);
  assert.deepEqual(blendPose(a, b, -5).hip, a.hip, "t clamps low");
  assert.deepEqual(blendPose(a, b, 9).hip, b.hip, "t clamps high");
  assert.deepEqual(
    blendPose(a, b, Number.NaN).hip,
    a.hip,
    "NaN is treated as 0"
  );
}

/* ---------- garbage in, finite out ---------- */

{
  const junk = [
    { walkPhase: Number.NaN },
    { walkPhase: Infinity },
    { walkPhase: 1e12 },
    { walkAmt: -3 },
    { walkAmt: 7 },
    { k: Number.NaN },
    { k: 50 },
    { vyNorm: Infinity },
    { lean: 99 },
    { lean: Number.NaN },
  ];
  for (const phase of ["walk", "crouch", "air", "land"] as const) {
    for (const j of junk) {
      const p = computePose(input({ phase, ...j }));
      assert.ok(finite(p), `finite for ${phase} ${JSON.stringify(j)}`);
    }
  }
}

{
  // Idle gestures: finite everywhere, and exactly the idle pose at both ends.
  const base = input({ phase: "walk", walkAmt: 0 });
  const rest = computePose(base);
  for (const kind of ["look", "stretch"] as const) {
    for (let i = 0; i <= 20; i++) {
      const p = computePose({ ...base, idle: { kind, k: i / 20 } });
      assert.ok(finite(p), `idle ${kind} finite @${i}`);
    }
    for (const k of [0, 1]) {
      const p = computePose({ ...base, idle: { kind, k } });
      assert.ok(
        dist(p.head, rest.head) < 1e-6,
        `idle ${kind} starts/ends at rest`
      );
    }
    assert.ok(finite(computePose({ ...base, idle: { kind, k: Number.NaN } })));
  }
}

{
  // Sitting: finite, and the feet stay on the ground while the hip drops.
  const base = input({ phase: "walk", walkAmt: 0 });
  for (let i = 0; i <= 10; i++) {
    const p = computePose({ ...base, sit: i / 10 });
    assert.ok(finite(p), `sit finite @${i}`);
  }
  const sat = computePose({ ...base, sit: 1 });
  assert.ok(sat.hip.y > computePose(base).hip.y + 10, "hip drops when sitting");
  assert.ok(Math.abs(sat.legNear[2].y) < 1e-6, "feet on the ground");
  assert.ok(finite(computePose({ ...base, sit: Number.NaN })));
}

console.log("pose ok");
