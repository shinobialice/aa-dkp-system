export function extractNamesFromReadOCR(data: any): string[] {
  const words: string[] = [];

  data?.readResults?.forEach((page: any) => {
    page.lines.forEach((line: any) => {
      words.push(line.text);
    });
  });

  return words.filter(
    (w) => /^[A-Za-zА-Яа-яЁё0-9._-]{3,20}$/.test(w) 
  );
}
