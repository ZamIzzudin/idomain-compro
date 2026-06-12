import AxiosClient from "@/lib/axios";

export interface WorkHistoryItem {
  id: number;
  alumniId: number;
  institutionName: string;
  startYear: number;
  endYear: number | null;
  province: string | null;
  city: string | null;
}

export interface AlumniItem {
  id: number;
  name: string;
  email: string | null;
  contactNumber: string | null;
  graduationYear: number;
  batch: number | null;
  degreePrefix: string | null;
  degreeSuffix: string | null;
  specialization: string | null;
  province: string | null;
  city: string | null;
  photo: string | null;
  isApproved: boolean;
  emailVisible?: boolean;
  contactNumberVisible?: boolean;
  workHistories: WorkHistoryItem[];
}

export interface AlumniListResponse {
  status: number;
  items: AlumniItem[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface AlumniAuthData {
  id: number;
  name: string;
  email: string;
  photo: string | null;
  isApproved: boolean;
  access_token: string;
}

export async function fetchAlumniList(params: {
  page?: number;
  perPage?: number;
  q?: string;
  graduationYear?: number;
  specialization?: string;
  province?: string;
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
    provinces: string[];
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
  batch?: number | null;
  degreePrefix?: string | null;
  degreeSuffix?: string | null;
  specialization?: string | null;
  province?: string | null;
  city?: string | null;
  photo?: string | null;
}) {
  const { data } = await AxiosClient.post("/alumni/register", payload);
  return data;
}

export async function loginAlumni(payload: {
  email: string;
  password: string;
}) {
  const { data } = await AxiosClient.post("/alumni/login", payload);
  return data as { status: number; message: string; data: AlumniAuthData };
}

export async function fetchMyProfile() {
  const { data } = await AxiosClient.get("/alumni/me");
  return data.data as AlumniItem;
}

export async function updateMyProfile(payload: {
  name?: string;
  email?: string | null;
  contactNumber?: string | null;
  graduationYear?: number;
  batch?: number | null;
  degreePrefix?: string | null;
  degreeSuffix?: string | null;
  specialization?: string | null;
  province?: string | null;
  city?: string | null;
  password?: string;
  photo?: string | null;
  removePhoto?: boolean;
}) {
  const { data } = await AxiosClient.put("/alumni/me", payload);
  return data.data as AlumniItem;
}

// Work History API calls
export async function fetchMyWorkHistories() {
  const { data } = await AxiosClient.get("/alumni/me/work-histories");
  return data.data as WorkHistoryItem[];
}

export async function createWorkHistory(payload: {
  institutionName: string;
  startYear: number;
  endYear?: number | null;
  province?: string | null;
  city?: string | null;
}) {
  const { data } = await AxiosClient.post("/alumni/me/work-histories", payload);
  return data.data as WorkHistoryItem;
}

export async function updateWorkHistory(
  id: number,
  payload: {
    institutionName?: string;
    startYear?: number;
    endYear?: number | null;
    province?: string | null;
    city?: string | null;
  }
) {
  const { data } = await AxiosClient.put(`/alumni/me/work-histories/${id}`, payload);
  return data.data as WorkHistoryItem;
}

export async function deleteWorkHistory(id: number) {
  const { data } = await AxiosClient.delete(`/alumni/me/work-histories/${id}`);
  return data;
}

export interface AlumniStats {
  total: number;
  byProvince: Array<{ province: string; count: number }>;
  byYear: Array<{ year: number; count: number }>;
  byBatch: Array<{ batch: number; count: number }>;
  bySpecialization: Array<{ specialization: string; count: number }>;
}

export async function fetchAlumniStats() {
  const { data } = await AxiosClient.get("/alumni/stats");
  return data.data as AlumniStats;
}

export interface AlumniLookupItem {
  id: number;
  name: string;
  graduationYear: number;
  batch: number | null;
  degreePrefix: string | null;
  degreeSuffix: string | null;
  specialization: string | null;
  province: string | null;
  city: string | null;
  contactNumber: string | null;
  photo: string | null;
}

export async function lookupAlumni(name: string, batch: number) {
  const { data } = await AxiosClient.get("/alumni/lookup", {
    params: { name, batch },
  });
  return data.data as AlumniLookupItem[];
}

export async function claimAlumni(id: number, payload: {
  email: string;
  password: string;
  contactNumber?: string | null;
  batch?: number | null;
  degreePrefix?: string | null;
  degreeSuffix?: string | null;
  specialization?: string | null;
  province?: string | null;
  city?: string | null;
  photo?: string | null;
}) {
  const { data } = await AxiosClient.post(`/alumni/claim/${id}`, payload);
  return data;
}
