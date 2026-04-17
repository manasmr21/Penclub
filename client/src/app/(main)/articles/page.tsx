"use client";

import { useEffect, useState } from "react";
import { fetchAllArticles, type PublicArticle } from "@/src/lib/articles-api";
import Loader from "@/components/Loader";

function truncate(text: string, max = 220) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}...`;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<PublicArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllArticles = async () => {
      setLoading(true);
      try {
        const all: PublicArticle[] = [];
        let page = 1;
        let hasNextPage = true;

        while (hasNextPage) {
          const response = await fetchAllArticles(page, 10);
          all.push(...response.articles);
          hasNextPage = response.pagination?.hasNextPage ?? false;
          page += 1;
        }

        setArticles(all);
      } catch {
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    void loadAllArticles();
  }, []);

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!articles.length) {
    return (
      <div className="main-container pt-24 pb-10">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center text-on-surface-variant/70">No articles found</div>
      </div>
    );
  }

  return (
    <div className="main-container pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-[#1e2741]">Articles</h1>
        <p className="mt-2 text-sm text-[#697282]">Read all published articles from Pen Club authors.</p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {articles.map((article) => (
            <article key={article.id} className="flex h-full flex-col rounded-2xl border border-[#dbe3ef] bg-white p-5 shadow-sm">
              {article.coverImage ? (
                <div className="mb-4 overflow-hidden rounded-xl bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={article.coverImage} alt={article.title} className="h-52 w-full object-cover" />
                </div>
              ) : null}

              <h2 className="text-xl font-semibold text-[#1e2741]">{article.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#3b4a64]">{truncate(article.content || "")}</p>

              {(article.tags || []).length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {(article.tags || []).map((tag) => (
                    <span key={`${article.id}-${tag}`} className="rounded-full border border-[#dbe3ef] bg-[#f5f7fb] px-2.5 py-1 text-xs text-[#1e2741]">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
