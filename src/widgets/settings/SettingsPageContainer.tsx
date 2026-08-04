"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Copy,
  Check,
  Users as UsersIcon,
  Swords,
  HandCoins,
  Bell,
  PartyPopper,
} from "lucide-react";
import { Button } from "@/shared/ui";
import { Card } from "@/shared/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";
import { cn } from "@/shared/lib/tw-merge";
import { createLinkToken } from "@/actions/createLinkToken";
import { getEligibleUsers } from "@/actions/getEligibleUsers";
import { CreateUserForm } from "./CreateUserForm";
import { UserSelect } from "./UserSelect";
import { UserSelfEditSettingsForm } from "./UserSelfEditSettingsForm";
import { SalaryEligibilitySettingsForm } from "./SalaryEligibilitySettingsForm";
import { BossPointsSettingsForm } from "./BossPointsSettingsForm";
import { AttendanceBonusSettingsForm } from "./AttendanceBonusSettingsForm";
import { MaintenanceWindowsForm } from "./MaintenanceWindowsForm";
import { VkNotificationSettingsForm } from "./VkNotificationSettingsForm";
import { EventSettingsForm } from "./EventSettingsForm";

type UserOption = {
  id: number;
  username: string;
};

const sections = [
  { id: "users", label: "Пользователи", icon: UsersIcon },
  { id: "bosses", label: "Боссы и респаун", icon: Swords },
  { id: "salary", label: "Зарплата", icon: HandCoins },
  { id: "vk", label: "Уведомления ВК", icon: Bell },
  { id: "event", label: "Ивент", icon: PartyPopper },
] as const;

type SectionId = (typeof sections)[number]["id"];

function CopyableLink({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 mt-4 bg-muted p-2 rounded">
      <span className="break-all text-sm">{link}</span>
      <Button size="icon" variant="ghost" onClick={handleCopy}>
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}

export function SettingsPageContainer() {
  const [active, setActive] = useState<SectionId>("users");
  const [users, setUsers] = useState<UserOption[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [link, setLink] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getEligibleUsers().then(setUsers);
  }, []);

  const handleGenerate = () => {
    if (!selectedUserId) return;
    startTransition(() => {
      createLinkToken(selectedUserId).then(setLink);
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Настройки</h1>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        <nav className="flex md:flex-col gap-1 w-full md:w-56 shrink-0 overflow-x-auto md:overflow-visible md:sticky md:top-6">
          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(s.id)}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap cursor-pointer transition-colors",
                active === s.id
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              )}
            >
              <s.icon className="size-4 shrink-0" />
              {s.label}
            </button>
          ))}
        </nav>

        <div className="flex-1 w-full min-w-0 space-y-6">
          {active === "users" && (
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">Пользователи</h2>

              <Card className="p-4 space-y-6 max-w-xl">
                <div>
                  <h3 className="text-lg font-bold mb-4">
                    Сгенерировать ссылку для входа
                  </h3>
                  <div className="space-y-2">
                    <UserSelect
                      users={users}
                      selectedUserId={selectedUserId}
                      setSelectedUserId={setSelectedUserId}
                    />

                    <Button
                      className="cursor-pointer"
                      onClick={handleGenerate}
                      disabled={isPending || !selectedUserId}
                    >
                      {isPending ? "Генерация..." : "Создать ссылку"}
                    </Button>
                  </div>

                  {link && (
                    <>
                      <p className="font-semibold mt-4">
                        Ссылка для отправки:
                      </p>
                      <CopyableLink link={link} />
                    </>
                  )}
                </div>

                <div className="border-t pt-6">
                  <CreateUserForm
                    onUserCreated={(newUser) => {
                      setUsers((prev) => [...prev, newUser]);
                      setSelectedUserId(newUser.id);
                    }}
                  />
                </div>
              </Card>

              <Card className="p-4 max-w-xl">
                <UserSelfEditSettingsForm />
              </Card>
            </section>
          )}

          {active === "bosses" && (
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">Боссы и респаун</h2>

              <Card className="p-4">
                <BossPointsSettingsForm />
              </Card>

              <Card className="p-4">
                <MaintenanceWindowsForm />
              </Card>
            </section>
          )}

          {active === "salary" && (
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">Зарплата</h2>

              <Card className="p-4">
                <SalaryEligibilitySettingsForm />
              </Card>

              <Card className="p-4">
                <AttendanceBonusSettingsForm />
              </Card>
            </section>
          )}

          {active === "vk" && (
            <section className="space-y-6">
              <Card className="p-4">
                <VkNotificationSettingsForm />
              </Card>
            </section>
          )}

          {active === "event" && (
            <section className="space-y-6">
              <Card className="p-4 max-w-xl">
                <EventSettingsForm />
              </Card>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
