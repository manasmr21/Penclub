"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  setPendingOtpUser,
  setStoredUser,
  type AuthUser,
  type UserRole,
} from "@/src/lib/auth";
import AuthField from "./AuthField";
import AuthShell from "./AuthShell";
import PasswordField from "./PasswordField";
import RoleToggle from "./RoleToggle";
import { authInputClassName } from "./auth-styles";

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
  const [role, setRole] = useState<Role>("reader");
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const isSignUp = mode === "sign-up";
  const heading = isSignUp ? "Create your account" : "Welcome back";
  const identifierLabel = isSignUp
    ? "Email"
    : role === "reader"
      ? "Email / Username"
      : "Email / Pen name";
  const identifierPlaceholder = isSignUp
    ? "Enter your email"
    : role === "reader"
      ? "Enter your email or username"
      : "Enter your email or pen name";

  const handleChange = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "", form: "" }));
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

  return (
    <AuthShell
      maxWidthClassName={isSignUp ? "max-w-[25rem]" : "max-w-lg"}
      backgroundSize={isSignUp ? "70%" : "60%"}
    >
      <div className="flex flex-col items-center">
        <div className="w-full text-center">
          <h1 className="text-xl font-semibold text-primary md:text-3xl">
            {heading}
          </h1>
        </div>

        <div className="mt-3 flex w-full justify-center">
          <div className="w-full max-w-md">
            <RoleToggle role={role} onChange={setRole} />

            <form onSubmit={handleSubmit} className="space-y-0" noValidate>
              <div className="space-y-1">
                {isSignUp ? (
                  <AuthField id="name" label="Full name" error={errors.name}>
                    <input
                      id="name"
                      type="text"
                      suppressHydrationWarning
                      value={values.name}
                      onChange={(event) => handleChange("name", event.target.value)}
                      className={authInputClassName}
                      placeholder="Enter your full name"
                    />
                  </AuthField>
                ) : null}

                {isSignUp && role === "author" ? (
                  <AuthField id="penName" label="Pen name">
                    <input
                      id="penName"
                      type="text"
                      suppressHydrationWarning
                      value={values.penName}
                      onChange={(event) => handleChange("penName", event.target.value)}
                      className={authInputClassName}
                      placeholder="Choose your pen name"
                    />
                  </AuthField>
                ) : null}

                {isSignUp && role === "reader" ? (
                  <AuthField
                    id="username"
                    label="Username"
                    error={errors.username}
                  >
                    <input
                      id="username"
                      type="text"
                      suppressHydrationWarning
                      value={values.username}
                      onChange={(event) => handleChange("username", event.target.value)}
                      className={authInputClassName}
                      placeholder="Choose a username"
                    />
                  </AuthField>
                ) : null}

                <AuthField id="email" label={identifierLabel} error={errors.email}>
                  <input
                    id="email"
                    type={isSignUp ? "email" : "text"}
                    suppressHydrationWarning
                    value={values.email}
                    onChange={(event) => handleChange("email", event.target.value)}
                    className={authInputClassName}
                    placeholder={identifierPlaceholder}
                  />
                </AuthField>

                <PasswordField
                  id="password"
                  label="Password"
                  value={values.password}
                  onChange={(value) => handleChange("password", value)}
                  placeholder="Enter your password"
                  error={errors.password}
                />

                {isSignUp ? (
                  <PasswordField
                    id="confirmPassword"
                    label="Confirm password"
                    value={values.confirmPassword}
                    onChange={(value) => handleChange("confirmPassword", value)}
                    placeholder="Confirm your password"
                    error={errors.confirmPassword}
                  />
                ) : null}
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
                className="w-full rounded-xl bg-primary px-4 py-2 mt-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Please wait..." : isSignUp ? "Sign up" : "Sign in"}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-slate-600">
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
      </div>
    </AuthShell>
  );
}
