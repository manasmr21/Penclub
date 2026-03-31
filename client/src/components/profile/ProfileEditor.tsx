"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import AuthField from "@/src/components/auth/AuthField";
import AuthShell from "@/src/components/auth/AuthShell";
import {
  authInputClassName,
} from "@/src/components/auth/auth-styles";
import { Button } from "@/src/components/ui/button";
import { logoutUser, resendUserOtp, updateUserProfile } from "@/src/lib/auth-api";
import { useAuthStore } from "@/src/store/auth-store";
import {
  ProfileEditorActions,
  ProfilePictureSection,
  InterestsSection,
} from "@/src/components/profile/ProfileEditorSections";
import {
  isValidProfilePicture,
  validateProfilePictureValue,
  validateUploadedProfileImage,
} from "@/src/components/profile/profile-editor-utils";

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
  interests?: string;
  profilePicture?: string;
  bio?: string;
  form?: string;
};

type ProfileEditorProps = {
  inModal?: boolean;
  onClose?: () => void;
};

export default function ProfileEditor({ inModal = false, onClose }: ProfileEditorProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const [interests, setInterests] = useState<string[]>(user?.interests ?? []);
  const [bio, setBio] = useState(user?.bio ?? "");
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture ?? "");
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [localProfilePreview, setLocalProfilePreview] = useState("");
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [imagePreviewFailed, setImagePreviewFailed] = useState(false);

  const normalizedProfilePicture = profilePicture.trim();
  const previewSrc = localProfilePreview || normalizedProfilePicture;
  const showProfilePreview = Boolean(
    previewSrc &&
      (localProfilePreview || (isValidProfilePicture(normalizedProfilePicture) && !imagePreviewFailed)),
  );

  const canVerifyEmail = useMemo(
    () => Boolean(user?.email && !user?.isEmailVerified),
    [user],
  );

  useEffect(() => {
    return () => {
      if (localProfilePreview) {
        URL.revokeObjectURL(localProfilePreview);
      }
    };
  }, [localProfilePreview]);

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
    if (!user.id || user.id === "undefined") {
      setErrors({ form: "Session expired. Please sign in again and retry." });
      return;
    }

    const nextErrors: ProfileErrors = {};
    if (!profilePictureFile) {
      const profilePictureError = validateProfilePictureValue(normalizedProfilePicture);
      if (profilePictureError) {
        nextErrors.profilePicture = profilePictureError;
      }
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
        profilePictureFile: profilePictureFile ?? undefined,
      };

      const response = await updateUserProfile(user, payload);
      const savedProfilePicture =
        response?.author?.profilePicture ??
        response?.reader?.profilePicture ??
        (profilePictureFile ? localProfilePreview || undefined : normalizedProfilePicture || undefined);

      updateUser({
        interests: interests.length ? interests : undefined,
        bio: bio.trim() || undefined,
        ...(savedProfilePicture ? { profilePicture: savedProfilePicture } : {}),
      });
      setProfilePicture(savedProfilePicture ?? "");
      setProfilePictureFile(null);
      setLocalProfilePreview("");
      setImagePreviewFailed(false);
      setMessage("Profile updated successfully.");
    } catch (error) {
      const nextMessage =
        error instanceof AxiosError
          ? error.response?.data?.message
          : "Could not update profile.";
      setErrors({ form: nextMessage ?? "Could not update profile." });
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const uploadError = validateUploadedProfileImage(file);
    if (uploadError) {
      setErrors((current) => ({ ...current, profilePicture: uploadError }));
      event.target.value = "";
      return;
    }

    if (localProfilePreview) {
      URL.revokeObjectURL(localProfilePreview);
    }

    setProfilePictureFile(file);
    setLocalProfilePreview(URL.createObjectURL(file));
    setImagePreviewFailed(false);
    setErrors((current) => ({ ...current, profilePicture: undefined, form: undefined }));
    setMessage("");
    event.target.value = "";
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
    if (user.role !== "author") {
      setErrors({ form: "Email resend is currently available for authors only." });
      return;
    }

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
      const nextMessage =
        error instanceof AxiosError
          ? error.response?.data?.message
          : "Could not send verification email.";
      setErrors({ form: nextMessage ?? "Could not send verification email." });
    } finally {
      setVerifying(false);
    }
  };

  const content = (
    <>
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-primary md:text-4xl">
          Edit profile
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          Update your interests, short bio, and profile picture.
        </p>
      </div>

      <form onSubmit={handleSave} className="mt-8 space-y-4">
        <ProfilePictureSection
          error={errors.profilePicture}
          profilePicture={profilePicture}
          showProfilePreview={showProfilePreview}
          previewSrc={previewSrc}
          onProfilePictureChange={(value) => {
            setProfilePicture(value);
            setProfilePictureFile(null);
            if (localProfilePreview) {
              URL.revokeObjectURL(localProfilePreview);
              setLocalProfilePreview("");
            }
            setImagePreviewFailed(false);
            setErrors((current) => ({ ...current, profilePicture: undefined, form: undefined }));
            setMessage("");
          }}
          onUpload={handleProfilePictureUpload}
          onPreviewError={() => setImagePreviewFailed(true)}
        />

        <InterestsSection
          options={INTEREST_OPTIONS}
          interests={interests}
          error={errors.interests}
          onToggle={toggleInterest}
        />

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

        <ProfileEditorActions
          loading={loading}
          canVerifyEmail={canVerifyEmail}
          verifying={verifying}
          onVerify={handleVerifyEmail}
          onBack={() => {
            if (inModal && onClose) {
              onClose();
              return;
            }
            router.push("/profile");
          }}
          onLogout={handleLogout}
          showLogout={!inModal}
          backLabel={inModal ? "Close" : "Back to profile"}
        />
      </form>
    </>
  );

  if (inModal) {
    return <div className="space-y-2">{content}</div>;
  }

  return <AuthShell>{content}</AuthShell>;
}
