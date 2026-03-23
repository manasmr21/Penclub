"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import {
  setPendingOtpUser,
  setStoredUser,
  type AuthUser,
  type UserRole,
} from "@/src/lib/auth";

type AuthMode = "sign-in" | "sign-up";
type Role = UserRole;

type FormValues = {
  name: string;
  penName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof FormValues | "form", string>>;

const initialValues: FormValues = {
  name: "",
  penName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

function getValidationErrors(
  mode: AuthMode,
  role: Role,
  values: FormValues,
): FormErrors {
  const errors: FormErrors = {};

  if (mode === "sign-up" && !values.name.trim()) {
    errors.name = "Full name is required.";
  }

  if (mode === "sign-up" && role === "reader" && !values.username.trim()) {
    errors.username = "Username is required.";
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isSignUp = mode === "sign-up";
  const heading = isSignUp ? "Create your account" : "Welcome back";

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

  const buildUser = (): AuthUser => {
    return role === "author"
      ? {
          id: undefined,
          name: values.name.trim(),
          email: values.email.trim(),
          role,
          penName: values.penName.trim() || undefined,
        }
      : {
          id: undefined,
          name: values.name.trim(),
          email: values.email.trim(),
          role,
          username: values.username.trim(),
        };
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = getValidationErrors(mode, role, values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    setMessage("");

    try {
      const endpoint =
        role === "author"
          ? isSignUp
            ? "/authors/create"
            : "/authors/login"
          : isSignUp
            ? "/readers/create"
            : "/readers/login";

      const payload = isSignUp
        ? role === "author"
          ? {
              name: values.name.trim(),
              penName: values.penName.trim() || undefined,
              email: values.email.trim(),
              password: values.password,
            }
          : {
              name: values.name.trim(),
              username: values.username.trim(),
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

      if (!response.ok) {
        setErrors({
          form:
            data?.message ??
            "Something went wrong. Please check your details and try again.",
        });
        return;
      }

      const user = buildUser();

      if (isSignUp) {
        setPendingOtpUser({
          ...user,
          id: data?.data?.id,
          penName: data?.data?.penName ?? user.penName,
          expiresAt:
            Date.now() + (data?.otpExpiresInMinutes ?? 10) * 60 * 1000,
        });

        router.push(`/verify-otp?email=${encodeURIComponent(user.email)}`);
        return;
      }

      setStoredUser({
        ...user,
        id: data?.data?.id,
        penName: data?.data?.penName ?? user.penName,
      });
      setMessage(data?.message ?? "Authentication successful.");
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

  const inputClassName =
    "w-full rounded-xl border border-slate-200 bg-white/85 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:bg-white";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#fff8cf,_#faf8e3_52%,_#efe7b8)] px-5 py-3 md:px-8 md:py-6">
      <div
        className={`relative mx-auto w-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_30px_80px_rgba(13,56,125,0.12)] backdrop-blur ${
          isSignUp ? "max-w-[36rem]" : "max-w-lg"
        }`}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: "url('/images/pensignup.png')",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: isSignUp ? "78%" : "66%",
          }}
        />

        <section className="relative z-10 flex flex-col items-center px-6 py-6 md:px-6 md:py-5">
          <div className="w-full text-center">
            <h1 className="text-xl font-semibold text-primary md:text-4xl">
              {heading}
            </h1>
          </div>

          <div className="mt-4 flex w-full justify-center">
            <div className="w-full max-w-md">
              <div className="mb-3 flex rounded-full bg-[#f4efcf] p-1">
                <button
                  type="button"
                  onClick={() => handleRoleChange("author")}
                  suppressHydrationWarning
                  className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    role === "author"
                      ? "bg-primary text-white shadow-sm"
                      : "text-primary"
                  }`}
                >
                  Author
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange("reader")}
                  suppressHydrationWarning
                  className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    role === "reader"
                      ? "bg-primary text-white shadow-sm"
                      : "text-primary"
                  }`}
                >
                  Reader
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="space-y-3">
                  {isSignUp && (
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-1 block text-sm font-medium text-slate-700"
                      >
                        Full name
                      </label>
                      <input
                        id="name"
                        type="text"
                        suppressHydrationWarning
                        value={values.name}
                        onChange={(event) => handleChange("name", event.target.value)}
                        className={inputClassName}
                        placeholder="Enter your full name"
                      />
                      {errors.name ? (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      ) : null}
                    </div>
                  )}

                  {isSignUp && role === "author" && (
                    <div>
                      <label
                        htmlFor="penName"
                        className="mb-1 block text-sm font-medium text-slate-700"
                      >
                        Pen name (optional)
                      </label>
                      <input
                        id="penName"
                        type="text"
                        suppressHydrationWarning
                        value={values.penName}
                        onChange={(event) => handleChange("penName", event.target.value)}
                        className={inputClassName}
                        placeholder="Choose your pen name"
                      />
                    </div>
                  )}

                  {isSignUp && role === "reader" && (
                    <div>
                      <label
                        htmlFor="username"
                        className="mb-1 block text-sm font-medium text-slate-700"
                      >
                        Username
                      </label>
                      <input
                        id="username"
                        type="text"
                        suppressHydrationWarning
                        value={values.username}
                        onChange={(event) => handleChange("username", event.target.value)}
                        className={inputClassName}
                        placeholder="Choose a username"
                      />
                      {errors.username ? (
                        <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                      ) : null}
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1 block text-sm font-medium text-slate-700"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      suppressHydrationWarning
                      value={values.email}
                      onChange={(event) => handleChange("email", event.target.value)}
                      className={inputClassName}
                      placeholder="Enter your email"
                    />
                    {errors.email ? (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    ) : null}
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="mb-1 block text-sm font-medium text-slate-700"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        suppressHydrationWarning
                        value={values.password}
                        onChange={(event) => handleChange("password", event.target.value)}
                        className={`${inputClassName} pr-11`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        suppressHydrationWarning
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 transition hover:text-primary"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
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
                      <div className="relative">
                        <input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          suppressHydrationWarning
                          value={values.confirmPassword}
                          onChange={(event) =>
                            handleChange("confirmPassword", event.target.value)
                          }
                          className={`${inputClassName} pr-11`}
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword((current) => !current)
                          }
                          suppressHydrationWarning
                          className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 transition hover:text-primary"
                          aria-label={
                            showConfirmPassword
                              ? "Hide confirm password"
                              : "Show confirm password"
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword ? (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.confirmPassword}
                        </p>
                      ) : null}
                    </div>
                  )}
                </div>

                {errors.form ? (
                  <p className="text-sm text-red-600">{errors.form}</p>
                ) : null}
                {message ? (
                  <p className="text-sm text-green-700">{message}</p>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  suppressHydrationWarning
                  className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
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
          </div>
        </section>
      </div>
    </main>
  );
}
