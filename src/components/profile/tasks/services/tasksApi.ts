import { Task } from "../types/task";

export async function fetchTasks(userId: number): Promise<Task[]> {
  const res = await fetch(`/api/users/${userId}/tasks`);
  if (!res.ok) throw new Error("Ошибка загрузки заданий");
  return res.json();
}

export async function createTask(userId: number, taskData: any) {
  const res = await fetch(`/api/users/${userId}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });
  if (!res.ok) throw new Error("Ошибка при создании задания");
}

export async function updateTask(userId: number, taskId: number, taskData: any) {
  const res = await fetch(`/api/users/${userId}/tasks/${taskId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });
  if (!res.ok) throw new Error("Ошибка при обновлении задания");
}

export async function deleteTask(userId: number, taskId: number) {
  const res = await fetch(`/api/users/${userId}/tasks/${taskId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Ошибка при удалении задания");
}
