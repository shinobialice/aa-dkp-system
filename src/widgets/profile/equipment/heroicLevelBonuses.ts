import { STAT_LABEL } from "./itemsData/statEffects";
import { ENGRAVING_STAT } from "./engravingBonuses";

type StatLine = [label: string, value: number];

const PVP_RESIST_PER_LEVEL = 10;
const CRIT_DAMAGE_RESIST_PER_LEVEL = 20;
const ACCURACY_PER_LEVEL = 0.05;

// Бафф 32855 из данных игры: устойчивость к PvP = уровень × 10, к критическому
// урону = уровень × 20, получаемый урон — по 0,1% за каждые два уровня (так в
// окне героического уровня на 44 и 45 уровне). Точности в данных нет — она
// взята из того же окна игры.
export function computeHeroicLevelBonuses(level: number): StatLine[] {
  const accuracy = level * ACCURACY_PER_LEVEL;
  return [
    [ENGRAVING_STAT.PVP_RESIST, level * PVP_RESIST_PER_LEVEL],
    [ENGRAVING_STAT.CRIT_DAMAGE_RESIST, level * CRIT_DAMAGE_RESIST_PER_LEVEL],
    [STAT_LABEL.DAMAGE_TAKEN, -Math.floor(level / 2) / 10],
    [STAT_LABEL.MELEE_ACCURACY, accuracy],
    [STAT_LABEL.RANGED_ACCURACY, accuracy],
    [STAT_LABEL.SPELL_ACCURACY, accuracy],
  ];
}
