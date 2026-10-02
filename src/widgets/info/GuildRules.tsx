"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeDollarSign,
  ChevronDown,
  Gift,
  HandCoins,
  ListTree,
} from "lucide-react";
import { cn } from "@/shared/lib/tw-merge";
import { calculatePenaltyPercent } from "@/utils/calculateSalaryWeight";

const RELATED = [
  { title: "Покупка лута", url: "/loot/buy", icon: BadgeDollarSign },
  { title: "Раздача лута", url: "/loot/giveaway", icon: Gift },
  { title: "Финансы", url: "/loot/finance", icon: HandCoins },
];

const FACTS = [
  {
    value: "70 / 30",
    text: "заработка гильдии: на зарплаты / в казну",
    ref: "п. 3.1",
    href: "#rules-3",
  },
  {
    value: "≈30%",
    text: "скидка своим на лут с праймов и АГЛ",
    ref: "п. 4.3",
    href: "#rules-4",
  },
  {
    value: "до 20-го",
    text: "вступил — испытательный срок кончится 1-го числа",
    ref: "п. 1.1",
    href: "#rules-1",
  },
  {
    value: "50–100 тыс.",
    text: "голды разово на спек тактика, барда или танцора",
    ref: "п. 5.3",
    href: "#rules-5",
  },
];

const PENALTY_STEPS = [1, 3, 5, 10, 15];
const PENALTY_ALL = 21;

function formatPercent(value: number): string {
  return `${value.toLocaleString("ru-RU", { maximumFractionDigits: 1 })}%`;
}

function formatGs(value: number): string {
  return value.toLocaleString("ru-RU");
}

function Items({ children }: { children: ReactNode }) {
  return <ol className="flex flex-col gap-1.5">{children}</ol>;
}

function Item({ num, children }: { num: string; children: ReactNode }) {
  return (
    <li className="grid grid-cols-[38px_minmax(0,1fr)] gap-2 sm:grid-cols-[44px_minmax(0,1fr)] sm:gap-2.5">
      <span className="pt-px text-[13px] text-muted-foreground tabular-nums">
        {num}
      </span>
      <div className="min-w-0">{children}</div>
    </li>
  );
}

function SubTitle({ num, children }: { num: string; children: ReactNode }) {
  return (
    <h3 className="mt-1.5 text-[15px] font-semibold">
      <span className="text-muted-foreground">{num}</span> {children}
    </h3>
  );
}

function Lead({ children }: { children: ReactNode }) {
  return <p className="text-foreground/80">{children}</p>;
}

function PageLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="font-medium text-green-700 underline-offset-2 hover:underline dark:text-green-400"
    >
      {children}
    </Link>
  );
}

function AnchorLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="font-medium text-green-700 underline-offset-2 hover:underline dark:text-green-400"
    >
      {children}
    </a>
  );
}

function GearScoreTable({ averageGuildGS }: { averageGuildGS: number }) {
  const rows = [
    { who: "Тактики, барды, танцоры", formula: "средний −2000", delta: -2000 },
    { who: "Хилы (дуалы/щит)", formula: "средний", delta: 0 },
    {
      who: "Лучники, милики, маги (дуалы/щит)",
      formula: "средний +500",
      delta: 500,
    },
    {
      who: "Хилы, лучники, милики, маги (двурук)",
      formula: "средний −500",
      delta: -500,
    },
  ];
  const known = averageGuildGS > 0;

  return (
    <div className="overflow-hidden rounded-lg border text-sm">
      <div className="flex items-center justify-between gap-3 bg-muted/50 px-3.5 py-2.5">
        <span className="text-muted-foreground">Средний ГС гильдии сейчас</span>
        <span className="font-bold tabular-nums">
          {known ? formatGs(averageGuildGS) : "нет данных"}
        </span>
      </div>
      {rows.map((row) => (
        <div
          key={row.who}
          className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 border-t border-border/60 px-3.5 py-2 sm:grid-cols-[minmax(0,1fr)_132px_84px]"
        >
          <span>{row.who}</span>
          <span className="order-3 text-xs text-muted-foreground tabular-nums sm:order-none sm:text-sm">
            {row.formula}
          </span>
          <span className="row-span-2 text-right font-bold tabular-nums sm:row-span-1">
            {known ? formatGs(averageGuildGS + row.delta) : "—"}
          </span>
        </div>
      ))}
    </div>
  );
}

