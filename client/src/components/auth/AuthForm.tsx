"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useState } from "react";
import {
  registerUser,
  loginUser,
} from "@/src/lib/auth-api";
import { type AuthUser, type UserRole } from "@/src/lib/auth";
import { useAuthStore } from "@/src/store/auth-store";
import AuthField from "./AuthField";
import AuthShell from "./AuthShell";
import PasswordField from "./PasswordField";
import RoleToggle from "./RoleToggle";
import { authInputClassName } from "./auth-styles";

type AuthMode = "sign-in" | "sign-up";

type FormValues = {
  name: string;
  penName: string;
  username: string;
  identifier: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof FormValues | "form", string>>;

const initialValues: FormValues = {
  name: "",
  penName: "",
  username: "",
  identifier: "",
  password: "",
  confirmPassword: "",
};

function getValidationErrors(
  mode: AuthMode,
  role: UserRole,
  values: FormValues,
): FormErrors {
  const errors: FormErrors = {};

  if (mode === "sign-up" && !values.name.trim()) {
    errors.name = "Full name is required.";
  }

  if (mode === "sign-up" && role === "author" && !values.penName.trim()) {
    errors.penName = "Pen name is required.";
  }

  if (mode === "sign-up" && role === "reader" && !values.username.trim()) {
    errors.username = "Username is required.";
  }

  if (!values.identifier.trim()) {
    errors.identifier = "This field is required.";
  } else if (
    mode === "sign-up" &&
    !/^\S+@\S+\.\S+$/.test(values.identifier.trim())
  ) {
    errors.identifier = "Enter a valid email address.";
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
  const setUser = useAuthStore((state) => state.setUser);
  const setPendingOtpUser = useAuthStore((state) => state.setPendingOtpUser);

  const [role, setRole] = useState<UserRole>("reader");
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

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

    try {
      if (isSignUp) {
        const data = await registerUser(role, {
          name: values.name.trim(),
          penName: role === "author" ? values.penName.trim() : undefined,
          username: role === "reader" ? values.username.trim() : undefined,
          email: values.identifier.trim(),
          password: values.password,
        });

        const pendingUser: AuthUser = {
          id: data?.data?.id,
          name: values.name.trim(),
          email: values.identifier.trim(),
          role,
          penName: role === "author" ? data?.data?.penName ?? values.penName.trim() : undefined,
          username: role === "reader" ? data?.data?.username ?? values.username.trim() : undefined,
          isEmailVerified: false,
        };

        setPendingOtpUser({
          ...pendingUser,
          expiresAt: Date.now() + (data?.otpExpiresInMinutes ?? 10) * 60 * 1000,
          devOtp: data?.devOtp,
        });

        router.push(`/verify-otp?email=${encodeURIComponent(pendingUser.email)}&role=${role}`);
        return;
      }

      const data = await loginUser(role, {
        identifier: values.identifier.trim(),
        password: values.password,
      });

      setUser({
        id: data?.data?.id,
        name:
          data?.data?.name ??
          (role === "author" ? data?.data?.penName : data?.data?.username) ??
          values.identifier.trim(),
        email: data?.data?.email ?? values.identifier.trim(),
        role,
        penName: data?.data?.penName,
        username: data?.data?.username,
        isEmailVerified: true,
      });

      router.push("/");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : "Something went wrong. Please check your details and try again.";

      setErrors({
        form: message ?? "Something went wrong. Please check your details and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell mode={mode}>
      <div className="auth-form-root">
        <div className="auth-form-header">
          <h1 className="text-xl font-semibold text-primary sm:text-2xl md:text-3xl">
            {heading}
          </h1>
        </div>

        <div className="auth-form-panel">
          <div className="auth-form-panel-inner">
            <RoleToggle role={role} onChange={setRole} />

            <form onSubmit={handleSubmit} className="space-y-0" noValidate>
              <div className="auth-form-fields">
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
                  <AuthField id="penName" label="Pen name" error={errors.penName}>
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
                  <AuthField id="username" label="Username" error={errors.username}>
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

                <AuthField
                  id="identifier"
                  label={identifierLabel}
                  error={errors.identifier}
                >
                  <input
                    id="identifier"
                    type={isSignUp ? "email" : "text"}
                    suppressHydrationWarning
                    value={values.identifier}
                    onChange={(event) => handleChange("identifier", event.target.value)}
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

              {errors.form ? <p className="auth-form-error">{errors.form}</p> : null}

              <button
                type="submit"
                disabled={loading}
                suppressHydrationWarning
                className="auth-form-submit"
              >
                {loading ? "Please wait..." : isSignUp ? "Sign up" : "Sign in"}
              </button>
            </form>

            <p className="auth-form-footer">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <Link
                href={isSignUp ? "/sign-in" : "/sign-up"}
                className="auth-form-link"
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
