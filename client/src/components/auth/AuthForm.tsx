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
  phoneNumber: string;
  location: string;
  bio: string;
  interests: string;
  socialLinks: string;
  profilePicture: string;
};

type FormErrors = Partial<Record<keyof FormValues | "form", string>>;

const initialValues: FormValues = {
  name: "",
  penName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phoneNumber: "",
  location: "",
  bio: "",
  interests: "",
  socialLinks: "",
  profilePicture: "",
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

  if (mode === "sign-up" && role === "author") {
    if (!values.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required.";
    }

    if (!values.location.trim()) {
      errors.location = "Country / City is required.";
    }

    if (!values.bio.trim()) {
      errors.bio = "Short bio is required.";
    }
  }

  if (mode === "sign-up" && !values.interests.trim()) {
    errors.interests = "Interests / genres are required.";
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

  const handleProfilePictureChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      handleChange("profilePicture", "");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrors((current) => ({
        ...current,
        profilePicture: "Please upload an image file.",
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      handleChange("profilePicture", String(reader.result ?? ""));
    };
    reader.readAsDataURL(file);
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
              phoneNumber: values.phoneNumber.trim(),
              location: values.location.trim(),
              bio: values.bio.trim(),
              interests: values.interests
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
              socialLinks: values.socialLinks
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
              profilePicture: values.profilePicture.trim() || undefined,
            }
          : {
              name: values.name.trim(),
              email: values.email.trim(),
              password: values.password,
              interests: values.interests
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
              profilePicture: values.profilePicture.trim() || undefined,
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
      <div
        className={`mx-auto w-full rounded-3xl bg-white p-8 shadow-sm ${
          isSignUp ? "max-w-4xl" : "max-w-md"
        }`}
      >
        <div className="mb-8 flex rounded-full bg-[#f3efcf] p-1">
          <button
            type="button"
            onClick={() => handleRoleChange("author")}
            suppressHydrationWarning
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
            suppressHydrationWarning
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
          <div className={isSignUp ? "grid gap-4 md:grid-cols-2" : "space-y-4"}>
          {isSignUp && (
            <div className="md:col-span-1">
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
                Full name
              </label>
              <input
                id="name"
                type="text"
                suppressHydrationWarning
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
            <div className="md:col-span-1">
              <label htmlFor="penName" className="mb-1 block text-sm font-medium text-slate-700">
                Pen name (optional)
              </label>
              <input
                id="penName"
                type="text"
                suppressHydrationWarning
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

          {isSignUp && role === "author" && (
            <div className="md:col-span-1">
              <label
                htmlFor="phoneNumber"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Phone number
              </label>
              <input
                id="phoneNumber"
                type="tel"
                suppressHydrationWarning
                value={values.phoneNumber}
                onChange={(event) =>
                  handleChange("phoneNumber", event.target.value)
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary"
                placeholder="Enter your phone number"
              />
              {errors.phoneNumber ? (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
              ) : null}
            </div>
          )}

          <div className="md:col-span-1">
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              suppressHydrationWarning
              value={values.email}
              onChange={(event) => handleChange("email", event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary"
              placeholder="Enter your email"
            />
            {errors.email ? (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            ) : null}
          </div>

          {isSignUp && role === "author" && (
            <div className="md:col-span-1">
              <label
                htmlFor="location"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Country / City
              </label>
              <input
                id="location"
                type="text"
                suppressHydrationWarning
                value={values.location}
                onChange={(event) => handleChange("location", event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary"
                placeholder="Enter your country and city"
              />
              {errors.location ? (
                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
              ) : null}
            </div>
          )}

          <div className="md:col-span-1">
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              suppressHydrationWarning
              value={values.password}
              onChange={(event) => handleChange("password", event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary"
              placeholder="Enter your password"
            />
            {errors.password ? (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            ) : null}
          </div>

          {isSignUp && role === "author" && (
            <div className="md:col-span-2">
              <label htmlFor="bio" className="mb-1 block text-sm font-medium text-slate-700">
                Short bio
              </label>
              <textarea
                id="bio"
                suppressHydrationWarning
                value={values.bio}
                onChange={(event) => handleChange("bio", event.target.value)}
                className="min-h-28 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary"
                placeholder="Write a short bio"
              />
              {errors.bio ? (
                <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
              ) : null}
            </div>
          )}

          {isSignUp && (
            <div className="md:col-span-1">
              <label
                htmlFor="interests"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Interests / Genres
              </label>
              <input
                id="interests"
                type="text"
                suppressHydrationWarning
                value={values.interests}
                onChange={(event) => handleChange("interests", event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary"
                placeholder="Fantasy, Poetry, Romance"
              />
              {errors.interests ? (
                <p className="mt-1 text-sm text-red-600">{errors.interests}</p>
              ) : null}
            </div>
          )}

          {isSignUp && role === "author" && (
            <div className="md:col-span-1">
              <label
                htmlFor="socialLinks"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Social links (optional)
              </label>
              <input
                id="socialLinks"
                type="text"
                suppressHydrationWarning
                value={values.socialLinks}
                onChange={(event) => handleChange("socialLinks", event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary"
                placeholder="https://x.com/you, https://instagram.com/you"
              />
            </div>
          )}

          {isSignUp && (
            <div className="md:col-span-1">
              <label
                htmlFor="profilePicture"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Profile picture (optional)
              </label>
              <input
                id="profilePicture"
                type="file"
                accept="image/*"
                suppressHydrationWarning
                onChange={handleProfilePictureChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary"
              />
              {values.profilePicture ? (
                <p className="mt-1 text-sm text-green-700">Image selected.</p>
              ) : null}
              {errors.profilePicture ? (
                <p className="mt-1 text-sm text-red-600">{errors.profilePicture}</p>
              ) : null}
            </div>
          )}

          {isSignUp && (
            <div className="md:col-span-1">
              <label
                htmlFor="confirmPassword"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                suppressHydrationWarning
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
          </div>

          {errors.form ? <p className="text-sm text-red-600">{errors.form}</p> : null}
          {message ? <p className="text-sm text-green-700">{message}</p> : null}

          <button
            type="submit"
            disabled={loading}
            suppressHydrationWarning
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
