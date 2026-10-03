"use client";

import { useEffect, useId, useRef, useState } from "react";
import { getBosses } from "@/actions/getBosses";
import { useAsyncData } from "@/hooks/useAsyncData";

// Эти боссы не должны попадать в подсказки источника казны.
const EXCLUDED_SOURCE_BOSSES = [
  "Осада",
  "Дельфиец",
  "Морф",
  "Марли Прок",
  "Кошка",
];

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function SourceSelector({ value, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  // Браузер и менеджеры паролей всё равно норовят подсунуть свой
  // автозаполняющий список поверх нашего — уникальное имя поля (вместо
  // "off") и явные data-атрибуты отключают их сильнее, чем один
  // autoComplete="off".
  const fieldId = useId();
  const { data: bosses = [] } = useAsyncData("bosses", () => getBosses());

  // Свой дропдаун вместо Popover из Radix — тот закрывался сам сразу после
  // открытия из-за конфликта фокуса между инпутом и его dismissable-layer'ом.
  // Тут всё под ручным контролем: открывается по фокусу поля, закрывается
  // только по клику снаружи или выбору варианта.
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const query = value.trim().toLowerCase();
  const suggestions = bosses
    .map((boss) => boss.boss_name)
    .filter((name) => !EXCLUDED_SOURCE_BOSSES.includes(name))
    .filter((name) => !query || name.toLowerCase().includes(query));

  const handlePick = (name: string) => {
    onChange(name);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        name={`source-${fieldId}`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setIsOpen(true)}
        placeholder="Босс или другой источник..."
        className="w-full rounded border px-2 py-1"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        data-1p-ignore
        data-lpignore="true"
        data-bwignore="true"
        data-form-type="other"
      />
      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full min-w-67.5 overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
          <SourceSuggestions suggestions={suggestions} onPick={handlePick} />
        </div>
      )}
    </div>
  );
}

type SourceSuggestionsProps = {
  suggestions: string[];
  onPick: (name: string) => void;
};

function SourceSuggestions({ suggestions, onPick }: SourceSuggestionsProps) {
  if (suggestions.length === 0) {
    return (
      <div className="px-2 py-1.5 text-sm text-muted-foreground">
        Нет совпадений среди боссов — можно ввести свой источник
      </div>
    );
  }

  return suggestions.map((name) => (
    <button
      key={name}
      type="button"
      className="w-full cursor-pointer rounded px-2 py-1.5 text-left text-sm hover:bg-accent"
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => onPick(name)}
    >
      {name}
    </button>
  ));
}
