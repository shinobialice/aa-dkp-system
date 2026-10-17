import { Download, Radar } from "lucide-react";
import { KILLCOUNT_ROLES } from "@/shared/config/killcountRoles";

// Только для тех, кто заполняет киллкаунт (страница показывает блок по тегам,
// а сам архив отдаёт /api/killcount/scanner с той же проверкой).
export function ScannerGuide() {
  return (
    <details className="group rounded-xl border bg-card p-3 text-sm">
      <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-2 font-semibold">
          <Radar className="size-4 text-muted-foreground" />
          Сканер киллкаунта: как заполнить прайм без скриншотов
        </span>
        <span className="text-muted-foreground group-open:hidden">
          Показать
        </span>
      </summary>

      <div className="mt-3 flex flex-col gap-3">
        <a
          href="/api/killcount/scanner"
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-3 py-2 font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Download className="size-4" /> Скачать сканер (zip)
        </a>

        <div>
          <p className="font-semibold">Один раз</p>
          <ol className="mt-1 list-decimal space-y-1 pl-5">
            <li>
              Установить Python 3 с python.org (галочка «Add python.exe to
              PATH») и Npcap с npcap.com (галочка «WinPcap API-compatible
              Mode»).
            </li>
            <li>
              Распаковать архив, например в <code>C:\CorvusScanner</code>.
            </li>
            <li>
              Запустить <code>START_SCANNER.bat</code>, вписать свой ник в «Мой
              ник».
            </li>
          </ol>
        </div>

        <div>
          <p className="font-semibold">Каждый прайм</p>
          <ol className="mt-1 list-decimal space-y-1 pl-5">
            <li>
              Начало: выйти на выбор персонажа → запустить сканер → зайти в
              локацию сбора → подождать, пока «анкет игроков» перестанет расти →
              «Сканировать рядом». Сканер можно закрыть.
            </li>
            <li>Конец прайма: то же самое ещё раз.</li>
            <li>
              В сканере «Киллкаунт…» → «Посчитать и скопировать JSON для сайта».
            </li>
            <li>
              Здесь: «Добавить вручную» → вставить JSON → проверить таблицу →
              «Сохранить».
            </li>
          </ol>
        </div>

        <p className="text-muted-foreground">
          В киллкаунт попадают пользователи сайта, которые были в обоих сканах,
          на ролях {KILLCOUNT_ROLES.join(", ")}. Роль берётся по трём веткам
          класса из профиля, иначе основная. Кого нет на сайте или кто на другой
          роли — сайт покажет списком перед сохранением.
        </p>
      </div>
    </details>
  );
}
