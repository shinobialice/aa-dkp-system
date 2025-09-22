"use client";
import * as React from "react";
import { Loader } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import handleOcrUpload from "@/src/utils/AI/handleOcrUpload";

export function ScreenshotOcr({
  users,
  setRowSelection,
}: {
  users: any[];
  setRowSelection: (val: Record<number, boolean>) => void;
}) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [unmatched, setUnmatched] = React.useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);
  const [activePreviewIndex, setActivePreviewIndex] = React.useState(0);

  const activeUsers = React.useMemo(
    () => users.filter((u) => u.active),
    [users],
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) {
      return;
    }
    const files = Array.from(e.target.files);
    setLoading(true);
    setError("");
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));

    try {
      const allResults = await Promise.all(
        files.map((file) => handleOcrUpload(file)),
      );

      const matchedSet = new Set<string>();
      const unmatchedSet = new Set<string>();
      allResults.forEach(({ matchedUserNames, unmatchedUserNames }) => {
        matchedUserNames.forEach((name) => matchedSet.add(name));
        unmatchedUserNames.forEach((name) => unmatchedSet.add(name));
      });

      const newSelection: Record<number, boolean> = {};
      activeUsers.forEach((user, index) => {
        if (matchedSet.has(user.username)) {
          newSelection[index] = true;
        }
      });

      setRowSelection(newSelection);
      setUnmatched(Array.from(unmatchedSet));
    } catch (err: any) {
      setError(err.message || "Ошибка распознавания");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Label>Распознавание рейда по скриншоту</Label>
      <Input
        className="cursor-pointer"
        id="picture"
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileUpload}
      />
      <p className="text-sm text-muted-foreground italic">Бета-функция.</p>
      {(loading || error || unmatched.length > 0) && (
        <div className="p-3 rounded-md space-y-2">
          {imagePreviews.length > 0 && (
            <div className="space-y-2">
              <div className="flex gap-2">
                {imagePreviews.map((_, idx) => (
                  <Button
                    className="cursor-pointer"
                    key={idx}
                    variant={activePreviewIndex === idx ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActivePreviewIndex(idx)}
                  >
                    Рейд {idx + 1}
                  </Button>
                ))}
              </div>
              <Image
                width={500}
                height={500}
                src={imagePreviews[activePreviewIndex]}
                alt={`Рейд ${activePreviewIndex + 1}`}
                className="max-w-full max-h-80 border rounded shadow mt-2"
              />
            </div>
          )}
          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader className="animate-spin h-4 w-4" />
              Распознавание...
            </div>
          )}
          {error && <p className="text-red-500">⚠️ {error}</p>}
          {unmatched.length > 0 && (
            <>
              <p className="font-bold">❗ Не распознанные ники:</p>
              <div className="h-84 overflow-auto rounded border p-2">
                <ul className="list-disc pl-5 text-sm">
                  {unmatched.map((name, idx) => (
                    <li key={idx}>{name}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
