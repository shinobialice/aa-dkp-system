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

export function LinkGeneratorClient() {
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
    <CardContent>
      <h2 className="text-xl font-bold mb-4">Сгенерировать ссылку для входа</h2>
      <div className="space-y-2">
        <Select onValueChange={(value) => setSelectedUserId(Number(value))}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Выберите пользователя" />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.id} value={String(user.id)}>
                {user.username} (id: {user.id})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
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
  );
}
