"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, useMemo, useState } from "react";
import { AxiosError } from "axios";
import AuthField from "@/src/components/auth/AuthField";
import AuthShell from "@/src/components/auth/AuthShell";
import { authInputClassName } from "@/src/components/auth/auth-styles";
import { resendUserOtp, updateUserProfile, logoutUser } from "@/src/lib/auth-api";
import { useAuthStore } from "@/src/store/auth-store";

type ProfileErrors = {
  phoneNumber?: string;
  interests?: string;
  profilePicture?: string;
  bio?: string;
  form?: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? "");
  const [interests, setInterests] = useState(user?.interests ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture ?? "");
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const canVerifyEmail = useMemo(
    () => Boolean(user?.email && !user?.isEmailVerified),
    [user],
  );

  const handleProfilePictureChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setErrors((current) => ({ ...current, profilePicture: undefined, form: undefined }));
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

    if (!user) return;

    const nextErrors: ProfileErrors = {};
    if (phoneNumber.trim() && !/^[0-9+\-\s()]{7,20}$/.test(phoneNumber.trim())) {
      nextErrors.phoneNumber = "Enter a valid phone number.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      await updateUserProfile(user, {
        phoneNumber: phoneNumber.trim() || undefined,
        interests: interests
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        bio: bio.trim() || undefined,
        profilePicture: profilePicture || undefined,
      });

      updateUser({
        phoneNumber: phoneNumber.trim() || undefined,
        interests: interests.trim() || undefined,
        bio: bio.trim() || undefined,
        profilePicture: profilePicture || undefined,
      });
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
    <AuthShell maxWidthClassName="max-w-2xl">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-primary md:text-4xl">
          Your profile
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          Update your phone number, interests, short bio, and profile picture.
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

        <AuthField id="interests" label="Interests" error={errors.interests}>
          <input
            id="interests"
            type="text"
            value={interests}
            onChange={(event) => {
              setInterests(event.target.value);
              setErrors((current) => ({ ...current, form: undefined }));
              setMessage("");
            }}
            className={authInputClassName}
            placeholder="Poetry, Fiction, Mystery"
          />
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
