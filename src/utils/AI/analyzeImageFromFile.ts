export async function analyzeImageFromFile(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch("/api/analyze", {
    method: "POST",
    body: formData,
  });
  const data = await res.json();

  const img = new Image();
  img.src = URL.createObjectURL(file);

  return new Promise<{ name: string; className: string }[]>((resolve) => {
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return resolve([]);

      ctx.drawImage(img, 0, 0);

      function getAverageColor(x: number, y: number): [number, number, number] {
        let r = 0,
          g = 0,
          b = 0,
          count = 0;
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const pixel = ctx.getImageData(x + dx, y + dy, 1, 1).data;
            r += pixel[0];
            g += pixel[1];
            b += pixel[2];
            count++;
          }
        }
        return [
          Math.round(r / count),
          Math.round(g / count),
          Math.round(b / count),
        ];
      }

      const results = (data.raw.readResults ?? []).flatMap((page: any) =>
        page.lines
          .filter((line: any) => {
            const text = line.text.replace(/[.]/g, "").trim();
            if (/^\d+$/.test(text)) return false;
            const nonWordRatio =
              text.replace(/[a-zA-Zа-яА-ЯёЁ0-9]/g, "").length / text.length;
            if (nonWordRatio > 0.5) return false;
            return true;
          })
          .map((line: any) => {
            const [x1, y1, , , x3, y3] = line.boundingBox;
            const cx = Math.floor((x1 + x3) / 2);
            const cy = Math.floor((y1 + y3) / 2) + 10;
            const [r, g, b] = getAverageColor(cx, cy);
            const name = line.text.replace(/[.]/g, "").trim();
            return { name };
          })
      );

      resolve(results);
    };
  });
}
