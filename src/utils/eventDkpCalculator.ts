export default function computeRaidDkp(
  baseDkp: number,
  activeBonuses: { mode: "add" | "multiply"; value: number }[],
) {
  let dkp = baseDkp;

  for (const bonus of activeBonuses) {
    if (bonus.mode === "add") dkp += bonus.value;
  }
  for (const bonus of activeBonuses) {
    if (bonus.mode === "multiply") dkp *= bonus.value;
  }

  return dkp;
}
