"use client";

import { useEffect, useState, useTransition } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createLinkToken } from "@/src/actions/createLinkToken";
import { getEligibleUsers } from "@/src/actions/getEligibleUsers";
import { CreateUserForm } from "./CreateUserForm";
import { UserSelect } from "./UserSelect";

type UserOption = {
  id: number;
  username: string;
};

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
    <div className="space-y-6">
      <CardContent className="border rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">
          Сгенерировать ссылку для входа
        </h2>
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
            <p className="font-semibold mt-4">Ссылка для отправки:</p>
            <CopyableLink link={link} />
          </>
        )}
      </CardContent>

      <CardContent className="border rounded-lg p-4">
        <CreateUserForm
          onUserCreated={(newUser) => {
            setUsers((prev) => [...prev, newUser]);
            setSelectedUserId(newUser.id);
          }}
        />
      </CardContent>
    </div>
  );
}
