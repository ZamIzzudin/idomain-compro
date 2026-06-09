import { useQuery } from "@tanstack/react-query";
import {
  fetchEventList,
  fetchEventBySlug,
  fetchEventFilterOptions,
} from "./service";

export const useEventList = (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  tag?: string;
  upcoming?: string;
  sortOrder?: string;
}) => {
  return useQuery({
    queryKey: ["event_list", params],
    queryFn: () => fetchEventList(params),
    refetchOnWindowFocus: false,
  });
};

export const useEventBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["event_detail", slug],
    queryFn: () => fetchEventBySlug(slug),
    enabled: !!slug,
  });
};

export const useEventFilterOptions = () => {
  return useQuery({
    queryKey: ["event_filter_options"],
    queryFn: fetchEventFilterOptions,
    staleTime: 5 * 60 * 1000,
  });
};
