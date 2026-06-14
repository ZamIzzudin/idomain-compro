import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchCareerList,
  fetchCareerBySlug,
  fetchCareerFilterOptions,
  fetchCategoryList,
  createCareer,
  fetchMyPreferences,
  updateMyPreferences,
  fetchNotifications,
  fetchUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  deleteCareer,
  updateCareer,
} from "./service";
import { isAuthenticated } from "@/lib/auth";

export const useCareerList = (params: {
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
}) => {
  return useQuery({
    queryKey: ["career_list", params],
    queryFn: () => fetchCareerList(params),
    refetchOnWindowFocus: false,
  });
};

export const useCareerBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["career_detail", slug],
    queryFn: () => fetchCareerBySlug(slug),
    enabled: !!slug,
    refetchOnWindowFocus: false,
  });
};

export const useCareerFilterOptions = () => {
  return useQuery({
    queryKey: ["career_filter_options"],
    queryFn: fetchCareerFilterOptions,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCategoryList = () => {
  return useQuery({
    queryKey: ["category_list"],
    queryFn: fetchCategoryList,
    staleTime: 30 * 60 * 1000,
  });
};

export const useCreateCareer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: FormData) => createCareer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career_list"] });
    },
  });
};

export const useUpdateCareer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: FormData }) =>
      updateCareer(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career_list"] });
    },
  });
};

export const useDeleteCareer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCareer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career_list"] });
    },
  });
};

// Notification hooks
export const useNotifications = (params: {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}) => {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: () => fetchNotifications(params),
    enabled: typeof window !== "undefined" && isAuthenticated(),
    refetchOnWindowFocus: true,
    refetchInterval: 30000,
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ["unread_count"],
    queryFn: fetchUnreadCount,
    enabled: typeof window !== "undefined" && isAuthenticated(),
    refetchInterval: 30000,
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread_count"] });
    },
  });
};

export const useMarkAllRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread_count"] });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread_count"] });
    },
  });
};

// Preference hooks
export const useMyPreferences = () => {
  return useQuery({
    queryKey: ["my_preferences"],
    queryFn: fetchMyPreferences,
    enabled: typeof window !== "undefined" && isAuthenticated(),
    refetchOnWindowFocus: false,
  });
};

export const useUpdatePreferences = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMyPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my_preferences"] });
    },
  });
};
