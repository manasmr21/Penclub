"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AxiosError } from "axios";
import AuthField from "@/src/components/auth/AuthField";
import AuthShell from "@/src/components/auth/AuthShell";
import { authInputClassName } from "@/src/components/auth/auth-styles";
import { resendUserOtp, updateUserProfile, logoutUser } from "@/src/lib/auth-api";
import { useAuthStore } from "@/src/store/auth-store";

const INTEREST_OPTIONS = [
  "fiction",
  "mystery",
  "poetry",
  "romance",
  "fantasy",
  "science fiction",
  "biography",
  "self help",
];

type ProfileErrors = {
  phoneNumber?: string;
  interests?: string;
  profilePicture?: string;
  bio?: string;
  form?: string;
};

function isValidProfilePicture(value: string) {
  return /^https?:\/\/.+/i.test(value);
}

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? "");
  const [interests, setInterests] = useState<string[]>(user?.interests ?? []);
  const [bio, setBio] = useState(user?.bio ?? "");
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture ?? "");
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [imagePreviewFailed, setImagePreviewFailed] = useState(false);

  const isReader = user?.role === "reader";
  const normalizedProfilePicture = profilePicture.trim();
  const showProfilePreview = Boolean(
    normalizedProfilePicture && isValidProfilePicture(normalizedProfilePicture) && !imagePreviewFailed,
  );

  const canVerifyEmail = useMemo(
    () => Boolean(user?.email && !user?.isEmailVerified),
    [user],
  );

  const toggleInterest = (interest: string) => {
    setInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest],
    );
    setErrors((current) => ({ ...current, interests: undefined, form: undefined }));
    setMessage("");
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) return;

    const nextErrors: ProfileErrors = {};
    if (isReader && phoneNumber.trim() && !/^[0-9+\-\s()]{7,20}$/.test(phoneNumber.trim())) {
      nextErrors.phoneNumber = "Enter a valid phone number.";
    }
    if (normalizedProfilePicture && !isValidProfilePicture(normalizedProfilePicture)) {
      nextErrors.profilePicture = "Enter a valid image URL.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      const payload = {
        interests: interests.length ? interests : undefined,
        bio: bio.trim() || undefined,
        profilePicture: normalizedProfilePicture || undefined,
        ...(isReader ? { phoneNumber: phoneNumber.trim() || undefined } : {}),
      };

      await updateUserProfile(user, payload);

      updateUser({
        ...(isReader ? { phoneNumber: phoneNumber.trim() || undefined } : {}),
        interests: interests.length ? interests : undefined,
        bio: bio.trim() || undefined,
        profilePicture: normalizedProfilePicture || undefined,
      });
      setProfilePicture(normalizedProfilePicture);
      setImagePreviewFailed(false);
      setMessage("Profile updated successfully.");
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : "Could not update profile.";
      setErrors({ form: message ?? "Could not update profile." });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (user) {
      await logoutUser(user.role);
    }
    clearAuth();
    router.push("/");
    router.refresh();
  };

  const handleVerifyEmail = async () => {
    if (!user?.email) return;

    try {
      setVerifying(true);
      setErrors({});
      const data = await resendUserOtp(user.role, user.email);
      useAuthStore.getState().setPendingOtpUser({
        ...user,
        expiresAt: Date.now() + (data?.otpExpiresInMinutes ?? 10) * 60 * 1000,
        devOtp: data?.devOtp,
      });
      router.push(`/verify-otp?email=${encodeURIComponent(user.email)}&role=${user.role}`);
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : "Could not send verification email.";
      setErrors({ form: message ?? "Could not send verification email." });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <AuthShell>
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-primary md:text-4xl">
          Your profile
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          {isReader
            ? "Update your phone number, interests, short bio, and profile picture."
            : "Update your interests, short bio, and profile picture."}
        </p>
      </div>

      <form onSubmit={handleSave} className="mt-8 space-y-4">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
            {showProfilePreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={normalizedProfilePicture}
                alt="Profile"
                className="h-full w-full object-cover"
                onError={() => setImagePreviewFailed(true)}
              />
            ) : (
              <span className="text-sm text-slate-400">Blank</span>
            )}
          </div>
        </div>

        <AuthField id="profilePicture" label="Profile picture URL" error={errors.profilePicture}>
          <input
            id="profilePicture"
            type="url"
            value={profilePicture}
            onChange={(event) => {
              setProfilePicture(event.target.value);
              setImagePreviewFailed(false);
              setErrors((current) => ({ ...current, profilePicture: undefined, form: undefined }));
              setMessage("");
            }}
            className={authInputClassName}
            placeholder="https://example.com/profile.jpg"
          />
        </AuthField>

        {isReader ? (
          <AuthField id="phoneNumber" label="Phone number" error={errors.phoneNumber}>
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(event) => {
                setPhoneNumber(event.target.value);
                setErrors((current) => ({ ...current, phoneNumber: undefined, form: undefined }));
                setMessage("");
              }}
              className={authInputClassName}
              placeholder="Add your phone number"
            />
          </AuthField>
        ) : null}

       {/* ✅ SELECTED INTERESTS (CHIPS BOX) */}
        {interests.length > 0 && (
          <div className="flex flex-wrap gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3">
            {interests.map((interest) => (
              <div
                key={interest}
                className="flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-white text-sm"
              >
                <span className="capitalize">{interest}</span>
                <button
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className="text-white hover:opacity-80"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ✅ CHECKBOX LIST */}
        <AuthField id="interests" label="Interests" error={errors.interests}>
          <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-3">
            {INTEREST_OPTIONS.map((interest) => (
              <label
                key={interest}
                className="flex items-center gap-2 text-sm text-slate-700"
              >
                <input
                  type="checkbox"
                  checked={interests.includes(interest)}
                  onChange={() => toggleInterest(interest)}
                  className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <span className="capitalize">{interest}</span>
              </label>
            ))}
          </div>
        </AuthField>

        <AuthField id="bio" label="Short bio" error={errors.bio}>
          <textarea
            id="bio"
            value={bio}
            onChange={(event) => {
              setBio(event.target.value);
              setErrors((current) => ({ ...current, form: undefined }));
              setMessage("");
            }}
            className={`${authInputClassName} min-h-28`}
            placeholder="Write a short bio"
          />
        </AuthField>

        {errors.form ? <p className="text-sm text-red-600">{errors.form}</p> : null}
        {message ? <p className="text-sm text-green-700">{message}</p> : null}

        {canVerifyEmail ? (
          <button
            type="button"
            onClick={handleVerifyEmail}
            disabled={verifying}
            className="w-full rounded-xl border border-primary/20 bg-white px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/5"
          >
            {verifying ? "Sending..." : "Verify email"}
          </button>
        ) : null}

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
    </AuthShell>
  );
}
