type User = {
  joined_at: string | Date;
  class: string;
  class_gear_score: number;
};

export default function canReceiveSalary(
  user: User,
  averageGuildGS: number,
  tags: { tag: string }[]
): boolean {
  if (!user.joined_at || !user.class || !user.class_gear_score) return false;

  const now = new Date();
  const joined = new Date(user.joined_at);
  const day = joined.getDate();
  const monthsPassed =
    now.getFullYear() * 12 +
    now.getMonth() -
    (joined.getFullYear() * 12 + joined.getMonth());

  const probationOver =
    (day <= 20 && monthsPassed >= 1) || (day > 20 && monthsPassed >= 2);

  const roundedGuildGS = Math.floor(averageGuildGS / 500) * 500;
  const isTwoHanded = tags.some((t) => t.tag === "Двурук");

  let requiredGS = roundedGuildGS;
  const className = user.class.toLowerCase();

  if (["тактик", "бард", "танцор"].some((c) => className.includes(c))) {
    requiredGS -= 2000;
  } else if (["хил"].some((c) => className.includes(c))) {
    requiredGS += isTwoHanded ? -500 : 0;
  } else if (["мак", "милик", "лучник"].some((c) => className.includes(c))) {
    requiredGS += isTwoHanded ? -500 : 500;
  }

  return probationOver && user.class_gear_score >= requiredGS;
}
