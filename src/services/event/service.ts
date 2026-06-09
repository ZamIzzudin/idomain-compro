import AxiosClient from "@/lib/axios";

export interface EventItem {
  id: number;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  author: string;
  tags: string[];
  featuredImage: string | null;
  eventDate: string;
  endDate: string | null;
  location: string | null;
  status: string;
  views: number;
  publishedAt: string | null;
  createdAt: string;
}

export interface EventListResponse {
  status: number;
  items: EventItem[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface EventDetailResponse {
  status: number;
  data: EventItem & {
    metaTitle: string | null;
    metaDescription: string | null;
    metaKeywords: string[];
  };
}

export async function fetchEventList(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  tag?: string;
  upcoming?: string;
  sortOrder?: string;
}) {
  const { data } = await AxiosClient.get("/events", { params });
  return data as EventListResponse;
}

export async function fetchEventBySlug(slug: string) {
  const { data } = await AxiosClient.get(`/events/slug/${slug}`);
  return data as EventDetailResponse;
}

export async function fetchEventFilterOptions() {
  const { data } = await AxiosClient.get("/events/filter-options");
  return data.data as {
    tags: string[];
  };
}
