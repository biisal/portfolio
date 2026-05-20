export async function getWakatimeStats() {
  try {
    const res = await fetch(
      "https://wakatime.com/api/v1/users/0f55e9f5-6228-466e-903b-95815eb3a43e/stats/last_7_days?timeout=15",
      {
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return { languages: [] };
    const json = await res.json();
    return json.data ?? { languages: [] };
  } catch {
    return { languages: [] };
  }
}