function PenaltyTable() {
  const cells = [
    ...PENALTY_STEPS.map((count) => ({
      count: String(count),
      cut: formatPercent(calculatePenaltyPercent(count)),
      total: false,
    })),
    { count: `${PENALTY_ALL}+`, cut: "вся", total: true },
  ];

  return (
    <div className="overflow-x-auto rounded-lg border text-[13.5px]">
      <table className="w-full min-w-[420px] border-collapse">
        <tbody>
          <tr className="bg-muted/50">
            <th
              scope="row"
              className="px-3 py-1.5 text-left font-normal text-muted-foreground"
            >
              Штрафов
            </th>
            {cells.map((cell) => (
              <td
                key={cell.count}
                className="border-l border-border/60 px-2 py-1.5 text-center font-semibold tabular-nums"
              >
                {cell.count}
              </td>
            ))}
          </tr>
          <tr className="border-t">
            <th
              scope="row"
              className="px-3 py-1.5 text-left font-normal whitespace-nowrap text-muted-foreground"
            >
              Минус к зарплате
            </th>
            {cells.map((cell) => (
              <td
                key={cell.count}
                className={cn(
                  "border-l border-border/60 px-2 py-1.5 text-center font-semibold tabular-nums",
                  cell.total && "text-red-700 dark:text-red-400",
                )}
              >
                {cell.cut}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

type RuleSection = {
  id: string;
  title: string;
  count: number;
  content: ReactNode;
};

function buildSections(averageGuildGS: number): RuleSection[] {
  return [
    {
      id: "rules-1",
      title: "Условия получения зарплаты",
      count: 7,
      content: (
        <>
          <SubTitle num="1.1">Испытательный срок</SubTitle>
          <Items>
            <Item num="1.1.1">
              Испытательный срок заканчивается 1-го числа следующего месяца
              после вступления, при вступлении до 20-го числа включительно.
            </Item>
            <Item num="1.1.2">
              Испытательный срок продлевается на месяц при вступлении после
              20-го числа.
            </Item>
            <Item num="1.1.3">
              Испытательный срок может быть снят заранее или продлён по
              усмотрению главы гильдии.
            </Item>
          </Items>
          <SubTitle num="1.2">Прохождение по ГС</SubTitle>
          <p>
            Проходной ГС рассчитывается на основании среднего ГС гильдии,
            округлённого вниз до пятисот.
          </p>
          <GearScoreTable averageGuildGS={averageGuildGS} />
          <SubTitle num="1.3">Критерии выдачи зарплаты</SubTitle>
          <Items>
            <Item num="1.3.1">
              К критериям выдачи зарплаты относятся: процент посещения праймов;
              процент набранных баллов; имеющиеся персоналки.
            </Item>
            <Item num="1.3.2">
              Действующие критерии — в блоке{" "}
              <AnchorLink href="#criteria">«Допуск к зарплате»</AnchorLink>{" "}
              вверху страницы.
            </Item>
            <Item num="1.3.3">
              Действующие критерии могут быть изменены в любой момент по
              усмотрению главы гильдии.
            </Item>
          </Items>
        </>
      ),
    },
    {
      id: "rules-2",
      title: "Как набираются баллы",
      count: 5,
      content: (
        <>
          <Lead>
            Зарплата рассчитывается на основании процента набранных баллов от
            максимально возможных и заработка гильдии за месяц.
          </Lead>
          <Items>
            <Item num="2.1">
              Баллы набираются за рб и АГЛ, помеченные как обязательные в
              таблице <AnchorLink href="#points">«Баллы за боссов»</AnchorLink>.
            </Item>
            <Item num="2.2">
              Количество баллов, выдаваемых за праймовые рб, указано в той же
              таблице рядом с боссом.
            </Item>
            <Item num="2.3">
              За обязательные АГЛ всегда выдаётся по 1 баллу.
            </Item>
            <Item num="2.4">
              За ПВП на праймовых рб количество выдаваемых баллов удваивается.
            </Item>
            <Item num="2.5">
              За обязательные АГЛ выдаётся по дополнительному баллу за: пвп;
              прок; двойной прок.
            </Item>
          </Items>
        </>
      ),
    },
    {
      id: "rules-3",
      title: "Расчёт выдаваемой зарплаты",
      count: 7,
      content: (
        <Items>
          <Item num="3.1">
            Зарплаты рассчитываются на основании 70% общего заработка гильдии за
            месяц, остальные 30% уходят в казну гильдии на различные необходимые
            расходы.
          </Item>
          <Item num="3.2">
            При расчёте зарплаты учитываются бонус за время нахождения в
            гильдии, дополнительный индивидуальный бонус и количество полученных
            штрафов.
          </Item>
          <Item num="3.3">
            Бонус за срок нахождения в гильдии рассчитывается как 10% за первое
            полугодие и по 5% за каждое последующее.
          </Item>
          <Item num="3.4">
            Дополнительные индивидуальные бонусы присваиваются по усмотрению
            главы гильдии.
          </Item>
          <Item num="3.5">
            Штрафы выставляются индивидуально по усмотрению главы гильдии и
            фиксированно по 3 штрафа за непрохождение по вкладу гильдии.
            Количество необходимого вклада озвучивается главой гильдии в начале
            месяца или при трансфере на новый сервер.
          </Item>
          <Item num="3.6">
            <div className="flex flex-col gap-2.5">
              <span>
                Штрафы действуют по формуле{" "}
                <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[13px]">
                  x^(e^(1.25)/2)/2
                </code>
                , где x — число штрафов.
              </span>
              <PenaltyTable />
            </div>
          </Item>
          <Item num="3.7">
            Все бонусы и процент штрафа учитываются последовательно и влияют
            друг на друга.
          </Item>
        </Items>
      ),
    },
    {
      id: "rules-4",
      title: "Лут с праймовых рб и АГЛ",
      count: 6,
      content: (
        <>
          <Lead>
            Все предметы, получаемые за праймовых рб и АГЛ, продаются внутри
            гильдии в соответствии с очередью на их покупку. Если очереди на
            предмет нет, он выставляется на аукцион.
          </Lead>
          <Items>
            <Item num="4.1">
              Глава гильдии распоряжается лутом на своё усмотрение. Весь лут
              праймовых рб, АГЛ, кошка, морф, марли скидывается главе гильдии.
            </Item>
            <Item num="4.2">
              Определённые предметы не продаются ни внутри гильдии, ни на
              аукционе, а выдаются бесплатно по усмотрению главы гильдии, при
              условии что в этих предметах нуждаются или впредь будут нуждаться
              члены гильдии. Список таких предметов и очередь на их получение —
              на странице{" "}
              <PageLink href="/loot/giveaway">«Раздача лута»</PageLink>.
            </Item>
            <Item num="4.3">
              Внутри гильдии все предметы, получаемые за праймовые рб и АГЛ,
              продаются со скидкой ~30%.
            </Item>
            <Item num="4.4">
              Все точные цены и очереди на покупку — на странице{" "}
              <PageLink href="/loot/buy">«Покупка лута»</PageLink>.
            </Item>
            <Item num="4.5">
              Встать в очередь на покупку может любой член гильдии, даже если не
              прошёл испытательный срок, обратившись к главе гильдии.
            </Item>
            <Item num="4.6">
              Запрещается покупать что-либо у гильдии для перепродажи, в случае
              выяснения подобного могут последовать штрафы или исключение из
              гильдии.
            </Item>
          </Items>
        </>
      ),
    },
    {
      id: "rules-5",
      title: "Помощь с коллекциями и вторыми спеками",
      count: 3,
      content: (
        <Items>
          <Item num="5.1">
            Гильдия бесплатно предоставляет двух последних питомцев для
            коллекции боевых питомцев.
          </Item>
          <Item num="5.2">
            Гильдия бесплатно выдаёт глайдер с Кракена, если он остался
            последним для коллекции глайдеров, либо добавляет 50 000 голды на
            покупку одного из дорогих глайдеров, если один из них остался
            последним для коллекции. Также гильдия предоставляет помощь для
            т2-коллекций глайдеров/питомцев: можно выбрать только одну из
            коллекций, гильдия купит последние 2 глайдера/питомца для неё.
          </Item>
          <Item num="5.3">
            Гильдия единожды добавляет от 50 000 до 100 000 голды на сборку
            спека тактика/барда/танцора.
          </Item>
        </Items>
      ),
    },
    {
      id: "rules-6",
      title: "Система авансов",
      count: 3,
      content: (
        <Items>
          <Item num="6.1">
            Любой член гильдии при покупке предметов у гильдии может частично
            или полностью оплатить покупку за счёт своей зарплаты за текущий
            месяц.
          </Item>
          <Item num="6.2">
            Глава гильдии может отказаться от выдачи аванса по своему усмотрению
            без объяснения причины отказа.
          </Item>
          <Item num="6.3">
            <div className="flex flex-col gap-1.5">
              <span>
                Члены гильдии могут получить аванс голдой на руки, указав:
              </span>
              <ul className="flex flex-col gap-1 rounded-lg bg-muted/50 px-3.5 py-2.5">
                <li>
                  <span className="text-muted-foreground">а)</span> для чего
                  хотите снять аванс;
                </li>
                <li>
                  <span className="text-muted-foreground">б)</span> сумму снятия
                  аванса.
                </li>
              </ul>
              <span>Далее всё как решит глава гильдии.</span>
            </div>
          </Item>
        </Items>
      ),
    },
  ];
}

function pointsLabel(count: number): string {
  return `${count} ${count < 5 ? "пункта" : "пунктов"}`;
}

function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

export default function GuildRules({
  averageGuildGS,
}: {
  averageGuildGS: number;
}) {
  const sections = buildSections(averageGuildGS);
  const ids = sections.map((section) => section.id);
  const [open, setOpen] = useState<string[]>([ids[0]]);
  const [sectionIds] = useState(ids);
  const active = useActiveSection(sectionIds);
  const allOpen = open.length === sections.length;

  const toggle = (id: string) =>
    setOpen((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );

  return (
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_248px]">
      <div className="flex min-w-0 flex-col gap-4">
        <section
          aria-label="Коротко о главном"
          className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4"
        >
          {FACTS.map((fact) => (
            <a
              key={fact.ref}
              href={fact.href}
              className="flex flex-col gap-1 rounded-xl bg-muted px-3.5 py-3 transition-colors hover:bg-accent sm:px-4 sm:py-3.5"
            >
              <span className="text-[19px] leading-tight font-bold tracking-tight sm:text-[22px]">
                {fact.value}
              </span>
              <span className="text-[12.5px] leading-snug text-foreground/75 sm:text-[13px]">
                {fact.text}
              </span>
              <span className="mt-auto pt-0.5 text-xs text-muted-foreground">
                {fact.ref}
              </span>
            </a>
          ))}
        </section>

        <div className="mt-1 flex items-center justify-between gap-3 lg:hidden">
          <h2 className="text-[17px] font-bold">Правила</h2>
          <button
            type="button"
            onClick={() => setOpen(allOpen ? [] : ids)}
            className="h-9 cursor-pointer rounded-lg border bg-background px-3 text-sm font-medium transition-colors hover:bg-accent"
          >
            {allOpen ? "Свернуть всё" : "Развернуть всё"}
          </button>
        </div>

        <div className="flex flex-col gap-2 lg:gap-4">
          {sections.map((section, index) => {
            const isOpen = open.includes(section.id);
            return (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-title`}
                className="scroll-mt-6 rounded-xl border bg-card"
              >
                <button
                  type="button"
                  onClick={() => toggle(section.id)}
                  aria-expanded={isOpen}
                  className="grid min-h-[60px] w-full cursor-pointer grid-cols-[30px_minmax(0,1fr)_20px] items-center gap-3 px-3.5 py-2.5 text-left lg:pointer-events-none lg:cursor-default lg:grid-cols-[30px_minmax(0,1fr)] lg:px-6 lg:pt-5 lg:pb-0"
                >
                  <span className="flex size-[30px] items-center justify-center rounded-lg bg-green-50 text-sm font-bold text-green-700 dark:bg-green-500/10 dark:text-green-400">
                    {index + 1}
                  </span>
                  <span className="min-w-0">
                    <span
                      id={`${section.id}-title`}
                      className="block text-[15px] leading-snug font-semibold lg:text-lg lg:font-bold lg:tracking-tight"
                    >
                      {section.title}
                    </span>
                    <span className="block text-xs text-muted-foreground lg:hidden">
                      {pointsLabel(section.count)}
                    </span>
                  </span>
                  <ChevronDown
                    className={cn(
                      "size-[18px] text-muted-foreground transition-transform lg:hidden",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "flex-col gap-3 border-t border-border/60 px-3.5 pt-3 pb-4 text-sm leading-relaxed lg:flex lg:border-t-0 lg:px-6 lg:pb-[22px] lg:text-[14.5px]",
                    isOpen ? "flex" : "hidden",
                  )}
                >
                  {section.content}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <aside className="sticky top-6 hidden flex-col gap-4 xl:flex">
        <nav
          aria-label="Содержание"
          className="flex flex-col gap-0.5 rounded-xl border bg-card px-2.5 py-3.5"
        >
          <div className="flex items-center gap-2 px-2 pb-2 text-[13px] font-semibold text-muted-foreground">
            <ListTree className="size-[15px]" />
            Содержание
          </div>
          {sections.map((section, index) => {
            const current = section.id === active;
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                aria-current={current ? "location" : undefined}
                className={cn(
                  "grid grid-cols-[18px_minmax(0,1fr)] gap-2 rounded-lg px-2 py-1.5 text-[13.5px] leading-snug transition-colors",
                  current
                    ? "bg-green-50 font-semibold text-green-800 dark:bg-green-500/10 dark:text-green-300"
                    : "text-foreground/80 hover:bg-accent",
                )}
              >
                <span
                  className={cn(
                    "tabular-nums",
                    current
                      ? "text-green-700 dark:text-green-400"
                      : "text-muted-foreground",
                  )}
                >
                  {index + 1}
                </span>
                {section.title}
              </a>
            );
          })}
        </nav>
        <nav
          aria-label="Связанные страницы"
          className="flex flex-col gap-0.5 rounded-xl border bg-card px-2.5 py-3.5"
        >
          <div className="px-2 pb-2 text-[13px] font-semibold text-muted-foreground">
            Связанные страницы
          </div>
          {RELATED.map((page) => (
            <Link
              key={page.url}
              href={page.url}
              className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13.5px] transition-colors hover:bg-accent"
            >
              <page.icon className="size-4 text-muted-foreground" />
              <span className="flex-1">{page.title}</span>
              <ArrowUpRight className="size-3.5 text-muted-foreground/70" />
            </Link>
          ))}
        </nav>
      </aside>
    </div>
  );
}
