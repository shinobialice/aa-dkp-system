const PARRY_CURVE: [number, number][] = [
  [200, 0.109],
  [300, 0.121],
  [400, 0.13],
  [500, 0.138],
  [600, 0.145],
  [700, 0.15],
  [800, 0.156],
  [900, 0.161],
  [1000, 0.165],
  [1100, 0.169],
  [1200, 0.173],
  [1300, 0.177],
  [1400, 0.18],
  [1500, 0.183],
  [1600, 0.186],
  [1700, 0.189],
  [1800, 0.192],
  [1900, 0.195],
  [2000, 0.198],
  [2100, 0.201],
  [2200, 0.203],
  [2300, 0.205],
  [2400, 0.207],
  [2500, 0.209],
];

function evalCurve(points: [number, number][], x: number): number {
  if (x <= points[0][0]) {
    const [x0, y0] = points[0];
    const [x1, y1] = points[1];
    const slope = (y1 - y0) / (x1 - x0);
    return y0 + (x - x0) * slope;
  }
  const last = points.length - 1;
  if (x >= points[last][0]) {
    const [x0, y0] = points[last - 1];
    const [x1, y1] = points[last];
    const slope = (y1 - y0) / (x1 - x0);
    return y1 + (x - x1) * slope;
  }
  for (let i = 0; i < last; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    if (x >= x0 && x <= x1) {
      const t = (x - x0) / (x1 - x0);
      return y0 + t * (y1 - y0);
    }
  }
  return points[last][1];
}

export function computeParry(strTotal: number): number {
  return evalCurve(PARRY_CURVE, strTotal);
}

export function computeDodge(dexTotal: number): number {
  return evalCurve(PARRY_CURVE, dexTotal) * 0.5;
}

export function computeBlock(staTotal: number): number {
  return evalCurve(PARRY_CURVE, staTotal) * 1.655;
}

export function computeTacticalReadiness(strPlusDex: number): number {
  return 47.837 * Math.pow(strPlusDex, 0.4386);
}

export function computeSkillTimeReduction(intPlusSpi: number): number {
  return 0.0396 * Math.pow(intPlusSpi, 0.1631);
}

export function computeManaRegen(spiTotal: number): number {
  return spiTotal * 0.297 + 18;
}

export function computeHealthRegen(staTotal: number): number {
  return (staTotal / 100) * 13 + 50;
}

const CRIT_CHANCE_HEROIC_TIERS: [number, number][] = [
  [40, 1],
  [45, 1.1],
  [50, 1.2],
  [55, 1.3],
  [60, 1.35],
  [65, 1.4],
  [70, 1.45],
];

export function getCritChanceRate(heroicLevel: number): number {
  let rate = 0;
  for (const [lvl, r] of CRIT_CHANCE_HEROIC_TIERS) {
    if (heroicLevel >= lvl) rate = r;
  }
  return rate;
}

export function computeCritChance(attrTotal: number, heroicLevel: number): number {
  return attrTotal * getCritChanceRate(heroicLevel) * 0.01;
}
