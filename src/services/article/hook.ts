import { useQuery } from "@tanstack/react-query";
import {
  fetchArticleList,
  fetchArticleBySlug,
  fetchArticleFilterOptions,
} from "./service";

export const useArticleList = (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  tag?: string;
  sortOrder?: string;
}) => {
  return useQuery({
    queryKey: ["article_list", params],
    queryFn: () => fetchArticleList(params),
    refetchOnWindowFocus: false,
  });
};

export const useArticleBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["article_detail", slug],
    queryFn: () => fetchArticleBySlug(slug),
    enabled: !!slug,
  });
};

export const useArticleFilterOptions = () => {
  return useQuery({
    queryKey: ["article_filter_options"],
    queryFn: fetchArticleFilterOptions,
    staleTime: 5 * 60 * 1000,
  });
};
