"use client";

import { useState } from "react";

export default function OCRTestPage() {
  const [names, setNames] = useState<string[]>([]);
  const [raw, setRaw] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    setLoading(true);
    setError("");
    setNames([]);
    setRaw(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("🔍 SERVER RESPONSE:", data);

      if (!res.ok) {
        setError(data.error || "Что-то пошло не так");
      } else {
        setNames(data.names || []);
        setRaw(data.raw); // сохраняем необработанный ответ
      }
    } catch (err) {
      setError("Ошибка отправки");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">🎮 OCR Тест: Ники с рейда</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="mb-4"
      />
      {loading && <p>⏳ Распознавание...</p>}
      {error && <p className="text-red-500">⚠️ {error}</p>}

      <h2 className="mt-4 font-semibold">✨ Найденные ники:</h2>
      <ul className="list-disc pl-5">
        {names.map((name, idx) => (
          <li key={idx}>{name}</li>
        ))}
      </ul>

      <details className="mt-6">
        <summary className="cursor-pointer">📦 Сырые данные от Azure</summary>
        <pre className="whitespace-pre-wrap text-xs bg-gray-100 p-2 mt-2 max-h-[300px] overflow-auto">
          {raw ? JSON.stringify(raw, null, 2) : "—"}
        </pre>
      </details>
    </div>
  );
}
