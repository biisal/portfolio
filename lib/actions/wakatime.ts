interface Language {
  name: string;
  percent: number;
}

interface CacheEntry {
  data: { languages: Language[] };
  timestamp: number;
}

const CACHE_TTL = 3600 * 1000;
let cache: CacheEntry | null = null;

export async function getWakatimeStats(): Promise<{ languages: Language[] }> {
  const now = Date.now();

  if (cache && now - cache.timestamp < CACHE_TTL) {
    return cache.data;
  }

  try {
    const res = await fetch(
      "https://wakatime.com/api/v1/users/0f55e9f5-6228-466e-903b-95815eb3a43e/stats/last_7_days?timeout=15",
      { next: { revalidate: 3600 } },
    );

    if (!res.ok) return { languages: [] };

    const json = await res.json();
    const data = json.data ?? { languages: [] };

    cache = { data, timestamp: now };
    return data;
  } catch {
    return { languages: [] };
  }
}
