"use client";

import { useState, useTransition } from "react";
import { Input } from "@/shared/ui";
import { Button } from "@/shared/ui";
import { createUser } from "@/actions/createUser";
import type { Database } from "@/types/supabase";
import Link from "next/link";
type User = Database["public"]["Tables"]["user"]["Row"];
import { toast } from "sonner";

export function CreateUserForm({
  onUserCreated,
}: {
  onUserCreated: (user: User) => void;
}) {
  const [newUsername, setNewUsername] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleCreateUser = () => {
    setError(null);
    if (!newUsername.trim()) {
      setError("Введите имя");
      return;
    }
    startTransition(() => {
      createUser(newUsername)
        .then((newUser) => {
          onUserCreated(newUser);
          setNewUsername("");

          toast.success("Пользователь создан", {
            description: (
              <Link
                href={`/profile/${newUser.id}`}
                className="underline underline-offset-2 text-blue-600 hover:text-blue-800"
              >
                Перейти к профилю
              </Link>
            ),
            duration: 5000,
          });
        })
        .catch((err) => setError(err.message));
    });
  };

  return (
    <div className="mt-6 space-y-2">
      <h3 className="font-semibold">Или создать нового пользователя</h3>
      <Input
        className="w-full"
        placeholder="Имя нового пользователя"
        value={newUsername}
        onChange={(e) => setNewUsername(e.target.value)}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button
        className="cursor-pointer"
        onClick={handleCreateUser}
        disabled={isPending}
      >
        {isPending ? "Создание..." : "Создать пользователя"}
      </Button>
    </div>
  );
}
