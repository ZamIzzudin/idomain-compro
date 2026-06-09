import { useQuery } from "@tanstack/react-query";
import { fetchPublishedTestimonials } from "./service";

export const usePublishedTestimonials = () => {
  return useQuery({
    queryKey: ["published_testimonials"],
    queryFn: fetchPublishedTestimonials,
    staleTime: 5 * 60 * 1000,
  });
};
