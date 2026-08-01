"use server";

const ARCHEAGE_NEWS_URL = "https://archeage.ru/news/";

export type ArchNewsItem = {
  id: string;
  title: string;
  url: string;
  date: string;
  image: string | null;
  teaser: string;
};

const HTML_ENTITIES: Record<string, string> = {
  "&laquo;": "«",
  "&raquo;": "»",
  "&mdash;": "—",
  "&ndash;": "–",
  "&nbsp;": " ",
  "&amp;": "&",
  "&quot;": '"',
  "&#039;": "'",
  "&hellip;": "…",
};

function decodeHtml(text: string): string {
  return text
    .replace(
      /&laquo;|&raquo;|&mdash;|&ndash;|&nbsp;|&amp;|&quot;|&#039;|&hellip;/g,
      (match) => HTML_ENTITIES[match],
    )
    .replace(/<[^>]+>/g, "")
    .trim();
}

export async function getArcheAgeNews(): Promise<ArchNewsItem[]> {
  try {
    const res = await fetch(ARCHEAGE_NEWS_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      },
      next: { revalidate: 1800 },
    });

    if (!res.ok) {
      throw new Error(`archeage.ru ответил статусом ${res.status}`);
    }

    const html = await res.text();
    const rows = html.split('<div class="views-row').slice(1);

    return rows
      .map((row): ArchNewsItem | null => {
        const titleMatch = row.match(
          /views-field-title[\s\S]*?<a href="([^"]+)"[^>]*>([^<]+)<\/a>/,
        );
        if (!titleMatch) return null;

        const dateMatch = row.match(
          /views-field-created[\s\S]*?field-content">([^<]+)</,
        );
        const imageMatch = row.match(/<img src="([^"]+)"/);
        const teaserMatch = row.match(
          /views-field-teaser[\s\S]*?<p>([\s\S]*?)<\/p>/,
        );

        const href = titleMatch[1];
        const url = href.startsWith("http")
          ? href
          : `https://archeage.ru${href}`;
        const idMatch = href.match(/(\d+)\.html/);

        return {
          id: idMatch ? idMatch[1] : url,
          title: decodeHtml(titleMatch[2]),
          url,
          date: dateMatch ? dateMatch[1].trim() : "",
          image: imageMatch ? imageMatch[1] : null,
          teaser: teaserMatch ? decodeHtml(teaserMatch[1]) : "",
        };
      })
      .filter((item): item is ArchNewsItem => item !== null);
  } catch (error) {
    console.error("Не удалось загрузить новости archeage.ru:", error);
    return [];
  }
}
