"use client";
import { Card } from "@/shared/ui";
import { SettingsPageContainer } from "@/widgets/settings/SettingsPageContainer";

export default function SettingsPage() {
  return (
    <Card className="max-w-md mx-auto mt-10 p-4 space-y-4">
      <SettingsPageContainer />
    </Card>
  );
}
