import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAlumniList,
  fetchAlumniFilterOptions,
  fetchAlumniDetail,
  registerAlumni,
  loginAlumni,
  fetchMyProfile,
  updateMyProfile,
  fetchMyWorkHistories,
  createWorkHistory,
  updateWorkHistory,
  deleteWorkHistory,
  fetchAlumniStats,
  lookupAlumni,
  claimAlumni,
} from "./service";
import { isAuthenticated } from "@/lib/auth";

export const useAlumniList = (params: {
  page?: number;
  perPage?: number;
  q?: string;
  graduationYear?: number;
  specialization?: string;
  province?: string;
  city?: string;
  sort?: string;
}) => {
  return useQuery({
    queryKey: ["alumni_list", params],
    queryFn: () => fetchAlumniList(params),
    refetchOnWindowFocus: false,
  });
};

export const useAlumniFilterOptions = (province?: string) => {
  return useQuery({
    queryKey: ["alumni_filter_options", province],
    queryFn: () => fetchAlumniFilterOptions(province),
    staleTime: 5 * 60 * 1000,
  });
};

export const useAlumniDetail = (id: number | null) => {
  return useQuery({
    queryKey: ["alumni_detail", id],
    queryFn: () => fetchAlumniDetail(id!),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

export const useRegisterAlumni = () => {
  return useMutation({
    mutationKey: ["register_alumni"],
    mutationFn: registerAlumni,
  });
};

export const useLoginAlumni = () => {
  return useMutation({
    mutationKey: ["login_alumni"],
    mutationFn: loginAlumni,
  });
};

export const useMyProfile = () => {
  return useQuery({
    queryKey: ["alumni_me"],
    queryFn: fetchMyProfile,
    enabled: typeof window !== "undefined" && isAuthenticated(),
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 3;
    },
    refetchOnWindowFocus: false,
  });
};

export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update_alumni_me"],
    mutationFn: updateMyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alumni_me"] });
    },
  });
};

export const useMyWorkHistories = () => {
  return useQuery({
    queryKey: ["my_work_histories"],
    queryFn: fetchMyWorkHistories,
    enabled: typeof window !== "undefined" && isAuthenticated(),
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 3;
    },
    refetchOnWindowFocus: false,
  });
};

export const useCreateWorkHistory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create_work_history"],
    mutationFn: createWorkHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my_work_histories"] });
      queryClient.invalidateQueries({ queryKey: ["alumni_me"] });
    },
  });
};

export const useUpdateWorkHistory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update_work_history"],
    mutationFn: ({ id, ...payload }: { id: number; [key: string]: any }) =>
      updateWorkHistory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my_work_histories"] });
      queryClient.invalidateQueries({ queryKey: ["alumni_me"] });
    },
  });
};

export const useDeleteWorkHistory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete_work_history"],
    mutationFn: deleteWorkHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my_work_histories"] });
      queryClient.invalidateQueries({ queryKey: ["alumni_me"] });
    },
  });
};

export const useAlumniStats = () => {
  return useQuery({
    queryKey: ["alumni_stats"],
    queryFn: fetchAlumniStats,
    staleTime: 5 * 60 * 1000,
  });
};

export const useLookupAlumni = () => {
  return useMutation({
    mutationKey: ["lookup_alumni"],
    mutationFn: ({ name, batch }: { name: string; batch: number }) =>
      lookupAlumni(name, batch),
  });
};

export const useClaimAlumni = () => {
  return useMutation({
    mutationKey: ["claim_alumni"],
    mutationFn: ({ id, ...payload }: { id: number } & Parameters<typeof claimAlumni>[1]) =>
      claimAlumni(id, payload),
  });
};
