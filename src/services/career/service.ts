import AxiosClient from "@/lib/axios";

export interface CareerItem {
  id: number;
  title: string;
  slug: string;
  institutionName: string;
  logo: string | null;
  position: string;
  province: string | null;
  city: string | null;
  jobType: string;
  description: string | null;
  requirements: string | null;
  deadline: string | null;
  recruitmentEmail: string | null;
  recruitmentUrl: string | null;
  contactPerson: string | null;
  contactPhone: string | null;
  categoryId: number;
  status: string;
  views: number;
  publishedAt: string | null;
  createdAt: string;
  category: { id: number; name: string; slug: string; type: string };
  author: { id: number; name: string; photo: string | null };
}

export interface CareerListResponse {
  status: number;
  items: CareerItem[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface CareerDetailResponse {
  status: number;
  data: CareerItem;
}

export interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  type: "KLINIS" | "NON_KLINIS";
  sortOrder: number;
}

export async function fetchCareerList(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  categoryId?: number;
  category?: string;
  jobType?: string;
  province?: string;
  city?: string;
  sortOrder?: string;
}) {
  const { data } = await AxiosClient.get("/careers", { params });
  return data as CareerListResponse;
}

export async function fetchCareerBySlug(slug: string) {
  const { data } = await AxiosClient.get(`/careers/slug/${slug}`);
  return data as CareerDetailResponse;
}

export async function fetchCareerFilterOptions() {
  const { data } = await AxiosClient.get("/careers/filter-options");
  return data.data as {
    provinces: string[];
    jobTypes: string[];
  };
}

export async function fetchCategoryList() {
  const { data } = await AxiosClient.get("/categories");
  return data.data as CategoryItem[];
}

export async function createCareer(payload: FormData) {
  const { data } = await AxiosClient.post("/careers", payload);
  return data;
}

export async function fetchMyCareers() {
  const { data } = await AxiosClient.get("/careers", {
    params: { authorId: "me" },
  });
  return data as CareerListResponse;
}

export async function updateCareer(id: number, payload: FormData) {
  const { data } = await AxiosClient.put(`/careers/${id}`, payload);
  return data;
}

export async function deleteCareer(id: number) {
  const { data } = await AxiosClient.delete(`/careers/${id}`);
  return data;
}

// Notification services
export interface NotificationItem {
  id: number;
  type: string;
  title: string;
  body: string | null;
  url: string | null;
  isRead: boolean;
  careerId: number | null;
  createdAt: string;
}

export interface NotificationListResponse {
  status: number;
  items: NotificationItem[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export async function fetchNotifications(params: {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}) {
  const { data } = await AxiosClient.get("/notifications", { params });
  return data as NotificationListResponse;
}

export async function fetchUnreadCount() {
  const { data } = await AxiosClient.get("/notifications/unread-count");
  return data.data as { count: number };
}

export async function markNotificationRead(id: number) {
  const { data } = await AxiosClient.put(`/notifications/${id}/read`);
  return data;
}

export async function markAllNotificationsRead() {
  const { data } = await AxiosClient.put("/notifications/read-all");
  return data;
}

export async function deleteNotification(id: number) {
  const { data } = await AxiosClient.delete(`/notifications/${id}`);
  return data;
}

// Alumni preference services
export async function fetchMyPreferences() {
  const { data } = await AxiosClient.get("/alumni/me/preferences");
  return data.data as {
    notifEnabled: boolean;
    notifReceiveAll: boolean;
    preferredCategories: string[];
  };
}

export async function updateMyPreferences(payload: {
  notifEnabled?: boolean;
  notifReceiveAll?: boolean;
  preferredCategories?: string[];
}) {
  const { data } = await AxiosClient.put("/alumni/me/preferences", payload);
  return data;
}
