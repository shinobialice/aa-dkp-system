const TAG_COLORS: Record<string, string> = {
  Активен: "rgb(47, 158, 98)",
  "Получает зарплату": "rgb(23, 133, 115)",
  Администратор: "rgb(215, 100, 168)",
  Секретутка: "rgb(79, 70, 229)",
  Сноровка: "rgb(90, 54, 165)",
  Крит: "rgb(215, 100, 168)",
  ДВ: "rgb(232, 157, 53)",
  Двурук: "rgb(0, 148, 168)",
  Каст: "rgb(157, 41, 41)",
  Деф: "rgb(40, 111, 180)",
  Модератор: "rgb(58, 76, 92)",
};

const DEFAULT_TAG_COLOR = "rgb(59, 130, 246)";

export default function TagChip({ label }: { label: string }) {
  const color = TAG_COLORS[label] ?? DEFAULT_TAG_COLOR;
  return (
    <span
      className="inline-flex h-6 items-center rounded-full px-2 text-xs font-semibold whitespace-nowrap"
      style={{
        color,
        backgroundColor: color.replace("rgb(", "rgba(").replace(")", ", 0.12)"),
      }}
    >
      {label}
    </span>
  );
}
