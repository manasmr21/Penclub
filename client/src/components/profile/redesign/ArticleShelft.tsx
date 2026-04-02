import React from "react";
import type { AuthorArticle } from "@/src/lib/profile-stats-api";

type ArticleShelftProps = {
  articles: AuthorArticle[];
  loading?: boolean;
};

function truncate(text: string, max = 120) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}...`;
}

const ArticleShelft = ({ articles, loading = false }: ArticleShelftProps) => {
  if (loading) {
    return (
      <div className="w-full pb-16">
        <div className="max-w-5xl mx-auto text-center py-20 text-on-surface-variant/70">
          Loading articles...
        </div>
      </div>
    );
  }

  if (!articles.length) {
    return (
      <div className="w-full pb-16">
        <div className="max-w-5xl mx-auto text-center py-20 text-on-surface-variant/70">
          No articles found
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-16 px-6">
      <div className="max-w-5xl mx-auto grid gap-5">
        {articles.map((article) => (
          <article key={article.id} className="rounded-2xl border border-outline-variant/20 bg-white p-5 shadow-sm">
            <h3 className="text-xl font-semibold text-primary">{article.title}</h3>
            <p className="mt-2 text-sm text-on-surface-variant/80 leading-relaxed">
              {truncate(article.content || "")}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(article.tags || []).map((tag) => (
                <span key={`${article.id}-${tag}`} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">
                  #{tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ArticleShelft;
