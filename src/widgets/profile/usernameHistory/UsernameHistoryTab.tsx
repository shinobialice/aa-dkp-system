"use client";

type UsernameHistoryEntry = {
  id: number;
  old_username: string;
  new_username: string;
  changed_at: string;
};

export default function UsernameHistoryTab({
  history,
}: {
  history: UsernameHistoryEntry[];
}) {
  if (history.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-8">
        История изменений ников пуста
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y">
      {history.map((h) => (
        <div key={h.id} className="flex justify-between items-center py-4">
          <div className="text-sm font-medium">
            {h.old_username} <span className="text-muted-foreground">→</span>{" "}
            {h.new_username}
          </div>
          <div className="text-sm text-muted-foreground">
            {new Date(h.changed_at).toLocaleString("ru-RU")}
          </div>
        </div>
      ))}
    </div>
  );
}
