import AxiosClient from "@/lib/axios";

export interface TestimonialItem {
  id: number;
  name: string;
  institution: string | null;
  testimonial: string;
  photo: string | null;
}

export async function fetchPublishedTestimonials() {
  const { data } = await AxiosClient.get("/testimonials/published");
  return data.data as TestimonialItem[];
}
