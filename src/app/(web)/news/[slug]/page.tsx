/** @format */

"use client";

import { useParams } from "next/navigation";
import Container from "@/components/atomic/container";
import { Calendar, ArrowLeft, User, Eye } from "lucide-react";
import { useArticleBySlug } from "@/services/article/hook";

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data, isLoading } = useArticleBySlug(slug);
  const article = data?.data;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Container>
      {/* Hero */}
      <section className="bg-brand-dark text-white py-16 px-[5%] md:px-[7%] lg:px-[10%] w-full">
        <div className="max-w-4xl mx-auto">
          <a
            href="/news"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to News
          </a>

          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-white/20 rounded w-3/4" />
              <div className="h-4 bg-white/20 rounded w-1/3" />
            </div>
          ) : article ? (
            <>
              <h1 className="text-[28px] md:text-[40px] font-bold mb-4 leading-tight">
                {article.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <span className="flex items-center gap-1.5">
                  <User size={14} />
                  {article.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {formatDate(article.publishedAt || article.createdAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye size={14} />
                  {article.views} views
                </span>
              </div>
            </>
          ) : (
            <h1 className="text-2xl font-bold">Article Not Found</h1>
          )}
        </div>
      </section>

      {/* Featured Image */}
      {article?.featuredImage && (
        <section className="px-[5%] md:px-[7%] lg:px-[10%] w-full">
          <div className="max-w-4xl mx-auto -mt-8">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg"
            />
          </div>
        </section>
      )}

      {/* Content */}
      <section className="px-[5%] md:px-[7%] lg:px-[10%] py-12 w-full">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-slate-200 rounded w-full" />
              <div className="h-4 bg-slate-200 rounded w-3/6" />
              <div className="h-4 bg-slate-200 rounded w-4/5" />
              <div className="h-4 bg-slate-200 rounded w-full" />
              <div className="h-4 bg-slate-200 rounded w-3/4" />
            </div>
          ) : article ? (
            <>
              {article.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium text-brand-dark bg-brand-dark/10 px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div
                className="prose prose-slate max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-brand-dark"
                dangerouslySetInnerHTML={{
                  __html: article.content || "<p>No content available.</p>",
                }}
              />
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-slate-500 text-lg">Artikel tidak ditemukan</p>
              <a
                href="/news"
                className="inline-flex items-center gap-2 text-brand-dark font-semibold mt-4"
              >
                <ArrowLeft size={16} />
                Kembali ke News
              </a>
            </div>
          )}
        </div>
      </section>
    </Container>
  );
}
