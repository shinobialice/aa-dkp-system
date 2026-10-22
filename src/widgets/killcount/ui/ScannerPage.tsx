import Link from "next/link";
import { Download } from "lucide-react";
import type { ScannerKey } from "@/actions/scannerLink";
import { KILLCOUNT_ROLES } from "@/shared/config/killcountRoles";
import ConnectedScanners from "./ConnectedScanners";

type Props = {
  keys: ScannerKey[];
};

const INSTALL_STEPS = [
  "Запустить скачанный файл. Если Windows ругается — «Подробнее» → «Выполнить в любом случае».",
  "Галочку «Установить Npcap» не снимать, дальше везде «Далее» / «Install».",
  "Открыть ярлык «Corvus PvP Scanner» на рабочем столе и вписать свой ник.",
  "Нажать «Подключить к сайту», подтвердить в открывшемся браузере. Это один раз.",
];

const RAID_STEPS = [
  "Запустить сканер до входа в игру и держать открытым весь рейд.",
  "Выбрать «Прайм» или «АГЛ» и нажать «Начать рейд» — это начало киллкаунта.",
  "Кто подошёл позже, попадёт сам: сканер возьмёт его числа при первом появлении рядом.",
  "В конце, когда все собрались вместе, нажать «Закончить рейд». Посещаемость и киллкаунт уйдут на сайт сами.",
  "На сайте: «Киллкаунт → Новая страница» — проверить и опубликовать; секретарь берёт запись в «Новом посещении» → «Из сканера».",
];

export default function ScannerPage({ keys }: Props) {
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
        <h2 className="font-semibold">Каждый рейд</h2>
        <Steps items={RAID_STEPS} />
        <p className="mt-3 text-muted-foreground">
          В киллкаунт попадут игроки гильдии с сайта на ролях{" "}
          {KILLCOUNT_ROLES.join(", ")}. Свои числа сканер не обновляет: тот, кто
          сканирует, в киллкаунт не попадает.
        </p>
      </section>

      <section className="rounded-xl border bg-card p-4">
        <h2 className="font-semibold">Подключённые сканеры</h2>
        <p className="mt-1 mb-2 text-muted-foreground">
          Отключённый сканер перестаёт отправлять данные на сайт. Подключить
          заново можно в программе.
        </p>
        <ConnectedScanners keys={keys} />
      </section>

      <p className="text-muted-foreground">
        Старый способ тоже работает: «Киллкаунт…» в сканере, затем «Добавить
        вручную» на странице{" "}
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
