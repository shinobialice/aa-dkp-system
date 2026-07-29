type OCRLine = {
  text: string;
};

type OCRPage = {
  lines: OCRLine[];
};

type OCRResult = {
  readResults?: OCRPage[];
};

const UPSCALE_FACTOR = 2;

function upscaleImage(file: File): Promise<Blob> {
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
          resolve(blob);
        } else {
          reject(new Error("Failed to upscale image"));
        }
      }, "image/png");
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

async function analyzeImageFromFile(
  file: File,
): Promise<{ name: string; className?: string }[]> {
  const upscaled = await upscaleImage(file);

  const formData = new FormData();
  formData.append("image", upscaled, "upscaled.png");

  const res = await fetch("/api/analyze", {
    method: "POST",
    body: formData,
  });

  const data: { raw: OCRResult } = await res.json();

  const results =
    data.raw.readResults?.flatMap((page) =>
      page.lines
        .filter((line) => {
          const text = line.text.replace(/[.]/g, "").trim();
          if (/^\d+$/.test(text)) {
            return false;
          }

          const nonWordRatio =
            text.replace(/[a-zA-Zа-яА-ЯёЁ0-9]/g, "").length / text.length;
          return nonWordRatio <= 0.5;
        })
        .map((line) => {
          const name = line.text.replace(/[.]/g, "").trim();
          return { name };
        }),
    ) ?? [];

  return results;
}

export default analyzeImageFromFile;
