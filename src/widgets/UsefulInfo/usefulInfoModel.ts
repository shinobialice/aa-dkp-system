import type { CSSProperties } from "react";

export type LensPosition = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const LENS_SIZE = 200;
const LENS_ZOOM = 2.5;

export function lensStyle(src: string, lens: LensPosition): CSSProperties {
  const half = LENS_SIZE / 2;
  return {
    width: LENS_SIZE,
    height: LENS_SIZE,
    left: lens.x - half,
    top: lens.y - half,
    backgroundImage: `url(${src})`,
    backgroundSize: `${lens.width * LENS_ZOOM}px ${lens.height * LENS_ZOOM}px`,
    backgroundPosition: `${half - lens.x * LENS_ZOOM}px ${half - lens.y * LENS_ZOOM}px`,
  };
}
