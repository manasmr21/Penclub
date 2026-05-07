import React, { InputHTMLAttributes, forwardRef } from 'react';

// Reusable Input Field Component
export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  rightElement?: React.ReactNode;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, id, className = '', rightElement, ...props }, ref) => (
    <div className={`flex flex-col space-y-1.5 w-full ${className}`}>
      <label
        htmlFor={id}
        className="text-[10px] font-sans font-black uppercase tracking-[0.2em] text-[#1D4E89]/60"
      >
        {label}
      </label>
      <div className="relative w-full">
        <input
          id={id}
          ref={ref}
          name={id}
          className={`w-full border-2 border-gray-100 bg-[#FDF9F0]/40 px-4 py-3.5 text-sm font-sans font-bold text-[#1D4E89] placeholder:text-primary/30 outline-none transition-all duration-300 focus:border-[#1D4E89] focus:bg-white rounded-2xl ${rightElement ? 'pr-14' : ''}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-4 flex items-center">
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
    className="text-[9px] font-sans font-black uppercase tracking-widest text-[#E6693E] hover:text-[#11325C] transition duration-150 focus:outline-none cursor-pointer"
    tabIndex={-1}
  >
    {show ? "Hide" : "Show"}
  </button>
);
PasswordToggleButton.displayName = 'PasswordToggleButton';
