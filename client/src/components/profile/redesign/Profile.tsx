"use client";

import { motion, AnimatePresence } from 'motion/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, Book, FileText } from 'lucide-react';
import { useAppStore } from '@/src/lib/store/store';
import UserDetails from './UserDetails';
import BookShelft from './BookShelft';
import ArticleShelft from './ArticleShelft';

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

  const isBooks = activeTab === 'Bookshelf';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-screen"
    >
      <div className="max-w-5xl mx-auto px-4 pt-0 pb-20 space-y-12">
        <UserDetails />

        {isAuthor && (
          <div className="w-full">
            {/* Tab Navigation with smooth indicator */}
            <div className="flex flex-wrap items-center justify-between border-b border-primary/5 mb-12 gap-6">
              <div className="flex gap-8 sm:gap-12">
                {[
                  { id: 'Bookshelf', label: 'Bookshelf' },
                  { id: 'Articles', label: 'Articles' }
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all
                    ${activeTab === tab.id
                        ? 'text-primary'
                        : 'text-primary/60 hover:text-primary'
                      } cursor-pointer`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.span 
                        layoutId="activeTabBorder"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-none" 
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              <motion.button
                onClick={() => router.push(isBooks ? '/add-book' : '/post-article')}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="mb-4 flex items-center gap-2.5 bg-primary text-white px-7 py-3 rounded-2xl font-sans font-black text-xs uppercase tracking-widest hover:bg-[#11325C] hover:shadow-xl hover:shadow-primary/30 transition-all cursor-pointer shadow-lg shadow-primary/20"
              >
                <Plus size={14} className="stroke-[3px]" />
                {isBooks ? 'Add Book' : 'Post Article'}
              </motion.button>
            </div>

            {/* Content Area */}
            <main className="min-h-[50vh]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  {isBooks ? (
                    <BookShelft />
                  ) : (
                    <ArticleShelft />
                  )}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Profile;
