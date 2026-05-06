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
    <div className="w-full max-w-[500px] mx-auto p-8 border border-primary/20 bg-card rounded-none shadow-[0_4px_25px_rgba(13,56,125,0.02)]">
      <div className="text-center mb-6 border-b border-primary/15 pb-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary text-center block">
          Pen Club
        </span>
        <h1 className="text-3xl font-serif font-bold text-primary tracking-tight mt-1 mb-1">
          {authType === 'login' ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-xs text-muted-foreground italic font-serif">
          {authType === 'login' ? 'Sign in to access your library' : 'Join the literary society'}
        </p>
      </div>

      <form className="space-y-6" onSubmit={(e) => handleSubmit(e, authType, formData, setLoading, setUser, router)}>
        {authType === "signup" && (
          <div className="flex p-1 bg-primary/5 border border-primary/10 rounded-none mb-6">
            <input type="hidden" name="role" value={role} />
            <button
              type="button"
              onClick={() => {
                setRole('reader');
                setFormData((prev) => ({
                  ...prev,
                  role: 'reader'
                }));
              }}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-none transition-all duration-200 ${
                role === 'reader' ? 'bg-primary text-white' : 'text-primary/50 hover:text-primary'
              }`}
            >
              Reader
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('author');
                setFormData((prev) => ({
                  ...prev,
                  role: 'author'
                }));
              }}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-none transition-all duration-200 ${
                role === 'author' ? 'bg-primary text-white' : 'text-primary/50 hover:text-primary'
              }`}
            >
              Author
            </button>
          </div>
        )}

        {authType === 'signup' && (
          <div className="flex flex-col items-center justify-center space-y-2 mb-4">
            <div className="relative h-20 w-20 rounded-none border border-primary/20 bg-card flex items-center justify-center overflow-hidden hover:bg-primary/5 transition-colors cursor-pointer group">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <svg
                  className="h-6 w-6 text-primary/30 group-hover:text-primary/50 transition-colors"
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
            <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-primary/45">
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
              <Link href="/forgot-password" className="text-[10px] font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors">
                Forgot password?
              </Link>
            </div>
          </div>
        )}

        {authType === 'signup' && (
          <div className="flex items-start pt-1 pb-1">
            <div className="flex items-center h-4 mt-0.5">
              <input
                id="terms"
                aria-describedby="terms-description"
                name="terms"
                type="checkbox"
                className="focus:ring-0 h-3.5 w-3.5 text-primary border-primary/20 rounded-none cursor-pointer accent-primary"
              />
            </div>
            <div className="ml-2.5 text-[11px] leading-relaxed">
              <label htmlFor="terms" className="text-muted-foreground cursor-pointer">
                I agree to the <a href="#" className="font-bold text-primary hover:underline transition-colors">Terms of Service</a> and <a href="#" className="font-bold text-primary hover:underline transition-colors">Privacy Policy</a>.
              </label>
            </div>
          </div>
        )}

        <button
          disabled={isLoading}
          type="submit"
          className="w-full flex justify-center items-center py-3 px-4 rounded-none shadow-md text-xs font-bold uppercase tracking-widest text-white bg-primary border border-primary hover:bg-transparent hover:text-primary transition-all duration-200 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {isLoading && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          <span>{authType === 'login' ? 'Sign In' : 'Create Account'}</span>
        </button>

        <div className="mt-6 pt-4 border-t border-primary/10 text-center text-xs text-muted-foreground flex flex-col items-center space-y-1">
          <p>
            {authType === 'login' ? "Don't have an account yet?" : "Already have an account?"}
          </p>
          <a
            onClick={() => setAuthType(authType === 'login' ? "signup" : "login")}
            className="font-bold text-primary hover:underline transition-colors cursor-pointer uppercase tracking-wider text-[11px]"
          >
            {authType === 'login' ? 'Create one here' : 'Sign in here'}
          </a>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
