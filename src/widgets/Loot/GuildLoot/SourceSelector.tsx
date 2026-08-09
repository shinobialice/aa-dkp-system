"use client";

import { useEffect, useId, useRef, useState } from "react";
import { getBosses } from "@/actions/getBosses";

// Эти боссы не должны попадать в подсказки источника казны.
const EXCLUDED_SOURCE_BOSSES = [
  "Осада",
  "Дельфиец",
  "Морф",
  "Марли Прок",
  "Кошка",
];

export function SourceSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [bossNames, setBossNames] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  // Браузер и менеджеры паролей всё равно норовят подсунуть свой
  // автозаполняющий список поверх нашего — уникальное имя поля (вместо
  // "off") и явные data-атрибуты отключают их сильнее, чем один
  // autoComplete="off".
  const fieldId = useId();

  useEffect(() => {
    getBosses().then((bosses) =>
      setBossNames(
        bosses
          .map((b) => b.boss_name)
          .filter((name) => !EXCLUDED_SOURCE_BOSSES.includes(name)),
      ),
    );
  }, []);

  // Свой дропдаун вместо Popover из Radix — тот закрывался сам сразу
  // после открытия из-за конфликта фокуса между инпутом и его
  // dismissable-layer'ом. Тут всё под ручным контролем: открывается по
  // фокусу поля, закрывается только по клику снаружи или выбору варианта.
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const query = value.trim().toLowerCase();
  const suggestions = query
    ? bossNames.filter((name) => name.toLowerCase().includes(query))
    : bossNames;

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        name={`source-${fieldId}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsOpen(true)}
        placeholder="Босс или другой источник..."
        className="border rounded px-2 py-1 w-full"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        data-1p-ignore
        data-lpignore="true"
        data-bwignore="true"
        data-form-type="other"
      />
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full min-w-[270px] max-h-60 overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md p-1">
          {suggestions.length > 0 ? (
            suggestions.map((name) => (
              <button
                key={name}
                type="button"
                className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-accent cursor-pointer"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(name);
                  setIsOpen(false);
                }}
              >
                {name}
              </button>
            ))
          ) : (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              Нет совпадений среди боссов — можно ввести свой источник
            </div>
          )}
        </div>
      )}
    </div>
  );
}
