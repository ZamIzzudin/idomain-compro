import { useQuery } from "@tanstack/react-query";
import { fetchAllSettings, settingsToMap } from "./service";

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const settings = await fetchAllSettings();
      return settingsToMap(settings);
    },
    staleTime: 5 * 60 * 1000,
  });
};
