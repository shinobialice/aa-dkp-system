"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Radar } from "lucide-react";
import { toast } from "sonner";
import { confirmScannerLink } from "@/actions/scannerLink";
import { errorMessage } from "@/shared/lib/errorMessage";
import { Button } from "@/shared/ui";

type Props = {
  code: string;
  username: string;
};

export default function ConnectScanner({ code, username }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await confirmScannerLink(code);
      setIsDone(true);
    } catch (error) {
      toast.error(errorMessage(error, "Не удалось подключить сканер"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isDone) {
    return (
      <section className="flex max-w-xl flex-col gap-2 rounded-xl border bg-card p-4">
        <h1 className="text-lg font-bold">Сканер подключён</h1>
        <p>
          Сканер сам заберёт ключ в течение минуты. Эту вкладку можно закрыть.
        </p>
        <p className="text-muted-foreground">
          Отключить сканер можно на странице «Сканер» в разделе «Киллкаунт».
        </p>
      </section>
    );
  }

  return (
    <section className="flex max-w-xl flex-col gap-3 rounded-xl border bg-card p-4">
      <h1 className="text-lg font-bold">Подключить сканер?</h1>
      <p className="text-muted-foreground">
        Сканер на этом компьютере сможет отправлять на сайт записи рейдов и
        киллкаунт от вашего имени. Сверьте код с тем, что показывает сканер.
      </p>
      <div className="flex items-center gap-3 rounded-lg border bg-muted/40 px-3 py-2.5">
        <Radar className="size-5 shrink-0 text-muted-foreground" />
        <span className="font-semibold">{username}</span>
        <span className="ml-auto font-mono text-sm tracking-widest text-muted-foreground">
          {fingerprint(code)}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          className="cursor-pointer"
          disabled={isSubmitting}
          onClick={handleConfirm}
        >
          {isSubmitting && <Loader2 className="animate-spin" />}
          Подключить
        </Button>
        <Button variant="outline" asChild>
          <Link href="/kill-counter/scanner">Отмена</Link>
        </Button>
      </div>
    </section>
  );
}

function fingerprint(code: string) {
  return `${code.slice(0, 4)}-${code.slice(4, 8)}`.toUpperCase();
}
