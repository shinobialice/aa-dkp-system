"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Radar } from "lucide-react";
import { toast } from "sonner";
import { confirmScannerLink } from "@/actions/scannerLink";
import { errorMessage } from "@/shared/lib/errorMessage";
import { Button } from "@/shared/ui";
import ArenaPanel from "@/widgets/arena/ArenaPanel";

type Props = {
  code: string;
  username: string;
};

const ACTION_BUTTON =
  "arena-skew h-10 rounded-none px-6 font-display tracking-wide uppercase";

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
      <ArenaPanel title="Сканер подключён" className="max-w-xl">
        <p className="text-sm">
          Сканер сам заберёт ключ в течение минуты. Эту вкладку можно закрыть.
        </p>
        <p className="text-sm text-muted-foreground">
          Отключить сканер можно на странице «Сканер» в разделе «Киллкаунт».
        </p>
      </ArenaPanel>
    );
  }

  return (
    <ArenaPanel title="Подключить сканер?" className="max-w-xl">
      <p className="text-sm text-muted-foreground">
        Сканер на этом компьютере сможет отправлять на сайт записи рейдов и
        киллкаунт от вашего имени. Сверьте код с тем, что показывает сканер.
      </p>
      <div className="flex items-center gap-3 border px-3 py-2.5">
        <Radar className="size-5 shrink-0 text-green-600 dark:text-green-400" />
        <span className="font-semibold">{username}</span>
        <span className="ml-auto font-display text-sm tracking-widest text-muted-foreground">
          {fingerprint(code)}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          className={ACTION_BUTTON}
          disabled={isSubmitting}
          onClick={handleConfirm}
        >
          {isSubmitting && <Loader2 className="animate-spin" />}
          Подключить
        </Button>
        <Button variant="outline" className={ACTION_BUTTON} asChild>
          <Link href="/kill-counter/scanner">Отмена</Link>
        </Button>
      </div>
    </ArenaPanel>
  );
}

function fingerprint(code: string) {
  return `${code.slice(0, 4)}-${code.slice(4, 8)}`.toUpperCase();
}
