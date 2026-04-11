import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/src/lib/store/store';
import { updateProfile, UpdateUserProfilePayload } from "@/src/lib/auth";
import { resendUserOtp, updateUserProfile } from "@/src/lib/auth-api";
import { extractErrorMessage } from "@/src/lib/http-client";

interface ProfileEditorProps {
  inModal?: boolean;
  onClose?: () => void;
}

interface FormInputProps {
  id: string;
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: React.HTMLInputTypeAttribute;
  prefix?: React.ReactNode;
}

const ProfileHeader = ({ onClose }: { onClose?: () => void }) => (
  <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border)] bg-white px-3 py-3 sm:px-4">
    <button type="button" onClick={onClose} className="text-sm text-[var(--primary)] transition-opacity hover:opacity-80">
      &lt; Back
    </button>
    <h1 className="text-base sm:text-xl font-semibold text-[var(--foreground)]">Edit Profile</h1>
    <div className="w-10" />
  </header>
);

const ProfilePictureUpdate = ({
  currentPicture,
  name,
  email,
  onFileSelect,
}: {
  currentPicture?: string;
  name?: string;
  email?: string;
  onFileSelect: (file: File) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const getInitials = () => {
    if (name) {
      const splitName = name.split(" ");
      if (splitName.length > 1) {
        return splitName[0][0].toUpperCase() + splitName[1][0].toUpperCase();
      }
      return splitName[0][0].toUpperCase();
    }

    if (email) {
      return email.substring(0, 2).toUpperCase();
    }

    return "NA";
  };

  const hasProfilePicture = typeof currentPicture === "string" && currentPicture.trim().length > 0;
  const imageSource = preview || (hasProfilePicture ? currentPicture : null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      onFileSelect(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-20 w-20">
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--card)] text-2xl font-bold text-[var(--primary)] shadow-sm">
          {imageSource ? (
            <img src={imageSource} className="h-full w-full object-cover" alt="Profile Preview" />
          ) : (
            <span className="select-none">{getInitials()}</span>
          )}
        </div>

        <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background)] text-[10px] text-[var(--primary)] shadow-sm transition hover:opacity-80"
        >
          E
        </button>
      </div>

      <button type="button" onClick={() => fileInputRef.current?.click()} className="text-xs text-[var(--secondary)] hover:underline p-2">
        Change Photo
      </button>
    </div>
  );
};

const FormInput = ({ id, label, value, onChange, type = 'text', prefix }: FormInputProps) => (
  <div className="space-y-1">
    <label htmlFor={id} className="ml-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
      {label}
    </label>
    <div className="relative">
      {prefix && <span className="absolute left-3.5 top-3 text-xs text-[var(--muted-foreground)]">{prefix}</span>}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className={`h-10 w-full rounded-xl border border-[var(--border)] bg-gray-100 px-3.5 text-sm text-[var(--foreground)] outline-none transition focus:ring-2 focus:ring-[var(--primary)] ${prefix ? 'pl-7' : ''}`}
      />
    </div>
  </div>
);

