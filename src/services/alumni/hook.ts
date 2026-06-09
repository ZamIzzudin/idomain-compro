import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchAlumniList, fetchAlumniFilterOptions, fetchAlumniDetail, registerAlumni, loginAlumni } from "./service";

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
