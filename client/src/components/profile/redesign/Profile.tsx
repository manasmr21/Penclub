"use client";

import React, { useCallback, useEffect, useState } from 'react'
import UserDetails from './UserDetails'
import BookShelft from './BookShelft'
import ArticleShelft from './ArticleShelft'
import { Plus } from 'lucide-react';
import { useAppStore } from '@/src/lib/store/store';
import { fetchAuthorArticles, fetchAuthorBooksPage } from "@/src/lib/profile-stats-api";
import type { AuthorArticle, AuthorBook } from "@/src/lib/profile-stats-api";
import { useRouter, useSearchParams } from 'next/navigation';

function sortBooksNewestFirst(items: AuthorBook[]) {
  return [...items].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });
}

const Profile = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAppStore((state) => state.user);
  const isAuthor = user?.role === "author";
  const [activeTab, setActiveTab] = useState<'Bookshelf' | 'Articles'>('Bookshelf');
  const [books, setBooks] = useState<AuthorBook[]>([]);
  const [articles, setArticles] = useState<AuthorArticle[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [loadingMoreBooks, setLoadingMoreBooks] = useState(false);
  const [booksPage, setBooksPage] = useState(1);
  const [hasMoreBooks, setHasMoreBooks] = useState(true);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [articlesLoaded, setArticlesLoaded] = useState(false);

  const loadBooks = useCallback(async (targetPage = 1) => {
    if (!isAuthor || !user?.id) {
      setBooks([]);
      setBooksPage(1);
      setHasMoreBooks(false);
      return;
    }

    if (targetPage === 1) {
      setLoadingBooks(true);
    } else {
      setLoadingMoreBooks(true);
    }

    try {
      const response = await fetchAuthorBooksPage(user.id, targetPage, 10);

      setBooks((prev) => {
        if (targetPage === 1) return sortBooksNewestFirst(response.books);
        const existing = new Set(prev.map((item) => item.id));
        const incoming = response.books.filter((item) => !existing.has(item.id));
        return sortBooksNewestFirst([...prev, ...incoming]);
      });
      setBooksPage(targetPage);
      setHasMoreBooks(response.pagination?.hasNextPage ?? false);
    } catch {
      setBooks([]);
      setHasMoreBooks(false);
    } finally {
      setLoadingBooks(false);
      setLoadingMoreBooks(false);
    }
  }, [isAuthor, user?.id]);

  const loadArticles = useCallback(async () => {
    if (!isAuthor || !user?.id) {
      setArticles([]);
      setArticlesLoaded(false);
      return;
    }

    setLoadingArticles(true);

    try {
      const nextArticles = await fetchAuthorArticles(user.id);
      setArticles(nextArticles);
      setArticlesLoaded(true);
    } catch {
      setArticles([]);
      setLoadingArticles(false);
      setArticlesLoaded(true);
      return;
    } finally {
      setLoadingArticles(false);
    }
  }, [isAuthor, user?.id]);

  useEffect(() => {
    void loadBooks(1);
  }, [loadBooks]);

  useEffect(() => {
    const tabParam = (searchParams.get("tab") || "").toLowerCase();
    if (tabParam === "articles") {
      setActiveTab("Articles");
      return;
    }
    if (tabParam === "bookshelf") {
      setActiveTab("Bookshelf");
    }
  }, [searchParams]);

  useEffect(() => {
    if (activeTab === "Articles" && !articlesLoaded) {
      void loadArticles();
    }
  }, [activeTab, articlesLoaded, loadArticles]);

  const handleBooksChanged = useCallback(async () => {
    await loadBooks(1);
  }, [loadBooks]);

  const handleArticlesChanged = useCallback(async () => {
    await loadArticles();
  }, [loadArticles]);

  const handleLoadMoreBooks = useCallback(async () => {
    if (!hasMoreBooks || loadingMoreBooks || loadingBooks) return;
    await loadBooks(booksPage + 1);
  }, [booksPage, hasMoreBooks, loadBooks, loadingBooks, loadingMoreBooks]);

  return (
    <div className='main-container'>
      <UserDetails />

      {isAuthor && (
        <div className="mb-12 border-b border-outline-variant/10 mt-12 px-6">
          <div className="max-w-5xl mx-auto flex justify-between items-center overflow-x-auto no-scrollbar">
            <div className="flex gap-10">
              {(['Bookshelf', 'Articles'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 font-label text-sm uppercase tracking-widest relative transition-all duration-300 ease-out cursor-pointer ${activeTab === tab
                    ? 'text-primary font-bold border-b-2 border-primary opacity-100'
                    : 'text-on-surface-variant opacity-60 hover:opacity-100 hover:text-primary border-b-2 border-transparent'
                    }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute -top-1 -right-4 w-1.5 h-1.5 bg-tertiary rounded-full"></span>
                  )}
                </button>
              ))}
            </div>
            <div className="pb-4">
              <button
                onClick={() => router.push(activeTab === 'Bookshelf' ? '/add-book' : '/post-article')}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-bold text-[11px] tracking-[0.15em] uppercase rounded-full hover:bg-primary/90 transition-all duration-300 shadow-[0_4px_12px_rgba(13,56,125,0.2)] hover:shadow-[0_6px_20px_rgba(13,56,125,0.3)] hover:-translate-y-0.5 cursor-pointer group"
              >
                <Plus size={16} className="transition-transform group-hover:rotate-90" />
                {activeTab === 'Bookshelf' ? 'Add Book' : 'Post Article'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 min-h-[70vh]">
        {isAuthor && activeTab === 'Bookshelf' && (
          <BookShelft
            books={books}
            loading={loadingBooks}
            loadingMore={loadingMoreBooks}
            hasMore={hasMoreBooks}
            onLoadMore={handleLoadMoreBooks}
            onChanged={handleBooksChanged}
          />
        )}
        {isAuthor && activeTab === 'Articles' && (
          <ArticleShelft articles={articles} loading={loadingArticles} onChanged={handleArticlesChanged} />
        )}
      </div>
    </div>
  )
}

export default Profile
