import { useState } from "react";
import { Task } from "../types/task";

export function useTaskForm(initialTask?: Partial<Task>) {
  const [name, setName] = useState(initialTask?.name || "");
  const [createdAt, setCreatedAt] = useState<Date>(
    initialTask?.created_at ? new Date(initialTask.created_at) : new Date()
  );
  const [status, setStatus] = useState<"in_progress" | "completed">(
    initialTask?.completed_at ? "completed" : "in_progress"
  );
  const [completedAt, setCompletedAt] = useState<Date | null>(
    initialTask?.completed_at ? new Date(initialTask.completed_at) : null
  );
  const [loading, setLoading] = useState(false);

  return {
    name,
    setName,
    createdAt,
    setCreatedAt,
    status,
    setStatus,
    completedAt,
    setCompletedAt,
    loading,
    setLoading,
  };
}
