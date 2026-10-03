import type { AttendanceBonusMode } from "@/utils/attendanceBonusDefaults";

export default function ModeToggle({
  mode,
  onChange,
}: {
  mode: AttendanceBonusMode;
  onChange: (mode: AttendanceBonusMode) => void;
}) {
  return (
    <div className="flex overflow-hidden rounded-md border">
      <button
        type="button"
        className={`w-7 cursor-pointer text-sm ${mode === "add" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        onClick={() => onChange("add")}
        title="Прибавить балл"
      >
        +
      </button>
      <button
        type="button"
        className={`w-7 cursor-pointer border-l text-sm ${mode === "multiply" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        onClick={() => onChange("multiply")}
        title="Умножить на значение"
      >
        ×
      </button>
    </div>
  );
}
