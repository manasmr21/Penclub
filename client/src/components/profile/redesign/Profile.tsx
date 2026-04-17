"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import profileBg from "@/public/images/Profile-bg.jpg";
import { useAppStore } from '@/src/lib/store/store';
import UserDetails from './UserDetails';
import BookShelft from './BookShelft';
import ArticleShelft from './ArticleShelft';

const TABS = ['Bookshelf', 'Articles'] as const;

const Profile = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    user,
    activeTab,
    setActiveTab,
    articlesLoaded,
    fetchBooks,
    fetchArticles,
  } = useAppStore();
  const isAuthor = user?.role === "author";

  // --- Effects ---
  useEffect(() => {
    if (isAuthor && user?.id) {
      void fetchBooks(user.id, 1);
    }
  }, [isAuthor, user?.id, fetchBooks]);

  useEffect(() => {
    const tab = searchParams.get("tab")?.toLowerCase();
    if (tab === "articles") setActiveTab("Articles");
    else if (tab === "bookshelf") setActiveTab("Bookshelf");
  }, [searchParams, setActiveTab]);

  useEffect(() => {
    if (isAuthor && user?.id && activeTab === "Articles" && !articlesLoaded) {
      void fetchArticles(user.id);
    }
  }, [isAuthor, user?.id, activeTab, articlesLoaded, fetchArticles]);

  // --- Actions ---
  const isBooks = activeTab === 'Bookshelf';

  return (
    <div className="relative min-h-screen bg-[#faf8e3]">
      <div className="relative z-10 main-container">
        <UserDetails />

        {/* Show Author-specific Tabs and Content only if isAuthor is true */}
        {isAuthor && (
          <div className="relative mt-12 shadow-sm rounded-3xl overflow-hidden min-h-[500px]">
            {/* Background Texture for this container */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.06] select-none">
              <Image
                src={profileBg}
                alt=""
                fill
                className="object-cover"
              />
            </div>

            <div className="relative z-10">
              {/* Tabs Navigation */}
              <nav className="mb-6 border-b border-primary px-3 sm:px-6 pt-6">
                <div className="mx-auto flex max-w-5xl flex-col gap-4 pb-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-6 overflow-x-auto no-scrollbar sm:gap-10">
                    {TABS.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`relative pb-3 border-b-2 text-xs uppercase tracking-widest transition-all sm:text-sm font-label
                        ${activeTab === tab
                            ? 'text-primary font-bold border-[var(--color-primary)]'
                            : 'text-on-surface-variant border-transparent opacity-60 hover:opacity-100 hover:text-primary'
                          }`}
                      >
                        {tab}
                        {activeTab === tab && (
                          <span className="absolute -top-1 -right-4 h-1.5 w-1.5 rounded-full bg-tertiary" />
                        )}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => router.push(isBooks ? '/add-book' : '/post-article')}
                    className="group flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg"
                  >
                    <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                    {isBooks ? 'Add Book' : 'Post Article'}
                  </button>
                </div>
              </nav>

              {/* Content Area */}
              <main className="min-h-[70vh]">
                {isBooks ? (
                  <BookShelft />
                ) : (
                  <ArticleShelft />
                )}
              </main>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
