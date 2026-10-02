export type OcrBox = { x: number; y: number; width: number; height: number };

export type OcrWord = { name: string; box: OcrBox | null };

export type OcrImage = { words: OcrWord[]; width: number; height: number };

type OCRLine = {
  text: string;
  box?: OcrBox | null;
};

type OCRPage = {
  lines: OCRLine[];
};

type OCRResult = {
  readResults?: OCRPage[];
};

const UPSCALE_FACTOR = 2;

function upscaleImage(
  file: File,
): Promise<{ blob: Blob; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width * UPSCALE_FACTOR;
      canvas.height = img.height * UPSCALE_FACTOR;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas not supported"));
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          resolve({ blob, width: img.width, height: img.height });
        } else {
          reject(new Error("Failed to upscale image"));
        }
      }, "image/png");
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

async function analyzeImageFromFile(file: File): Promise<OcrImage> {
  const { blob, width, height } = await upscaleImage(file);

  const formData = new FormData();
  formData.append("image", blob, "upscaled.png");

  const res = await fetch("/api/analyze", {
    method: "POST",
    body: formData,
  });

  const data: { raw?: OCRResult; error?: string } = await res.json();
  if (!res.ok || !data.raw) {
    throw new Error(data.error ?? "Не удалось распознать скриншот");
  }

  const words =
    data.raw.readResults?.flatMap((page) =>
      page.lines
        .filter((line) => {
          const text = line.text.replace(/[.]/g, "").trim();
          if (!text || /^\d+$/.test(text)) {
            return false;
          }

          const nonWordRatio =
            text.replace(/[a-zA-Zа-яА-ЯёЁ0-9]/g, "").length / text.length;
          return nonWordRatio <= 0.5;
        })
        .map((line) => ({
          name: line.text.replace(/[.]/g, "").trim(),
          box: line.box
            ? {
                x: line.box.x / UPSCALE_FACTOR,
                y: line.box.y / UPSCALE_FACTOR,
                width: line.box.width / UPSCALE_FACTOR,
                height: line.box.height / UPSCALE_FACTOR,
              }
            : null,
        })),
    ) ?? [];

  return { words, width, height };
}

export default analyzeImageFromFile;
