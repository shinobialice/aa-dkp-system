import { getSalaryEligibilitySettings } from "@/actions/salaryEligibilitySettings";
import GuildInfoContent from "@/widgets/info/GuildInfoContent";

export default async function GuildInfoPage() {
  const settings = await getSalaryEligibilitySettings();

  return (
    <div className="flex min-h-screen flex-col bg-background text-onBackground p-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">
        Основная информация
      </h1>
      <GuildInfoContent settings={settings} />
    </div>
  );
}
