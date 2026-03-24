"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import AuthField from "./AuthField";
import { authInputClassName } from "./auth-styles";

type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
};

export default function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <AuthField id={id} label={label} error={error}>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          suppressHydrationWarning
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${authInputClassName} pr-11`}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          suppressHydrationWarning
          className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 transition hover:text-primary"
          aria-label={visible ? `Hide ${label}` : `Show ${label}`}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </AuthField>
  );
}
