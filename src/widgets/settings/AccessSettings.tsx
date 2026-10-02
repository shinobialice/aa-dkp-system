"use client";

import { useEffect, useState, useTransition } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/ui";
import { createLinkToken } from "@/actions/createLinkToken";
import { getEligibleUsers } from "@/actions/getEligibleUsers";
import { CreateUserForm } from "./CreateUserForm";
import { UserSelect } from "./UserSelect";
import { SettingRow, SettingsCard } from "./settingsUi";

type UserOption = { id: number; username: string };

function CopyableLink({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Не удалось скопировать — выделите ссылку вручную");
    }
  };

  return (
    <div className="flex items-center gap-2 px-4 py-3">
      <span className="min-w-0 flex-1 rounded-md bg-muted px-2.5 py-1.5 font-mono text-xs break-all select-all">
        {link}
      </span>
      <Button
        variant="outline"
        size="sm"
        className="cursor-pointer"
        onClick={handleCopy}
      >
        {copied ? (
          <Check className="size-4 text-green-600" />
        ) : (
          <Copy className="size-4" />
        )}
        {copied ? "Скопировано" : "Копировать"}
      </Button>
    </div>
  );
}

export function AccessSettings() {
  const [users, setUsers] = useState<UserOption[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [link, setLink] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getEligibleUsers()
      .then(setUsers)
      .catch(() => toast.error("Не удалось загрузить список игроков"));
  }, []);

  const handleGenerate = () => {
    if (!selectedUserId) return;
    startTransition(() => {
      createLinkToken(selectedUserId)
        .then(setLink)
        .catch(() => toast.error("Не удалось создать ссылку"));
    });
  };

  return (
    <>
      <SettingsCard
        title="Ссылка для входа"
        hint="одноразовая, действует 24 часа"
      >
        <SettingRow
          title="Игрок"
          hint="Ссылка войдёт в его аккаунт — отправьте её только ему"
        >
          <div className="w-full sm:w-64">
            <UserSelect
              users={users}
              selectedUserId={selectedUserId}
              setSelectedUserId={(id) => {
                setSelectedUserId(id);
                setLink(null);
              }}
            />
          </div>
          <Button
            className="cursor-pointer"
            onClick={handleGenerate}
            disabled={isPending || !selectedUserId}
          >
            {isPending ? "Создание…" : "Создать ссылку"}
          </Button>
        </SettingRow>
        {link && <CopyableLink link={link} />}
      </SettingsCard>

      <SettingsCard title="Новый игрок">
        <CreateUserForm
          onUserCreated={(newUser) => {
            setUsers((prev) => [...prev, newUser]);
            setSelectedUserId(newUser.id);
            setLink(null);
          }}
        />
      </SettingsCard>
    </>
  );
}
