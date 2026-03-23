"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import {
  clearStoredUser,
  getStoredUser,
  setStoredUser,
  type AuthUser,
} from "@/src/lib/auth";

type ProfileErrors = {
  phoneNumber?: string;
  interests?: string;
  profilePicture?: string;
  bio?: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [interests, setInterests] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

  useEffect(() => {
    const storedUser = getStoredUser();
    if (!storedUser) return;

    setUser(storedUser);
    setPhoneNumber(storedUser.phoneNumber ?? "");
    setInterests(storedUser.interests ?? "");
    setBio(storedUser.bio ?? "");
    setProfilePicture(storedUser.profilePicture ?? "");
  }, []);

  const handleProfilePictureChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setErrors((current) => ({ ...current, profilePicture: undefined }));
    setMessage("");

    if (!file) {
      setProfilePicture("");
      return;
    }

    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setErrors((current) => ({
        ...current,
        profilePicture: "Only JPG, JPEG, and PNG files are allowed.",
      }));
      return;
    }

    if (file.size > 500 * 1024) {
      setErrors((current) => ({
        ...current,
        profilePicture: "Image size must be below 500 KB.",
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setProfilePicture(String(reader.result ?? ""));
    reader.readAsDataURL(file);
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: ProfileErrors = {};
    if (phoneNumber.trim() && !/^[0-9+\-\s()]{7,20}$/.test(phoneNumber.trim())) {
      nextErrors.phoneNumber = "Enter a valid phone number.";
    }

    if (Object.keys(nextErrors).length > 0 || !user) {
      setErrors(nextErrors);
      return;
    }

    const nextUser: AuthUser = {
      ...user,
      phoneNumber: phoneNumber.trim() || undefined,
      interests: interests.trim() || undefined,
      bio: bio.trim() || undefined,
      profilePicture: profilePicture || undefined,
    };

    try {
      setLoading(true);

      if (user.role === "author" && user.id) {
        const response = await fetch(`${API_URL}/authors/update/${user.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            interests: interests
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
            bio: bio.trim() || undefined,
            profilePicture: profilePicture || undefined,
          }),
        });

        const data = await response.json().catch(() => null);
        if (!response.ok || data?.success === false) {
          setMessage("");
          setErrors((current) => ({
            ...current,
            interests: data?.message ?? "Could not update profile.",
          }));
          return;
        }
      }

      setStoredUser(nextUser);
      setUser(nextUser);
      setMessage("Profile updated successfully.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearStoredUser();
    router.push("/");
    router.refresh();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#fff8cf,_#faf8e3_52%,_#efe7b8)] px-5 pb-6 pt-24 md:px-8 md:pb-8 md:pt-28">
      <div className="mx-auto w-full max-w-2xl rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_30px_80px_rgba(13,56,125,0.12)] backdrop-blur md:p-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-primary md:text-4xl">
            Your profile
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Update your phone number, interests, and profile picture.
          </p>
        </div>

        <form onSubmit={handleSave} className="mt-8 space-y-4">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
              {profilePicture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm text-slate-400">Blank</span>
              )}
            </div>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              onChange={handleProfilePictureChange}
              className="w-full max-w-sm rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            />
            {errors.profilePicture ? (
              <p className="text-sm text-red-600">{errors.profilePicture}</p>
            ) : (
              <p className="text-xs text-slate-500">
                JPG, JPEG, PNG only. Max size 500 KB.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="phoneNumber" className="mb-1 block text-sm font-medium text-slate-700">
              Phone number
            </label>
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(event) => {
                setPhoneNumber(event.target.value);
                setErrors((current) => ({ ...current, phoneNumber: undefined }));
                setMessage("");
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-primary"
              placeholder="Add your phone number"
            />
            {errors.phoneNumber ? (
              <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="interests" className="mb-1 block text-sm font-medium text-slate-700">
              Interests
            </label>
            <input
              id="interests"
              type="text"
              value={interests}
              onChange={(event) => {
                setInterests(event.target.value);
                setMessage("");
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-primary"
              placeholder="Poetry, Fiction, Mystery"
            />
            {errors.interests ? (
              <p className="mt-1 text-sm text-red-600">{errors.interests}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="bio" className="mb-1 block text-sm font-medium text-slate-700">
              Short bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(event) => {
                setBio(event.target.value);
                setMessage("");
              }}
              className="min-h-28 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-primary"
              placeholder="Write a short bio"
            />
            {errors.bio ? (
              <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
            ) : null}
          </div>

          {message ? <p className="text-sm text-green-700">{message}</p> : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Saving..." : "Save profile"}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-xl border border-primary/20 bg-white px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/5"
            >
              Logout
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
