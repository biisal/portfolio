/**
 * Scroll stick figure: the skeleton.
 *
 * Pure maths, no DOM. Everything is in the figure's local space: the origin is
 * the point between its feet on the ground, +x is the way it faces and +y is
 * down (SVG convention), so the head is at a negative y.
 *
 * Legs use two-bone IK so the feet land exactly where the gait wants them and
 * the knees bend the right way. Arms are simple forward kinematics. Poses are
 * built from small "rigs" (a handful of numbers) and blended joint by joint,
 * so moving between states never pops.
 */

export interface Pt {
  x: number;
  y: number;
}

/** Root joint, middle joint (knee / elbow), end (foot / hand). */
export type Limb = [Pt, Pt, Pt];

export interface Pose {
  head: Pt;
  neck: Pt;
  shoulder: Pt;
  hip: Pt;
  legNear: Limb;
  legFar: Limb;
  armNear: Limb;
  armFar: Limb;
}

export const BODY = {
  thigh: 13,
  shin: 13,
  torso: 18,
  headR: 5.5,
  upper: 10,
  fore: 10,
  /** Hip height when standing: a touch under full leg length so the knees stay soft. */
  standHip: 25,
} as const;

const STRIDE = 13;
const LIFT = 7;
const ARM_SWING = 0.95;

export type PosePhase = "walk" | "crouch" | "air" | "land";

export interface PoseInput {
  phase: PosePhase;
  /** Gait phase in radians. */
  walkPhase: number;
  /** 0 = standing, 1 = walking. */
  walkAmt: number;
  /** Progress through the current crouch / air / land phase, 0..1. */
  k: number;
  /** -1 rising, +1 falling (airborne only). */
  vyNorm: number;
  /** Falling towards the floor rather than jumping onto a line. */
  fall: boolean;
  /** Extra forward lean in radians, from scroll speed. */
  lean: number;
  /** A one-off idle gesture, played while standing still. k runs 0..1. */
  idle?: { kind: "look" | "stretch"; k: number };
  /** 0 = on its feet, 1 = sitting on the line (bored). Only applies while grounded. */
  sit?: number;
}

/* ---------- helpers ---------- */

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

function clamp01(v: number): number {
  return clamp(v, 0, 1);
}

function fin(v: number, fallback = 0): number {
  return Number.isFinite(v) ? v : fallback;
}

function easeOut(t: number): number {
  const u = 1 - clamp01(t);
  return 1 - u * u;
}

