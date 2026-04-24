export type Coordinates = [number, number];

// 🔥 Smooth easing
export const easeInOut = (t: number): number => {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
};

// 🔥 Smooth marker animation
export const animateMarker = (
  from: [number, number],
  to: [number, number],
  onUpdate: (coords: Coordinates) => void,
) => {
  const distance = Math.sqrt(
    Math.pow(to[0] - from[0], 2) + Math.pow(to[1] - from[1], 2),
  );

  const duration = Math.min(Math.max(distance * 50000, 500), 1500);

  const start = Date.now();

  const animate = () => {
    const now = Date.now();
    const progress = easeInOut(Math.min((now - start) / duration, 1));

    const lng = from[0] + (to[0] - from[0]) * progress;
    const lat = from[1] + (to[1] - from[1]) * progress;

    onUpdate([lng, lat]);

    if (progress < 1) requestAnimationFrame(animate);
  };

  animate();
};

// 🔥 Smooth heading (fix reverse rotation)
export const getSmoothHeading = (prev: number, next: number) => {
  let diff = next - prev;

  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;

  return prev + diff;
};
