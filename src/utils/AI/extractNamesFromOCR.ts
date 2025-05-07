type OCRLine = {
  text: string;
};

type OCRPage = {
  lines: OCRLine[];
};

type OCRReadResults = {
  readResults?: OCRPage[];
};

function extractNamesFromReadOCR(data: OCRReadResults): string[] {
  const words: string[] = [];

  data.readResults?.forEach((page) => {
    page.lines.forEach((line) => {
      words.push(line.text);
    });
  });

  return words.filter((w) => /^[A-Za-zА-Яа-яЁё0-9._-]{3,20}$/.test(w));
}
export default extractNamesFromReadOCR;
