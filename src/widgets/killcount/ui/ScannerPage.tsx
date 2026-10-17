import Link from "next/link";
import { Download, FolderArchive, ShieldCheck } from "lucide-react";
import { KILLCOUNT_ROLES } from "@/shared/config/killcountRoles";

const INSTALL_STEPS = [
  "Скачать установщик и запустить CorvusScannerSetup.exe.",
  "Если Windows пишет «Windows защитил ваш компьютер» — «Подробнее» → «Выполнить в любом случае» (у программы нет платной цифровой подписи).",
  "В установщике оставить галочки «Создать ярлык на рабочем столе» и, если предложит, «Установить Npcap» → «Установить». Python ставить не нужно — он уже внутри.",
  "Если отмечен Npcap, после установки сканера откроется установщик Npcap: «I Agree» → «Install» (галочка «WinPcap API-compatible Mode» уже стоит) → «Finish». Без Npcap сканер тоже работает — через встроенный захват Windows, но с Npcap надёжнее.",
  "Запустить ярлык «Corvus PvP Scanner». Windows спросит «Разрешить этому приложению вносить изменения?» — «Да»: права администратора нужны, чтобы читать сетевые пакеты игры.",
  "Один раз вписать свой ник в поле «Мой ник».",
];

const PRIME_STEPS = [
  "Начало прайма: выйти на выбор персонажа → запустить сканер → зайти в локацию сбора → подождать 5–10 секунд, пока «анкет игроков» в строке статуса перестанет расти → «Сканировать рядом». Сканер можно закрыть.",
  "Конец прайма: снова через выбор персонажа → войти в мир → подождать → «Сканировать рядом». Вход в мир обязателен: иначе у сканера останутся анкеты из начала, и такие игроки не посчитаются.",
  "В сканере: «Киллкаунт…» → «Посчитать и скопировать JSON для сайта». Снимки начала и конца подставятся сами.",
  "На сайте: Киллкаунт → «Сегодня» → «Добавить вручную» → вставить JSON → проверить таблицу и список «Не попали в киллкаунт» → «Сохранить».",
];

const TROUBLES = [
  [
    "«анкет игроков: 0»",
    "Сканер запущен после входа в мир. Выйти на выбор персонажа и зайти снова — анкеты придут заново.",
  ],
  [
    "«Нет игрового трафика»",
    "Игра не запущена или трафик идёт через VPN — сканер слушает порт игры 1239.",
  ],
  [
    "«Нет свежей анкеты в конце»",
    "Перед сканом конца прайма не было входа в мир. Перезайти и отсканировать ещё раз.",
  ],
  [
    "Антивирус ругается",
    "Программа собрана PyInstaller и не подписана — такое бывает. Она только читает пакеты: ничего не отправляет, не читает память игры и ничего в ней не меняет.",
  ],
];

function Steps({ items }: { items: string[] }) {
  return (
    <ol className="mt-2 list-decimal space-y-1.5 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ol>
  );
}

export function ScannerPage() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="flex flex-col gap-3 rounded-xl border bg-card p-4 lg:col-span-2">
        <div className="flex flex-wrap gap-2">
          <a
            href="/api/killcount/scanner/installer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Download className="size-4" /> Скачать установщик для Windows
          </a>
          <a
            href="/api/killcount/scanner"
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 font-medium hover:bg-accent"
          >
            <FolderArchive className="size-4" /> Архив со скриптами (нужен
            Python)
          </a>
        </div>
        <p className="flex items-start gap-2 text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-4 shrink-0" />
          Сканер только читает пакеты, которые сервер игры уже присылает вашему
          клиенту: ничего не отправляет, не читает память игры и ничего в ней не
          меняет.
        </p>
      </section>

      <section className="rounded-xl border bg-card p-4">
        <h2 className="font-semibold">Установка — один раз</h2>
        <Steps items={INSTALL_STEPS} />
      </section>

      <section className="rounded-xl border bg-card p-4">
        <h2 className="font-semibold">Каждый прайм</h2>
        <Steps items={PRIME_STEPS} />
      </section>

      <section className="rounded-xl border bg-card p-4">
        <h2 className="font-semibold">Кто попадает в киллкаунт</h2>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>
            Игроки вашей гильдии, которые были и в начальном, и в конечном
            скане.
          </li>
          <li>
            Только пользователи сайта на ролях {KILLCOUNT_ROLES.join(", ")}.
            Роль берётся по трём веткам класса: слот архетипа в профиле с теми
            же ветками, иначе основная роль.
          </li>
          <li>
            Кого нет на сайте, кто на другой роли или без роли — сайт покажет
            списком перед сохранением. Вернуть человека можно кнопкой «Добавить»
            в таблице.
          </li>
          <li>Смена ника посреди прайма подсчёт не ломает.</li>
        </ul>
      </section>

      <section className="rounded-xl border bg-card p-4">
        <h2 className="font-semibold">Если что-то не так</h2>
        <dl className="mt-2 space-y-2">
          {TROUBLES.map(([title, text]) => (
            <div key={title}>
              <dt className="font-medium">{title}</dt>
              <dd className="text-muted-foreground">{text}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-muted-foreground">
          Сам киллкаунт — на странице{" "}
          <Link href="/kill-counter/current" className="underline">
            «Сегодня»
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
