import type { MetadataRoute } from "next";
import AxiosClient from "@/lib/axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://idomain.example.com";

const STATIC_ROUTES = ["", "/about", "/alumni", "/career", "/contact", "/events", "/news"];

async function fetchSlugs(endpoint: string): Promise<string[]> {
  try {
    const { data } = await AxiosClient.get(endpoint, {
      params: { limit: 1000, status: "PUBLISHED", sortOrder: "desc" },
    });
    return (data.items || []).map((item: { slug: string }) => item.slug);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified,
    changeFrequency: "daily",
    priority: route === "" ? 1.0 : 0.8,
  }));

  const [careerSlugs, eventSlugs, articleSlugs] = await Promise.all([
    fetchSlugs("/careers"),
    fetchSlugs("/events"),
    fetchSlugs("/articles"),
  ]);

  const careerEntries: MetadataRoute.Sitemap = careerSlugs.map((slug) => ({
    url: `${BASE_URL}/career/${slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const eventEntries: MetadataRoute.Sitemap = eventSlugs.map((slug) => ({
    url: `${BASE_URL}/events/${slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const articleEntries: MetadataRoute.Sitemap = articleSlugs.map((slug) => ({
    url: `${BASE_URL}/news/${slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticEntries, ...careerEntries, ...eventEntries, ...articleEntries];
}
