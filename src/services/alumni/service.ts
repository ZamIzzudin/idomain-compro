import AxiosClient from "@/lib/axios";

export interface AlumniItem {
  id: number;
  name: string;
  email: string | null;
  contactNumber: string | null;
  graduationYear: number;
  degree: string | null;
  specialization: string | null;
  institution: string | null;
  photo: string | null;
}

export interface AlumniListResponse {
  status: number;
  items: AlumniItem[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export async function fetchAlumniList(params: {
  page?: number;
  perPage?: number;
  q?: string;
  graduationYear?: number;
  specialization?: string;
  sort?: string;
}) {
  const { data } = await AxiosClient.get("/alumni", { params });
  return data as AlumniListResponse;
}

export async function fetchAlumniFilterOptions() {
  const { data } = await AxiosClient.get("/alumni/filter-options");
  return data.data as {
    years: number[];
    specializations: string[];
  };
}

export async function fetchAlumniDetail(id: number) {
  const { data } = await AxiosClient.get(`/alumni/${id}`);
  return data.data as AlumniItem;
}

export async function registerAlumni(payload: {
  name: string;
  email: string;
  password: string;
  contactNumber?: string | null;
  graduationYear: number;
  degree?: string | null;
  specialization?: string | null;
  institution?: string | null;
}) {
  const { data } = await AxiosClient.post("/alumni/register", payload);
  return data;
}

export async function loginAlumni(payload: {
  email: string;
  password: string;
}) {
  const { data } = await AxiosClient.post("/alumni/login", payload);
  return data as {
    status: number;
    message: string;
    data: {
      id: number;
      name: string;
      email: string;
      access_token: string;
    };
  };
}
