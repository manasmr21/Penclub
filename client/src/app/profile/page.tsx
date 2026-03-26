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

const MAX_PROFILE_PICTURE_BYTES = 350 * 1024;

function isValidProfilePicture(value: string) {
  return /^https?:\/\/.+/i.test(value) || /^data:image\/[a-zA-Z0-9.+-]+;base64,/i.test(value);
}

function getApproximateDataUrlBytes(value: string) {
  const [, base64 = ""] = value.split(",", 2);
  return Math.floor((base64.length * 3) / 4);
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Could not read file."));
    };

    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

function loadImageFromDataUrl(dataUrl: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not load image."));
    image.src = dataUrl;
  });
}

function canvasToDataUrl(canvas: HTMLCanvasElement, quality: number) {
  return canvas.toDataURL("image/jpeg", quality);
}

async function compressProfileImage(file: File) {
  const originalDataUrl = await readFileAsDataUrl(file);
  const image = await loadImageFromDataUrl(originalDataUrl);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not prepare image.");
  }

  const maxDimension = 512;
  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));

  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const qualities = [0.82, 0.72, 0.62, 0.52, 0.42];

  for (const quality of qualities) {
    const compressedDataUrl = canvasToDataUrl(canvas, quality);

    if (getApproximateDataUrlBytes(compressedDataUrl) <= MAX_PROFILE_PICTURE_BYTES) {
      return compressedDataUrl;
    }
  }

  const smallestDataUrl = canvasToDataUrl(canvas, 0.35);

  if (getApproximateDataUrlBytes(smallestDataUrl) <= MAX_PROFILE_PICTURE_BYTES) {
    return smallestDataUrl;
  }

  throw new Error("Image is still too large after compression.");
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
    if (
      normalizedProfilePicture.startsWith("data:image/") &&
      getApproximateDataUrlBytes(normalizedProfilePicture) > MAX_PROFILE_PICTURE_BYTES
    ) {
      nextErrors.profilePicture = "Uploaded image is too large. Please choose a smaller image.";
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

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((current) => ({ ...current, profilePicture: "Please choose an image file." }));
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((current) => ({
        ...current,
        profilePicture: "Please choose an image smaller than 5 MB.",
      }));
      event.target.value = "";
      return;
    }

    try {
      const dataUrl = await compressProfileImage(file);
      setProfilePicture(dataUrl);
      setImagePreviewFailed(false);
      setErrors((current) => ({ ...current, profilePicture: undefined, form: undefined }));
      setMessage("");
    } catch {
      setErrors((current) => ({
        ...current,
        profilePicture: "Could not process the selected image.",
      }));
    } finally {
      event.target.value = "";
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
          <div className="space-y-3">
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
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3">
              <label
                htmlFor="profilePictureUpload"
                className="inline-flex cursor-pointer rounded-lg border border-primary/20 bg-white px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/5"
              >
                Upload image
              </label>
              <input
                id="profilePictureUpload"
                type="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                className="hidden"
              />
              <p className="mt-2 text-xs text-slate-500">
                Choose a JPG, PNG, or WEBP image up to 5 MB. We will compress it before upload.
              </p>
            </div>
          </div>
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
