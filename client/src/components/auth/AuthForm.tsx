'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
    <div className="w-full max-w-[560px] mx-auto p-6 sm:p-8 rounded-2xl bg-white/40 backdrop-blur-md">
      <div className="text-center mb-3">
        <h1 className="text-[26px] font-extrabold text-[#0a192f] tracking-tight mb-1">
          {authType === 'login' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="text-gray-500 italic font-serif text-[14px]">
          {authType === 'login' ? 'Sign in to access your library' : 'Join the literary society'}
        </p>
      </div>

      <form className="space-y-4" onSubmit={(e) => handleSubmit(e, authType, formData, setLoading, setUser, router)}>
       { authType === "signup" && <div className="flex p-1 space-x-1 bg-gray-100/50 rounded-xl mb-6">
          <input type="hidden" name="role" value={role} />
          <button
            type="button"
            onClick={() => {
              setRole('reader')
              setFormData((prev) => ({
                ...prev,
                role: 'reader'
              }))
            }
            }
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${role === 'reader' ? 'bg-white text-[#0a192f] shadow-sm ring-1 ring-gray-200/50' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Reader
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('author')
              setFormData((prev) => ({
                ...prev,
                role: 'author'
              }))
            }
            }

            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${role === 'author' ? 'bg-white text-[#0a192f] shadow-sm ring-1 ring-gray-200/50' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Author
          </button>
        </div>}

        {
          authType === 'signup' && (
            <div className="flex flex-col items-center justify-center space-y-2 mb-2">
              <div className="relative h-16 w-16 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center overflow-hidden hover:bg-gray-50 transition-colors cursor-pointer group">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <svg
                    className="h-5 w-5 text-gray-400 group-hover:text-gray-500 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
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
              <span className="text-[9px] uppercase font-bold tracking-[0.15em] text-slate-500">
                Profile Photo
              </span>
            </div>
          )
        }

        {
          authType === 'signup' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
              <InputField
                disabled={isLoading}
                id="name"
                label="Full Name"
                value={formData.name}
                type="text"
                placeholder="E.g. Julian Barnes"
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
              <InputField
                disabled={isLoading}
                id="email"
                label="Email Address"
                type="email"
                value={formData.email}
                placeholder="julian@bibliophile.com"
                onChange={(e) => handleInputChange(e, setFormData)}
                className="md:col-span-2"
              />
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
                label="Confirm"
                value={formData.confirmPassword}
                type={passwordShow ? "text" : "password"}
                placeholder="••••••••"
                onChange={(e) => handleInputChange(e, setFormData)}
                rightElement={
                  <PasswordToggleButton show={passwordShow} onToggle={() => setPasswordShow(!passwordShow)} />
                }
              />
            </div>
          ) : (
            <div className="space-y-4">
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
                <Link href="/forgot-password" className="text-xs font-semibold text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>
          )
        }

        {
          authType === 'signup' && (
            <div className="flex items-start pt-1 pb-1">
              <div className="flex items-center h-4 mt-0.5">
                <input
                  id="terms"
                  aria-describedby="terms-description"
                  name="terms"
                  type="checkbox"
                  className="focus:ring-2 focus:ring-[#0a192f] focus:ring-offset-1 h-3.5 w-3.5 text-[#0a192f] border-gray-300 rounded-[4px] cursor-pointer"
                />
              </div>
              <div className="ml-2.5 text-[12px] leading-relaxed">
                <label htmlFor="terms" className="text-gray-500 cursor-pointer">
                  I agree to the <a href="#" className="font-semibold text-[#0a192f] hover:text-black hover:underline transition-colors">Terms of Service</a> and <a href="#" className="font-semibold text-[#0a192f] hover:text-black hover:underline transition-colors">Privacy Policy</a>.
                </label>
              </div>
            </div>
          )
        }

        <button
          disabled={isLoading}
          type="submit"
          className="w-full flex justify-center items-center py-[11px] px-4 rounded-xl shadow-[0_4px_14px_0_rgba(10,25,47,0.25)] text-[14px] font-bold text-white bg-primary hover:bg-primary/80 hover:shadow-[0_6px_20px_0_rgba(10,25,47,0.3)] hover:-translate-y-px focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[0_4px_14px_0_rgba(10,25,47,0.25)]"
        >
          {isLoading && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          <span>{authType === 'login' ? 'Sign In' : 'Create Account'}</span>
        </button>

        <div className="mt-5 pt-3 border-t border-gray-100/50 text-center text-[13px] text-gray-500 flex flex-col items-center space-y-1">
          <p>
            {authType === 'login' ? "Don't have an account?" : "Already have an account?"}
          </p>
          <a
            onClick={() => setAuthType(authType === 'login' ? "signup" : "login")}
            className="font-extrabold text-[#0a192f] hover:text-black hover:underline transition-colors cursor-pointer"
          >
            {authType === 'login' ? 'Create one here' : 'Sign in here'}
          </a>
        </div>
      </form >
    </div >
  );
};

export default AuthForm;
