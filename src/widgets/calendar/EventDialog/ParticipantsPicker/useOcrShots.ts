"use client";

import { useState } from "react";
import handleOcrUpload from "@/utils/AI/handleOcrUpload";
import type { OcrShot } from "./OcrScreenshotViewer/ocrModel";
import { errorMessage } from "@/shared/lib/errorMessage";

export function useOcrShots() {
  const [shots, setShots] = useState<OcrShot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewerOpen, setViewerOpen] = useState(false);

  const recognize = async (files: File[]) => {
    setLoading(true);
    setError("");
    try {
      const results = await Promise.all(files.map(handleOcrUpload));
      shots.forEach((shot) => URL.revokeObjectURL(shot.url));
      setShots(
        results.map((result, index) => ({
          url: URL.createObjectURL(files[index]),
          width: result.width,
          height: result.height,
          words: result.words,
        })),
      );
      setViewerOpen(true);
      return new Set(results.flatMap((result) => result.matchedUserNames));
    } catch (recognizeError) {
      setError(errorMessage(recognizeError, "Ошибка распознавания"));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const assignWord = (
    shotIndex: number,
    wordIndex: number,
    username: string,
  ) => {
    setShots((current) =>
      current.map((shot, i) => {
        if (i !== shotIndex) return shot;
        const words = shot.words.map((word, j) =>
          j === wordIndex ? { ...word, match: username } : word,
        );
        return { ...shot, words };
      }),
    );
  };

  const clearShots = () => {
    shots.forEach((shot) => URL.revokeObjectURL(shot.url));
    setShots([]);
  };

  return {
    shots,
    loading,
    error,
    viewerOpen,
    setViewerOpen,
    recognize,
    assignWord,
    clearShots,
  };
}