function lp(a: Pt, b: Pt, t: number): Pt {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

function lLimb(a: Limb, b: Limb, t: number): Limb {
  return [lp(a[0], b[0], t), lp(a[1], b[1], t), lp(a[2], b[2], t)];
}

/** Interpolate every joint. t is clamped to 0..1, so the ends are exact. */
export function blendPose(a: Pose, b: Pose, t: number): Pose {
  const k = clamp01(fin(t));
  return {
    head: lp(a.head, b.head, k),
    neck: lp(a.neck, b.neck, k),
    shoulder: lp(a.shoulder, b.shoulder, k),
    hip: lp(a.hip, b.hip, k),
    legNear: lLimb(a.legNear, b.legNear, k),
    legFar: lLimb(a.legFar, b.legFar, k),
    armNear: lLimb(a.armNear, b.armNear, k),
    armFar: lLimb(a.armFar, b.armFar, k),
  };
}

/* ---------- limbs ---------- */

/**
 * Two-bone IK for a leg. The foot goes to `target`, or as close as the leg can
 * reach in that direction; the knee always bends forward (+x). Always returns
 * finite points and bones of exactly thigh and shin length.
 */
export function solveLeg(hip: Pt, target: Pt): Limb {
  const l1 = BODY.thigh;
  const l2 = BODY.shin;

  let dx = target.x - hip.x;
  let dy = target.y - hip.y;
  let d = Math.hypot(dx, dy);
  if (!(d > 1e-6)) {
    dx = 0;
    dy = 1;
    d = 1;
  }
  const ux = dx / d;
  const uy = dy / d;

  const reach = clamp(d, Math.abs(l1 - l2) + 1e-3, l1 + l2 - 1e-3);
  const a = (l1 * l1 - l2 * l2 + reach * reach) / (2 * reach);
  const h = Math.sqrt(Math.max(0, l1 * l1 - a * a));

  const knee = { x: hip.x + ux * a + uy * h, y: hip.y + uy * a - ux * h };
  const foot = { x: hip.x + ux * reach, y: hip.y + uy * reach };
  return [hip, knee, foot];
}

/**
 * Forward kinematics for an arm. Angles are measured from straight down, with
 * positive swinging forward: 0 hangs, PI/2 points ahead, PI is straight up.
 * `bend` is added for the forearm.
 */
export function solveArm(shoulder: Pt, angle: number, bend: number): Limb {
  const elbow = {
    x: shoulder.x + Math.sin(angle) * BODY.upper,
    y: shoulder.y + Math.cos(angle) * BODY.upper,
  };
  const a2 = angle + bend;
  const hand = {
    x: elbow.x + Math.sin(a2) * BODY.fore,
    y: elbow.y + Math.cos(a2) * BODY.fore,
  };
  return [shoulder, elbow, hand];
}

/* ---------- rigs ---------- */

/** A handful of numbers that describe a pose. */
interface Rig {
  /** How far the hip sits below standing height. */
  hipDrop: number;
  /** Torso lean forward, radians. */
  lean: number;
  headTilt: number;
  /** Where the feet go, in local space (ground is y = 0). */
  footNear: Pt;
  footFar: Pt;
  /** [angle, bend] for each arm. */
  armNear: [number, number];
  armFar: [number, number];
}

function build(r: Rig): Pose {
  const hip = { x: 0, y: -(BODY.standHip - r.hipDrop) };
  const neck = {
    x: hip.x + Math.sin(r.lean) * BODY.torso,
    y: hip.y - Math.cos(r.lean) * BODY.torso,
  };
  const shoulder = lp(hip, neck, 0.88);
  const ha = r.lean + r.headTilt;
  const head = {
    x: neck.x + Math.sin(ha) * BODY.headR,
    y: neck.y - Math.cos(ha) * BODY.headR,
  };

  return {
    head,
    neck,
    shoulder,
    hip,
    legNear: solveLeg(hip, r.footNear),
    legFar: solveLeg(hip, r.footFar),
    armNear: solveArm(shoulder, r.armNear[0], r.armNear[1]),
    armFar: solveArm(shoulder, r.armFar[0], r.armFar[1]),
  };
}

const IDLE: Rig = {
  hipDrop: 0,
  lean: 0.03,
  headTilt: 0,
  footNear: { x: 6, y: 0 },
  footFar: { x: -6, y: 0 },
  armNear: [0.3, 0.25],
  armFar: [-0.3, 0.25],
};

const CROUCH: Rig = {
  hipDrop: 9,
  lean: 0.4,
  headTilt: -0.1,
  footNear: { x: 6, y: 0 },
  footFar: { x: -6, y: 0 },
  armNear: [-1.2, 0.4],
  armFar: [-1.7, 0.3],
};

/** Going up: reaching overhead, knees tucked. */
const RISE: Rig = {
  hipDrop: 1,
  lean: 0.12,
  headTilt: -0.1,
  footNear: { x: 7, y: -12 },
  footFar: { x: -5, y: -6 },
  armNear: [2.8, 0.15],
  armFar: [-2.6, -0.15],
};

/** Coming down: legs reaching for the ground, arms out for balance. */
const DROP: Rig = {
  hipDrop: 0,
  lean: 0.05,
  headTilt: 0,
  footNear: { x: 3, y: -1 },
  footFar: { x: -3, y: -3 },
  armNear: [1.9, 0.15],
  armFar: [-1.9, -0.15],
};

const LAND: Rig = {
  hipDrop: 8,
  lean: 0.32,
  headTilt: 0.05,
  footNear: { x: 7, y: 0 },
  footFar: { x: -5, y: 0 },
  armNear: [0.8, 0.5],
  armFar: [0.3, 0.5],
};

/**
 * Chilling: leaning back on one propped-up arm, knees up, feet out in front,
 * the other hand resting on a knee, head up.
 */
const SIT: Rig = {
  hipDrop: 22,
  lean: -0.75,
  headTilt: 0.65,
  footNear: { x: 19, y: 0 },
  footFar: { x: 15, y: 0 },
  armNear: [-0.9, 0.4],
  armFar: [1.45, 0.1],
};

const STRETCH: Rig = {
  hipDrop: 0,
  lean: -0.12,
  headTilt: -0.3,
  footNear: { x: 4, y: 0 },
  footFar: { x: -4, y: 0 },
  armNear: [2.9, 0.1],
  armFar: [2.7, 0.1],
};

/** Standing, head swinging left then right. */
function lookRig(k: number): Rig {
  return { ...IDLE, headTilt: 0.7 * Math.sin(k * Math.PI * 2) };
}

function walkRig(phase: number, lean: number): Rig {
  const sA = Math.sin(phase);
  const cA = Math.cos(phase);
  // The far leg is half a cycle behind the near one.
  const foot = (s: number, c: number): Pt => ({
    x: s * STRIDE,
    y: -Math.max(0, c) * LIFT,
  });
  return {
    // Highest when the legs pass each other, lowest at full stride.
    hipDrop: 2 * Math.abs(sA),
    lean: 0.1 + lean,
    headTilt: 0,
    footNear: foot(sA, cA),
    footFar: foot(-sA, -cA),
    // Arms swing against the legs.
    armNear: [-sA * ARM_SWING, 0.4],
    armFar: [sA * ARM_SWING, 0.4],
  };
}

function fallRig(k: number): Rig {
  return {
    hipDrop: 0,
    lean: 0,
    headTilt: 0,
    footNear: { x: 4, y: -5 + Math.sin(k * 14) * 2 },
    footFar: { x: -4, y: -8 + Math.cos(k * 14) * 2 },
    armNear: [2.4 + 0.35 * Math.sin(k * 18), 0.3],
    armFar: [-2.2 + 0.35 * Math.cos(k * 18 + 1), -0.3],
  };
}

/* ---------- the pose for a frame ---------- */

export function computePose(input: PoseInput): Pose {
  const walkPhase = fin(input.walkPhase);
  const walkAmt = clamp01(fin(input.walkAmt));
  const k = clamp01(fin(input.k));
  const vyNorm = clamp(fin(input.vyNorm), -1, 1);
  const lean = clamp(fin(input.lean), 0, 0.5);

  const ground = blendPose(
    build(IDLE),
    build(walkRig(walkPhase, lean)),
    walkAmt
  );

  switch (input.phase) {
    case "crouch":
      return blendPose(ground, build(CROUCH), easeOut(k));

    case "air": {
      const air = input.fall
        ? build(fallRig(k))
        : blendPose(build(RISE), build(DROP), (vyNorm + 1) / 2);
      // Ease in from whatever it was doing, and out towards the landing squat.
      const from = input.fall ? ground : build(CROUCH);
      const launched = blendPose(from, air, easeOut(k / 0.2));
      return blendPose(launched, build(LAND), clamp01((k - 0.8) / 0.2));
    }

    case "land":
      return blendPose(build(LAND), ground, easeOut(k));

    default: {
      const sit = easeOut(fin(input.sit ?? 0));
      let out = ground;
      if (input.idle) {
        const gk = clamp01(fin(input.idle.k));
        const w = Math.sin(gk * Math.PI) * (1 - walkAmt) * (1 - sit);
        const rig = input.idle.kind === "stretch" ? STRETCH : lookRig(gk);
        out = blendPose(ground, build(rig), w);
      }
      return sit > 0 ? blendPose(out, build(SIT), sit) : out;
    }
  }
}
