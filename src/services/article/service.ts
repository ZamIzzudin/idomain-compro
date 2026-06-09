import AxiosClient from "@/lib/axios";

export interface ArticleItem {
  id: number;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  author: string;
  tags: string[];
  featuredImage: string | null;
  status: string;
  views: number;
  publishedAt: string | null;
  createdAt: string;
}

export interface ArticleListResponse {
  status: number;
  items: ArticleItem[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface ArticleDetailResponse {
  status: number;
  data: ArticleItem & {
    metaTitle: string | null;
    metaDescription: string | null;
    metaKeywords: string[];
  };
}

export async function fetchArticleList(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  tag?: string;
  sortOrder?: string;
}) {
  const { data } = await AxiosClient.get("/articles", { params });
  return data as ArticleListResponse;
}

export async function fetchArticleBySlug(slug: string) {
  const { data } = await AxiosClient.get(`/articles/slug/${slug}`);
  return data as ArticleDetailResponse;
}

export async function fetchArticleFilterOptions() {
  const { data } = await AxiosClient.get("/articles/filter-options");
  return data.data as {
    tags: string[];
  };
}
