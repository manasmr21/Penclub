"use client";

import React, { useState } from 'react'
import UserDetails from './UserDetails'
import BookShelft from './BookShelft'
import Fallback from './Fallback'

const tabs = ['Bookshelf', 'Articles'];

const Profile = () => {
  const [activeTab, setActiveTab] = useState('Bookshelf');

  return (
    <div className='main-container'>
      <UserDetails />

      {/* Tabs Navigation */}
      <div className="mb-12 border-b border-outline-variant/10 mt-12 px-6">
        <div className="max-w-5xl mx-auto flex gap-10 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
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
      </div>

      {/* Tab Content */}
      <div className="mt-8 min-h-[70vh]">
        {activeTab === 'Bookshelf' && <BookShelft />}
        {activeTab === 'Articles' && <Fallback comp="Articles" />}
      </div>
    </div>
  )
}

export default Profile
