import "server-only";
import sql from "./db";
import isProbationOver from "@/utils/isProbationOver";

export async function grantSalaryAfterProbation() {
  try {
    const candidates = await sql<{ id: number; joined_at: string }[]>`
      SELECT id, joined_at
      FROM "user"
      WHERE active = true
        AND probation_salary_granted = false
        AND joined_at IS NOT NULL
    `;

    const ids = candidates
      .filter((u) => isProbationOver(u.joined_at))
      .map((u) => u.id);

    if (ids.length === 0) return;

    await sql`
      UPDATE "user"
      SET is_eligible_for_salary = true, probation_salary_granted = true
      WHERE id IN ${sql(ids)}
    `;
  } catch (error) {
    console.error("Ошибка автоначисления зарплаты после испытательного срока:", error);
  }
}
