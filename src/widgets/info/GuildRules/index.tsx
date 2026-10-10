"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, ListTree } from "lucide-react";
import { cn } from "@/shared/lib/tw-merge";
import { FACTS, RELATED } from "./ruleFacts";
import { buildSections } from "./ruleSections";
import { useActiveSection } from "./useActiveSection";

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
              <span className="text-xl leading-tight font-bold tracking-tight sm:text-2xl">
                {fact.value}
              </span>
              <span className="text-xs leading-snug text-foreground/75 sm:text-sm">
                {fact.text}
              </span>
              <span className="mt-auto pt-0.5 text-xs text-muted-foreground">
                {fact.ref}
              </span>
            </a>
          ))}
        </section>

        <div className="mt-1 flex items-center justify-between gap-3 lg:hidden">
          <h2 className="text-lg font-bold">Правила</h2>
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
                className="scroll-mt-[calc(var(--app-header)+1.5rem)] rounded-xl border bg-card"
              >
                <button
                  type="button"
                  onClick={() => toggle(section.id)}
                  aria-expanded={isOpen}
                  className="grid min-h-15 w-full cursor-pointer grid-cols-[30px_minmax(0,1fr)_20px] items-center gap-3 px-3.5 py-2.5 text-left lg:pointer-events-none lg:cursor-default lg:grid-cols-[30px_minmax(0,1fr)] lg:px-6 lg:pt-5 lg:pb-0"
                >
                  <span className="flex size-7.5 items-center justify-center rounded-lg bg-green-50 text-sm font-bold text-green-700 dark:bg-green-500/10 dark:text-green-400">
                    {index + 1}
                  </span>
                  <span className="min-w-0">
                    <span
                      id={`${section.id}-title`}
                      className="block text-base leading-snug font-semibold lg:text-lg lg:font-bold lg:tracking-tight"
                    >
                      {section.title}
                    </span>
                    <span className="block text-xs text-muted-foreground lg:hidden">
                      {pointsLabel(section.count)}
                    </span>
                  </span>
                  <ChevronDown
                    className={cn(
                      "size-4.5 text-muted-foreground transition-transform lg:hidden",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "flex-col gap-3 border-t border-border/60 px-3.5 pt-3 pb-4 text-sm leading-relaxed lg:flex lg:border-t-0 lg:px-6 lg:pb-5.5",
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

      <aside className="sticky top-[calc(var(--app-header)+1.5rem)] hidden flex-col gap-4 xl:flex">
        <nav
          aria-label="Содержание"
          className="flex flex-col gap-0.5 rounded-xl border bg-card px-2.5 py-3.5"
        >
          <div className="flex items-center gap-2 px-2 pb-2 text-sm font-semibold text-muted-foreground">
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
                  "grid grid-cols-[18px_minmax(0,1fr)] gap-2 rounded-lg px-2 py-1.5 text-sm leading-snug transition-colors",
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
          <div className="px-2 pb-2 text-sm font-semibold text-muted-foreground">
            Связанные страницы
          </div>
          {RELATED.map((page) => (
            <Link
              key={page.url}
              href={page.url}
              className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-accent"
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

function pointsLabel(count: number): string {
  return `${count} ${count < 5 ? "пункта" : "пунктов"}`;
}