export default function ProfileEditor({ inModal = false, onClose }: ProfileEditorProps) {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const updateUser = useAppStore((s) => s.updateUser);
  const setError = useAppStore((s) => s.setError);
  type UserPatch = Parameters<typeof updateUser>[0];
  type ProfileResponse = { user?: UserPatch; message?: string };

  const allInterests = ['Poetry', 'Fiction', 'Non-fiction', 'Essays', 'Memoir', 'Fantasy', 'Modernist Fiction'];

  const [selected, setSelected] = useState<string[]>([]);
  const [bio, setBio] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [initialSyncLoading, setInitialSyncLoading] = useState(false);
  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }
    router.push("/profile");
  };

  useEffect(() => {
    if (!user?.id) return;

    let isMounted = true;

    const syncLatestProfile = async () => {
      try {
        setInitialSyncLoading(true);
        // Reuses authenticated endpoint to read latest persisted profile fields.
        const response = await updateUserProfile(user.id, new FormData()) as ProfileResponse;
        if (isMounted && response?.user) {
          updateUser(response.user);
        }
      } catch {
        // Keep local persisted store data when refresh fails.
      } finally {
        if (isMounted) {
          setInitialSyncLoading(false);
        }
      }
    };

    void syncLatestProfile();

    return () => {
      isMounted = false;
    };
  }, [user?.id, updateUser]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setUsername(user.username || '');
      setBio(user.bio || '');

      const parsed = Array.isArray(user.interests)
        ? user.interests
        : typeof user.interests === 'string'
          ? (user.interests as string)
              .split(',')
              .map((interest: string) => interest.trim())
              .filter(Boolean)
          : [];

      setSelected(parsed);
    }
  }, [user]);

  const toggleInterest = (item: string) => {
    setSelected((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      const payload: UpdateUserProfilePayload = {
        name,
        bio,
        interests: selected,
      };

      if (file) {
        payload.profilePictureFile = file;
      }

      const response = await updateProfile(
        { id: user.id, profilePictureId: user.profilePictureId },
        payload,
        setLoading,
      ) as ProfileResponse;

      const optimisticUpdate: Partial<typeof user> = {
        name,
        bio,
        interests: selected,
      };

      if (file) {
        optimisticUpdate.profilePicture = URL.createObjectURL(file);
      }

      updateUser(optimisticUpdate);
      if (response?.user) {
        updateUser(response.user);
      }

      alert(response?.message ?? "Profile updated successfully.");
      if (onClose) onClose();
    } catch (error) {
      const message = extractErrorMessage(error, "Failed to update profile.");
      setError(message);
      alert(message);
      console.error("Failed to update profile", error);
      setLoading(false);
    }
  };

  const handleVerifyNow = async () => {
    if (!user?.email) return;

    setVerifyLoading(true);
    setError(null);
    try {
      const response = await resendUserOtp(user.role, user.email);
      const expiresAt = response?.otpExpiresAt ? `&expiresAt=${encodeURIComponent(response.otpExpiresAt)}` : "";
      router.push(`/verify-otp?email=${encodeURIComponent(user.email)}${expiresAt}`);
    } catch (error) {
      const message = extractErrorMessage(error, "Unable to send verification OTP.");
      setError(message);
      alert(message);
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
  <div
    className={`w-full rounded-2xl border border-[var(--border)] bg-white text-[var(--foreground)] shadow-sm ${
      inModal
        ? "mx-auto mt-4 sm:mt-10 max-w-2xl max-h-[92vh] overflow-y-auto"
        : "mx-auto max-w-none"
    }`}
  >
    <ProfileHeader onClose={handleClose} />

    <div className="space-y-3 p-3 sm:p-4">
      <ProfilePictureUpdate
        currentPicture={user?.profilePicture}
        name={user?.name}
        email={user?.email}
        onFileSelect={setFile}
      />

      {user?.isEmailVerified === false && (
        <div className="flex justify-center pt-1">
          <button
            type="button"
            onClick={handleVerifyNow}
            disabled={verifyLoading}
            className="h-10 rounded-full border border-[var(--primary)] px-5 text-sm font-semibold text-[var(--primary)] transition hover:opacity-85 disabled:opacity-60"
          >
            {verifyLoading ? "Sending OTP..." : "Verify Now"}
          </button>
        </div>
      )}

      <form className="space-y-2" onSubmit={handleSave}>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <FormInput id="fullName" label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          <FormInput id="username" label="Username" value={username} onChange={(e) => setUsername(e.target.value)} prefix="@" />
        </div>

        <div className="space-y-1">
          <label className="ml-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            /* Changed bg-[var(--background)] to bg-gray-100 */
            className="min-h-25 w-full resize-none rounded-xl border border-[var(--border)] bg-gray-100 p-3 text-sm outline-none transition focus:ring-2 focus:ring-[var(--primary)]"
            rows={4}
          />
          <p className="text-right text-[10px] text-[var(--muted-foreground)]">{bio.length} / 300</p>
        </div>

        {selected.length > 0 && (
          /* Changed bg-[var(--background)] to bg-gray-100 */
          <div className="flex flex-wrap gap-1 rounded-xl border border-[var(--border)] bg-gray-100 p-2">
            {selected.map((item) => (
              <span
                key={item}
                /* Changed bg-[var(--card)] to bg-white for contrast */
                className="cursor-pointer rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs transition hover:opacity-80"
                onClick={() => toggleInterest(item)}
              >
                {item} x
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {allInterests.map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => toggleInterest(item)}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                selected.includes(item)
                  ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "border-[var(--border)] bg-gray-100 hover:bg-gray-200" /* Changed to gray-100 */
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            /* Changed bg-[var(--card)] to bg-gray-100 */
            className="h-11 w-full sm:flex-1 rounded-full border border-[var(--border)] bg-gray-100 text-sm font-medium transition hover:bg-gray-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || initialSyncLoading}
            className="h-11 w-full sm:flex-1 rounded-full bg-[linear-gradient(90deg,var(--primary),var(--secondary))] text-sm font-semibold text-[var(--primary-foreground)] shadow-[0_12px_30px_rgba(10,56,125,0.2)] transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Saving..." : initialSyncLoading ? "Loading..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  </div>
);

}
