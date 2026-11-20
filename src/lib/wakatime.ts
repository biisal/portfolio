import { useEffect, useState } from "react";

export interface Language {
  name: string;
  percent: number;
}

const URL =
  "https://wakatime.com/api/v1/users/0f55e9f5-6228-466e-903b-95815eb3a43e/stats/last_7_days?timeout=15";

/** Client-side fetch; renders no languages if the request (e.g. CORS) fails. */
export function useWakatimeLanguages() {
  const [languages, setLanguages] = useState<Language[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch(URL)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!cancelled && json?.data?.languages) {
          setLanguages(json.data.languages);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return languages;
}
