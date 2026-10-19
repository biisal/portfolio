export type Rect = { left: number; top: number; width: number; height: number };

/**
 * Where a pupil sits, in viewBox units, for a pointer at (px, py).
 * Deflects fully once the pointer is 1.5 element-widths away, so the pupil
 * reaches the edge of the eye and stays there instead of orbiting the centre.
 */
export function pupilOffset(
  px: number,
  py: number,
  rect: Rect,
  max: number
): { x: number; y: number } {
  const dx = px - (rect.left + rect.width / 2);
  const dy = py - (rect.top + rect.height / 2);
  const d = Math.hypot(dx, dy);
  if (!d || !rect.width) return { x: 0, y: 0 };
  const reach = Math.min(1, d / (rect.width * 1.5));
  return { x: (dx / d) * max * reach, y: (dy / d) * max * reach };
}
