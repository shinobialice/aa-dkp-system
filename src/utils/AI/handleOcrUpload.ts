import { getActiveUsers } from "@/src/actions/getActiveUsers";
import { analyzeImageFromFile } from "./analyzeImageFromFile";
import { use } from "react";

export const handleOcrUpload = async (file: File) => {
  const ocrResults = await analyzeImageFromFile(file);
  const allUsers = await getActiveUsers();

  const userNames = allUsers.map((u) => u.username);

  const normalizedUserNames = userNames.map((u) => u.toLowerCase());

  const { matchedUserNames, unmatchedUserNames } = ocrResults.reduce(
    (acc, ocr) => {
      const ocrName = ocr.name.toLowerCase();

      const matchedCandidates = normalizedUserNames.filter((username) =>
        username.startsWith(ocrName)
      );

      if (matchedCandidates.length === 1) {
        // находим оригинальный ник (в том же регистре)
        const originalName = userNames.find(
          (u) => u.toLowerCase() === matchedCandidates[0]
        );
        if (originalName) {
          acc.matchedUserNames.push(originalName);
        }
      } else {
        acc.unmatchedUserNames.push(ocr.name);
      }

      return acc;
    },
    { matchedUserNames: [] as string[], unmatchedUserNames: [] as string[] }
  );

  return { matchedUserNames, unmatchedUserNames };
};
