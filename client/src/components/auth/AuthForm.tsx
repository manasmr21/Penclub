"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AuthMode = "sign-in" | "sign-up";
type Role = "author" | "reader";

type FormValues = {
  name: string;
  penName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof FormValues | "form", string>>;

const initialValues: FormValues = {
  name: "",
  penName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

function getValidationErrors(
  mode: AuthMode,
  role: Role,
  values: FormValues,
): FormErrors {
  const errors: FormErrors = {};

  if (mode === "sign-up" && !values.name.trim()) {
    errors.name = "Full name is required.";
  }

  if (mode === "sign-up" && role === "author" && !values.penName.trim()) {
    errors.penName = "Pen name is required.";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  if (mode === "sign-up") {
    if (!values.confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
  }

  return errors;
}

export default function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [role, setRole] = useState<Role>("author");
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const isSignUp = mode === "sign-up";

  const heading = isSignUp ? "Create your account" : "Welcome back";
  const subheading = isSignUp
    ? "Join PenClub as an author or reader."
    : "Sign in to continue to PenClub.";

  const handleChange = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "", form: "" }));
    setMessage("");
  };

  const handleRoleChange = (nextRole: Role) => {
    setRole(nextRole);
    setErrors({});
    setMessage("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = getValidationErrors(mode, role, values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (role === "reader") {
      setErrors({
        form: "Reader authentication is not available in the backend yet.",
      });
      return;
    }

    setLoading(true);
    setErrors({});
    setMessage("");

    try {
      const endpoint = isSignUp ? "/authors/create" : "/authors/login";
      const payload = isSignUp
        ? {
            name: values.name.trim(),
            penName: values.penName.trim(),
            email: values.email.trim(),
            password: values.password,
          }
        : {
            email: values.email.trim(),
            password: values.password,
          };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        setErrors({
          form:
            data?.message ??
            "Something went wrong. Please check your details and try again.",
        });
        return;
      }

      setMessage(data.message ?? "Authentication successful.");
      router.push("/");
      router.refresh();
    } catch {
      setErrors({
        form: "Could not connect to the server. Please make sure the backend is running.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#faf8e3] px-4 py-24">
      <div className="mx-auto w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
        <div className="mb-8 flex rounded-full bg-[#f3efcf] p-1">
          <button
            type="button"
            onClick={() => handleRoleChange("author")}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
              role === "author"
                ? "bg-primary text-white"
                : "text-primary"
            }`}
          >
            Author
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange("reader")}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
              role === "reader"
                ? "bg-primary text-white"
                : "text-primary"
            }`}
          >
            Reader
          </button>
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold text-primary">{heading}</h1>
          <p className="mt-2 text-sm text-slate-600">{subheading}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {isSignUp && (
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
                Full name
              </label>
              <input
                id="name"
                type="text"
                value={values.name}
                onChange={(event) => handleChange("name", event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary"
                placeholder="Enter your full name"
              />
              {errors.name ? (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              ) : null}
            </div>
          )}

          {isSignUp && role === "author" && (
            <div>
              <label htmlFor="penName" className="mb-1 block text-sm font-medium text-slate-700">
                Pen name
              </label>
              <input
                id="penName"
                type="text"
                value={values.penName}
                onChange={(event) => handleChange("penName", event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary"
                placeholder="Choose your pen name"
              />
              {errors.penName ? (
                <p className="mt-1 text-sm text-red-600">{errors.penName}</p>
              ) : null}
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={values.email}
              onChange={(event) => handleChange("email", event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary"
              placeholder="Enter your email"
            />
            {errors.email ? (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={values.password}
              onChange={(event) => handleChange("password", event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary"
              placeholder="Enter your password"
            />
            {errors.password ? (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            ) : null}
          </div>

          {isSignUp && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={values.confirmPassword}
                onChange={(event) => handleChange("confirmPassword", event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary"
                placeholder="Confirm your password"
              />
              {errors.confirmPassword ? (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              ) : null}
            </div>
          )}

          {errors.form ? <p className="text-sm text-red-600">{errors.form}</p> : null}
          {message ? <p className="text-sm text-green-700">{message}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Please wait..." : isSignUp ? "Sign up" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <Link
            href={isSignUp ? "/sign-in" : "/sign-up"}
            className="font-semibold text-primary"
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </Link>
        </p>
      </div>
    </main>
  );
}
