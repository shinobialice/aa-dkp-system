import Link from "next/link";
import { Download } from "lucide-react";
import { KILLCOUNT_ROLES } from "@/shared/config/killcountRoles";

const INSTALL_STEPS = [
  "Запустить скачанный файл. Если Windows ругается — «Подробнее» → «Выполнить в любом случае».",
  "Галочку «Установить Npcap» не снимать, дальше везде «Далее» / «Install».",
  "Открыть ярлык «Corvus PvP Scanner» на рабочем столе и вписать свой ник.",
];

const PRIME_STEPS = [
  "Выйти на выбор персонажа, открыть сканер, зайти в игру, нажать «Сканировать рядом».",
  "В конце прайма — то же самое.",
  "В сканере: «Киллкаунт…» → «Посчитать и скопировать JSON для сайта».",
  "На сайте: «Добавить вручную» → вставить → «Сохранить».",
];

export default function ScannerPage() {
  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <div>
        <a
          href="/api/killcount/scanner/installer"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <Download className="size-4" /> Скачать для Windows
        </a>
      </div>

      <section className="rounded-xl border bg-card p-4">
        <h2 className="font-semibold">Установка</h2>
        <Steps items={INSTALL_STEPS} />
      </section>

      <section className="rounded-xl border bg-card p-4">
        <h2 className="font-semibold">Каждый прайм</h2>
        <Steps items={PRIME_STEPS} />
        <p className="mt-3 text-muted-foreground">
          Попадут игроки гильдии с сайта на ролях {KILLCOUNT_ROLES.join(", ")}.
          Сканер пустой — перезайдите через выбор персонажа.
        </p>
      </section>

      <p className="text-muted-foreground">
        Сам киллкаунт — на странице{" "}
        <Link href="/kill-counter/current" className="underline">
          «Сегодня»
        </Link>
        .
      </p>
    </div>
  );
}

function Steps({ items }: { items: string[] }) {
  return (
    <ol className="mt-2 list-decimal space-y-1.5 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ol>
  );
}
