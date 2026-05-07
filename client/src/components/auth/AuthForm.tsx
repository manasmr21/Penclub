'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useAppStore } from '@/src/lib/store/store';
import { handleImageChange, handleSubmit, handleInputChange, type AuthFormState } from './authFunctions';

import {
  InputField, PasswordToggleButton
} from './authComponents';

interface AuthFormProps {
  type: 'login' | 'signup';
}

const AuthForm: React.FC<AuthFormProps> = ({ type = 'signup' }) => {
  const router = useRouter();
  const { isLoading, setLoading, setUser } = useAppStore();
  const [authType, setAuthType] = useState(type);
  const [passwordShow, setPasswordShow] = useState(false);
  const [role, setRole] = useState<'reader' | 'author'>('reader');
  const [formData, setFormData] = useState<AuthFormState>({
    name: '',
    username: '',
    identifier: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'reader',
    profilePictureFile: undefined,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  return (
    <div className="w-full max-w-[500px] mx-auto p-8 sm:p-10 border border-gray-100 bg-white rounded-3xl shadow-xl">
      <div className="text-center mb-6 border-b border-gray-100 pb-5">
        <span className="text-[10px] font-sans font-black uppercase tracking-[0.2em] text-[#E6693E] text-center block">
          Pen Club
        </span>
        <h1 className="text-3xl font-serif font-bold text-[#1D4E89] tracking-tight mt-1 mb-1">
          {authType === 'login' ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-xs text-[#1D4E89]/60 italic font-serif">
          {authType === 'login' ? 'Sign in to access your library' : 'Join the literary society'}
        </p>
      </div>

      <form className="space-y-5" onSubmit={(e) => handleSubmit(e, authType, formData, setLoading, setUser, router)}>
        {authType === "signup" && (
          <div className="flex p-1 bg-[#FDF9F0] border border-gray-100 rounded-2xl mb-6 gap-1">
            <input type="hidden" name="role" value={role} />
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setRole('reader');
                setFormData((prev) => ({
                  ...prev,
                  role: 'reader'
                }));
              }}
              className={`flex-1 py-2 text-[10px] font-sans font-black uppercase tracking-widest rounded-xl transition-all duration-200 cursor-pointer ${
                role === 'reader' ? 'bg-[#1D4E89] text-white shadow-md' : 'text-[#1D4E89]/50 hover:text-[#1D4E89]'
              }`}
            >
              Reader
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setRole('author');
                setFormData((prev) => ({
                  ...prev,
                  role: 'author'
                }));
              }}
              className={`flex-1 py-2 text-[10px] font-sans font-black uppercase tracking-widest rounded-xl transition-all duration-200 cursor-pointer ${
                role === 'author' ? 'bg-[#1D4E89] text-white shadow-md' : 'text-[#1D4E89]/50 hover:text-[#1D4E89]'
              }`}
            >
              Author
            </motion.button>
          </div>
        )}

        {authType === 'signup' && (
          <div className="flex flex-col items-center justify-center space-y-2 mb-4">
            <div className="relative h-20 w-20 rounded-2xl border-2 border-gray-100 bg-[#FDF9F0]/60 flex items-center justify-center overflow-hidden hover:border-[#1D4E89] shadow-md transition-all duration-300 cursor-pointer group">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <svg
                  className="h-6 w-6 text-[#1D4E89]/30 group-hover:text-[#1D4E89]/50 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
              <input
                type="file"
                name="profilePictureFile"
                className="absolute inset-0 opacity-0 cursor-pointer text-[0]"
                accept="image/*"
                onChange={(e) => handleImageChange(e, setFormData, setPreviewUrl)}
                title="Upload profile photo"
              />
            </div>
            <span className="text-[9px] uppercase font-sans font-black tracking-[0.2em] text-[#1D4E89]/50">
              Profile Photo
            </span>
          </div>
        )}

        {authType === 'signup' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                disabled={isLoading}
                id="name"
                label="Full Name"
                value={formData.name}
                type="text"
                placeholder="Julian Barnes"
                onChange={(e) => handleInputChange(e, setFormData)}
              />
              <InputField
                disabled={isLoading}
                id="username"
                label="Username"
                value={formData.username}
                type="text"
                placeholder="julian123"
                onChange={(e) => handleInputChange(e, setFormData)}
              />
            </div>
            <InputField
              disabled={isLoading}
              id="email"
              label="Email Address"
              type="email"
              value={formData.email}
              placeholder="julian@bibliophile.com"
              onChange={(e) => handleInputChange(e, setFormData)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                disabled={isLoading}
                id="password"
                value={formData.password}
                label="Password"
                type={passwordShow ? "text" : "password"}
                placeholder="••••••••"
                onChange={(e) => handleInputChange(e, setFormData)}
                rightElement={
                  <PasswordToggleButton show={passwordShow} onToggle={() => setPasswordShow(!passwordShow)} />
                }
              />
              <InputField
                disabled={isLoading}
                id="confirmPassword"
                label="Confirm Password"
                value={formData.confirmPassword}
                type={passwordShow ? "text" : "password"}
                placeholder="••••••••"
                onChange={(e) => handleInputChange(e, setFormData)}
                rightElement={
                  <PasswordToggleButton show={passwordShow} onToggle={() => setPasswordShow(!passwordShow)} />
                }
              />
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <InputField
              disabled={isLoading}
              id="identifier"
              label="Username or Email"
              type="text"
              placeholder="julian@bibliophile.com"
              onChange={(e) => handleInputChange(e, setFormData)}
            />
            <InputField
              disabled={isLoading}
              id="password"
              label="Password"
              type={passwordShow ? "text" : "password"}
              placeholder="••••••••"
              onChange={(e) => handleInputChange(e, setFormData)}
              rightElement={
                <PasswordToggleButton show={passwordShow} onToggle={() => setPasswordShow(!passwordShow)} />
              }
            />
            <div className="text-right">
              <Link href="/forgot-password" className="text-[10px] font-sans font-black uppercase tracking-widest text-[#E6693E] hover:text-[#1D4E89] transition-colors">
                Forgot password?
              </Link>
            </div>
          </div>
        )}

        {authType === 'signup' && (
          <div className="flex items-start pt-1 pb-1">
            <div className="flex items-center h-4 mt-1">
              <input
                id="terms"
                aria-describedby="terms-description"
                name="terms"
                type="checkbox"
                className="focus:ring-0 h-4 w-4 text-[#1D4E89] border-gray-100 rounded-lg cursor-pointer accent-[#1D4E89]"
              />
            </div>
            <div className="ml-2.5 text-[11px] leading-relaxed">
              <label htmlFor="terms" className="text-[#1D4E89]/60 cursor-pointer font-serif">
                I agree to the <a href="#" className="font-bold text-[#1D4E89] hover:underline transition-colors">Terms of Service</a> and <a href="#" className="font-bold text-[#1D4E89] hover:underline transition-colors">Privacy Policy</a>.
              </label>
            </div>
          </div>
        )}

        <motion.button
          disabled={isLoading}
          type="submit"
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          className="w-full flex justify-center items-center py-4 px-4 rounded-2xl shadow-lg shadow-primary/20 text-xs font-sans font-black uppercase tracking-widest text-white bg-[#1D4E89] hover:bg-[#11325C] transition-all duration-300 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {isLoading && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          <span>{authType === 'login' ? 'Sign In' : 'Create Account'}</span>
        </motion.button>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-[#1D4E89]/60 flex flex-col items-center space-y-1">
          <p className="font-serif italic">
            {authType === 'login' ? "Don't have an account yet?" : "Already have an account?"}
          </p>
          <a
            onClick={() => setAuthType(authType === 'login' ? "signup" : "login")}
            className="font-sans font-black text-[#E6693E] hover:text-[#11325C] transition-colors cursor-pointer uppercase tracking-widest text-[11px]"
          >
            {authType === 'login' ? 'Create one here' : 'Sign in here'}
          </a>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
