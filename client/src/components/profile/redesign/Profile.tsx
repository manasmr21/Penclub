"use client";

import React, { useEffect, useState } from 'react'
import UserDetails from './UserDetails'
import BookShelft from './BookShelft'
import ArticleShelft from './ArticleShelft'
import { Plus } from 'lucide-react';
import { useAppStore } from '@/src/lib/store/store';
import { fetchAuthorArticles, fetchAuthorBooks } from "@/src/lib/profile-stats-api";
import type { AuthorArticle, AuthorBook } from "@/src/lib/profile-stats-api";

const Profile = () => {
  const user = useAppStore((state) => state.user);
  const isAuthor = user?.role === "author";
  const [activeTab, setActiveTab] = useState<'Bookshelf' | 'Articles'>('Bookshelf');
  const [books, setBooks] = useState<AuthorBook[]>([]);
  const [articles, setArticles] = useState<AuthorArticle[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [loadingArticles, setLoadingArticles] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadAuthorContent = async () => {
      if (!isAuthor || !user?.id) {
        if (isMounted) {
          setBooks([]);
          setArticles([]);
        }
        return;
      }

      setLoadingBooks(true);
      setLoadingArticles(true);

      try {
        const [nextBooks, nextArticles] = await Promise.all([
          fetchAuthorBooks(user.id),
          fetchAuthorArticles(user.id),
        ]);

        if (isMounted) {
          setBooks(nextBooks);
          setArticles(nextArticles);
        }
      } catch {
        if (isMounted) {
          setBooks([]);
          setArticles([]);
        }
      } finally {
        if (isMounted) {
          setLoadingBooks(false);
          setLoadingArticles(false);
        }
      }
    };

    void loadAuthorContent();

    return () => {
      isMounted = false;
    };
  }, [isAuthor, user?.id]);

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
              <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-bold text-[11px] tracking-[0.15em] uppercase rounded-full hover:bg-primary/90 transition-all duration-300 shadow-[0_4px_12px_rgba(13,56,125,0.2)] hover:shadow-[0_6px_20px_rgba(13,56,125,0.3)] hover:-translate-y-0.5 cursor-pointer group">
                <Plus size={16} className="transition-transform group-hover:rotate-90" />
                {activeTab === 'Bookshelf' ? 'Add Book' : 'Post Article'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 min-h-[70vh]">
        {isAuthor && activeTab === 'Bookshelf' && <BookShelft books={books} loading={loadingBooks} />}
        {isAuthor && activeTab === 'Articles' && <ArticleShelft articles={articles} loading={loadingArticles} />}
      </div>
    </div>
  )
}

export default Profile
