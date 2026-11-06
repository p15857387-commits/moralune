/** Index of the slide center closest to a focus point in the scroller. */
export function nearestIndex(centers: readonly number[], focus: number): number {
  if (centers.length === 0) return 0;
  let best = 0;
  let bestDistance = Math.abs(centers[0] - focus);
  for (let index = 1; index < centers.length; index += 1) {
    const distance = Math.abs(centers[index] - focus);
    if (distance < bestDistance) {
      best = index;
      bestDistance = distance;
    }
  }
  return best;
}

/**
 * Where a horizontal flick settles. `velocityPxPerMs` is positive when
 * `scrollLeft` is increasing. The coast uses the same friction as the room carousel.
 */
export function coastScroll(scroll: number, velocityPxPerMs: number, min: number, max: number): number {
  let position = scroll;
  let velocity = velocityPxPerMs;
  for (let step = 0; step < 90 && Math.abs(velocity) > 0.015; step += 1) {
    position += velocity * 16;
    velocity *= 0.88;
  }
  const lower = Math.min(min, max);
  const upper = Math.max(min, max);
  return Math.min(upper, Math.max(lower, position));
}

/** Slide that should lock after a flick, using each slide's content-box center. */
export function indexAfterCoast(
  centers: readonly number[],
  scroll: number,
  viewportWidth: number,
  velocityPxPerMs: number,
  maxScroll: number,
): number {
  if (centers.length === 0) return 0;
  const landed = coastScroll(scroll, velocityPxPerMs, 0, Math.max(0, maxScroll));
  return nearestIndex(centers, landed + viewportWidth / 2);
}
