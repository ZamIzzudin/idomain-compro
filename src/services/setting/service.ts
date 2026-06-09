import AxiosClient from "@/lib/axios";

export interface SiteSettingItem {
  id: number;
  key: string;
  value: string | null;
  category: string;
}

export async function fetchAllSettings() {
  try {
    const { data } = await AxiosClient.get("/settings");
    return (data.data || []) as SiteSettingItem[];
  } catch {
    return [];
  }
}

export async function fetchSettingsByCategory(category: string) {
  try {
    const { data } = await AxiosClient.get(`/settings/category/${category}`);
    return (data.data || []) as SiteSettingItem[];
  } catch {
    return [];
  }
}

export function settingsToMap(settings: SiteSettingItem[]): Record<string, string> {
  const map: Record<string, string> = {};
  settings.forEach((s) => {
    if (s.value) map[s.key] = s.value;
  });
  return map;
}
