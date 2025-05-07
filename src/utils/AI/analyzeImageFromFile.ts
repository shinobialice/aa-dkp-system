type OCRLine = {
  text: string;
};

type OCRPage = {
  lines: OCRLine[];
};

type OCRResult = {
  readResults?: OCRPage[];
};

async function analyzeImageFromFile(
  file: File
): Promise<{ name: string; className?: string }[]> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch("/api/analyze", {
    method: "POST",
    body: formData,
  });

  const data: { raw: OCRResult } = await res.json();

  const img = new Image();
  img.src = URL.createObjectURL(file);

  return new Promise((resolve) => {
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        return resolve([]);
      }

      ctx.drawImage(img, 0, 0);

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
            })
        ) ?? [];

      resolve(results);
    };
  });
}

export default analyzeImageFromFile;
