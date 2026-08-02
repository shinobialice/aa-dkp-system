import ensurePrivilieges from "@/actions/ensurePrivilieges";
import { Card } from "@/shared/ui";
import { VkNotificationSettingsForm } from "@/widgets/settings/VkNotificationSettingsForm";

export default async function VkNotificationsSettingsPage() {
  await ensurePrivilieges(["Администратор"]);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <Card className="p-4">
        <VkNotificationSettingsForm />
      </Card>
    </div>
  );
}
