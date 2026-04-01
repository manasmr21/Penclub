import React, { InputHTMLAttributes, forwardRef } from 'react';

// Reusable Input Field Component
export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
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
          name={id}
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

export const PasswordToggleButton = ({ show, onToggle }: { show: boolean, onToggle: () => void }) => (
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
PasswordToggleButton.displayName = 'PasswordToggleButton';
