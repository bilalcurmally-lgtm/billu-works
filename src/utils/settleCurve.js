/**
 * Map raw cover progress (0 → 1) to how far an outgoing panel or card has "settled back".
 * Nothing happens for the first `delay` of the cover, then it eases in, so the blur
 * lands as the new panel takes over instead of the moment it peeks in.
 */
export function settleCurve(progress, delay = 0.3) {
  const t = Math.min(1, Math.max(0, (progress - delay) / (1 - delay)))
  return t * t
}
