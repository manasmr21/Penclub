import { ReactNode } from "react";

type AuthFieldProps = {
  id?: string;
  label: string;
  error?: string;
  children: ReactNode;
};

export default function AuthField({
  id,
  label,
  error,
  children,
}: AuthFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      {children}
      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
