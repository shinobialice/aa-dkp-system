"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button, Input } from "@/shared/ui";
import { createUser } from "@/actions/createUser";
import type { Database } from "@/types/supabase";
import { SettingRow } from "./settingsUi";

type User = Database["public"]["Tables"]["user"]["Row"];

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
      setError("Введите ник");
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
                className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
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
    <SettingRow
      title="Ник на сайте"
      hint={
        error ? (
          <span className="text-red-600 dark:text-red-400">{error}</span>
        ) : (
          "Должен совпадать с ником в игре: по нему ищутся киллкаунт и казна. После создания сразу выбран для ссылки выше"
        )
      }
      htmlFor="new-user-name"
    >
      <form
        className="flex w-full flex-wrap gap-2 sm:w-auto"
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateUser();
        }}
      >
        <Input
          id="new-user-name"
          className="min-w-0 flex-1 sm:w-56"
          placeholder="Ник"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <Button type="submit" className="cursor-pointer" disabled={isPending}>
          {isPending ? "Создание…" : "Создать"}
        </Button>
      </form>
    </SettingRow>
  );
}
