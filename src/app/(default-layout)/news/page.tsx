import { getSalaryEligibilitySettings } from "@/actions/salaryEligibilitySettings";
import { getBosses } from "@/actions/getBosses";
import { getGuildStatus } from "@/actions/guildStatusSettings";
import { getAverageGuildGS } from "@/actions/getAverageGuildGS";
import GuildInfoContent from "@/widgets/info/GuildInfoContent";

export default async function GuildInfoPage() {
  const [settings, bosses, { mode }, averageGuildGS] = await Promise.all([
    getSalaryEligibilitySettings(),
    getBosses(),
    getGuildStatus(),
    getAverageGuildGS(),
  ]);

  return (
    <GuildInfoContent
      settings={settings}
      bosses={bosses}
      guildMode={mode}
      averageGuildGS={averageGuildGS}
    />
  );
}
