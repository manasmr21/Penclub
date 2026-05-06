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
        className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50"
      >
        {label}
      </label>
      <div className="relative w-full">
        <input
          id={id}
          ref={ref}
          name={id}
          className={`w-full border-b border-primary/20 bg-transparent py-2.5 text-sm font-serif text-primary placeholder:text-primary/25 outline-none transition duration-150 focus:border-primary rounded-none ${rightElement ? 'pr-12' : ''}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-1 flex items-center">
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
    className="text-[10px] font-bold uppercase tracking-widest text-secondary hover:text-primary transition duration-150 focus:outline-none"
    tabIndex={-1}
  >
    {show ? "Hide" : "Show"}
  </button>
);
PasswordToggleButton.displayName = 'PasswordToggleButton';
