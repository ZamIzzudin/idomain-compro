import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAlumniList,
  fetchAlumniFilterOptions,
  fetchAlumniDetail,
  registerAlumni,
  loginAlumni,
  fetchMyProfile,
  updateMyProfile,
} from "./service";

export const useAlumniList = (params: {
  page?: number;
  perPage?: number;
  q?: string;
  graduationYear?: number;
  specialization?: string;
  sort?: string;
}) => {
  return useQuery({
    queryKey: ["alumni_list", params],
    queryFn: () => fetchAlumniList(params),
    refetchOnWindowFocus: false,
  });
};

export const useAlumniFilterOptions = () => {
  return useQuery({
    queryKey: ["alumni_filter_options"],
    queryFn: fetchAlumniFilterOptions,
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
    enabled: typeof window !== "undefined" && !!localStorage.getItem("alumni_token"),
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
