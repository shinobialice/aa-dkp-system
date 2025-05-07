"use client";
import { Card } from "@/components/ui/card";
import { LinkGeneratorClient } from "@/src/components/settings/LinkGenerator";

export default function SettingsPage() {
  return (
    <Card className="max-w-md mx-auto mt-10 p-4 space-y-4">
      <LinkGeneratorClient />
    </Card>
  );
}
