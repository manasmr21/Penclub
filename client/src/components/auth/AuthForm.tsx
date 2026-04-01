'use client';

import React, { InputHTMLAttributes, forwardRef, useState } from 'react';

// Reusable Input Field Component
interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  rightElement?: React.ReactNode;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, id, className = '', rightElement, ...props }, ref) => (
    <div className={`flex flex-col space-y-1 w-full ${className}`}>
      <label
        htmlFor={id}
        className="text-[10px] font-extrabold tracking-[0.15em] text-slate-500 uppercase"
      >
        {label}
      </label>
      <div className="relative w-full">
        <input
          id={id}
          ref={ref}
          className={`w-full px-4 py-2.5 text-sm text-gray-800 border border-gray-100/80 rounded-lg shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0a192f] focus:border-transparent transition-all bg-white ${rightElement ? 'pr-10' : ''}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  )
);
InputField.displayName = 'InputField';

const PasswordToggleButton = ({ show, onToggle }: { show: boolean, onToggle: () => void }) => (
  <button
    type="button"
    onClick={onToggle}
    className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
    tabIndex={-1}
  >
    {show ? (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
      </svg>
    ) : (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    )}
  </button>
);
InputField.displayName = 'InputField';

interface AuthFormProps {
  type: 'login' | 'signup';
  onSubmit?: (e: React.FormEvent) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ type = 'signup', onSubmit }) => {
  const [authType, setAuthType] = useState(type)
  const [passwordShow, setPasswordShow] = useState(false);

  return (
    <div className="w-full max-w-[560px] mx-auto p-6 sm:p-8 rounded-2xl bg-white/40 backdrop-blur-md">
      <div className="text-center mb-6">
        <h1 className="text-[26px] font-extrabold text-[#0a192f] tracking-tight mb-1">
          {authType === 'login' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="text-gray-500 italic font-serif text-[14px]">
          {authType === 'login' ? 'Sign in to access your library' : 'Join the literary society'}
        </p>
      </div>

      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSubmit?.(e); }}>
        {authType === 'signup' && (
          <div className="flex flex-col items-center justify-center space-y-2 mb-2">
            <div className="relative h-16 w-16 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center overflow-hidden hover:bg-gray-50 transition-colors cursor-pointer group">
              <svg
                className="h-5 w-5 text-gray-400 group-hover:text-gray-500 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
              />
            </div>
            <span className="text-[9px] uppercase font-bold tracking-[0.15em] text-slate-500">
              Profile Photo
            </span>
          </div>
        )}

        {authType === 'signup' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
            <InputField
              id="fullName"
              label="Full Name"
              type="text"
              placeholder="E.g. Julian Barnes"
            />
            <InputField
              id="username"
              label="Username"
              type="text"
              placeholder="julian123"
            />
            <InputField
              id="email"
              label="Email Address"
              type="email"
              placeholder="julian@bibliophile.com"
              className="md:col-span-2"
            />
            <InputField
              id="password"
              label="Password"
              type={passwordShow ? "text" : "password"}
              placeholder="••••••••"
              rightElement={
                <PasswordToggleButton show={passwordShow} onToggle={() => setPasswordShow(!passwordShow)} />
              }
            />
            <InputField
              id="confirmPassword"
              label="Confirm"
              type={passwordShow ? "text" : "password"}
              placeholder="••••••••"
              rightElement={
                <PasswordToggleButton show={passwordShow} onToggle={() => setPasswordShow(!passwordShow)} />
              }
            />
          </div>
        ) : (
          <div className="space-y-4">
            <InputField
              id="identifier"
              label="Username or Email"
              type="text"
              placeholder="julian@bibliophile.com"
            />
            <InputField
              id="password"
              label="Password"
              type={passwordShow ? "text" : "password"}
              placeholder="••••••••"
              rightElement={
                <PasswordToggleButton show={passwordShow} onToggle={() => setPasswordShow(!passwordShow)} />
              }
            />
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
                className="focus:ring-2 focus:ring-[#0a192f] focus:ring-offset-1 h-3.5 w-3.5 text-[#0a192f] border-gray-300 rounded-[4px] cursor-pointer"
              />
            </div>
            <div className="ml-2.5 text-[12px] leading-relaxed">
              <label htmlFor="terms" className="text-gray-500 cursor-pointer">
                I agree to the <a href="#" className="font-semibold text-[#0a192f] hover:text-black hover:underline transition-colors">Terms of Service</a> and <a href="#" className="font-semibold text-[#0a192f] hover:text-black hover:underline transition-colors">Privacy Policy</a>.
              </label>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full flex justify-center py-[11px] px-4 rounded-xl shadow-[0_4px_14px_0_rgba(10,25,47,0.25)] text-[14px] font-bold text-white bg-[#0a192f] hover:bg-[#071324] hover:shadow-[0_6px_20px_0_rgba(10,25,47,0.3)] hover:-translate-y-px focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0a192f] transition-all duration-200"
        >
          {authType === 'login' ? 'Sign In' : 'Create Account'}
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
      </form>
    </div>
  );
};

export default AuthForm;
