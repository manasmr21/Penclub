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
  <header className="sticky top-0 z-10 flex items-center justify-between border-b border-primary/10 bg-white px-6 py-6 sm:px-8">
    <button type="button" onClick={onClose} className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40 hover:text-primary transition-colors cursor-pointer">
      &lt; Back
    </button>
    <h1 className="text-2xl font-serif font-bold text-[#0A192F]">Edit Profile</h1>
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
    <div className="flex flex-col items-center gap-4 mb-6">
      <div className="relative h-32 w-32 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
        <div className="flex h-32 w-32 items-center justify-center overflow-hidden border border-primary/20 bg-zinc-50 text-3xl font-serif text-primary/40 transition-all group-hover:border-primary/40">
          {imageSource ? (
            <img src={imageSource} className="h-full w-full object-cover" alt="Profile Preview" />
          ) : (
            <span className="select-none">{getInitials()}</span>
          )}
        </div>
        <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
        
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors flex items-center justify-center pointer-events-none">
           <span className="opacity-0 group-hover:opacity-100 text-[10px] font-sans font-bold uppercase tracking-widest text-primary bg-white/80 px-3 py-1.5 border border-primary/10">Edit</span>
        </div>
      </div>

      <button type="button" onClick={() => fileInputRef.current?.click()} className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40 hover:text-primary transition-colors cursor-pointer">
        Change Photo
      </button>
    </div>
  );
};

const FormInput = ({ id, label, value, onChange, type = 'text', prefix }: FormInputProps) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block text-[10px] uppercase font-sans font-bold tracking-[0.2em] text-primary/40">
      {label}
    </label>
    <div className="relative">
      {prefix && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-primary/40">{prefix}</span>}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className={`h-12 w-full rounded-none border border-primary/20 bg-zinc-50 px-4 text-sm font-sans text-[#0A192F] outline-none transition-all focus:border-primary focus:bg-white focus:ring-0 ${prefix ? 'pl-8' : ''}`}
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
      className={`w-full rounded-none border border-primary/10 bg-white shadow-sm ${inModal
          ? "mx-auto mt-4 sm:mt-10 max-w-xl max-h-[92vh] overflow-y-auto"
          : "mx-auto max-w-none"
        }`}
    >
      <ProfileHeader onClose={handleClose} />

      <div className="space-y-6 p-6 sm:p-10">
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
              className="h-10 rounded-none border border-primary px-6 text-[10px] font-sans font-bold uppercase tracking-widest text-primary transition-all hover:bg-primary hover:text-white disabled:opacity-60 cursor-pointer"
            >
              {verifyLoading ? "Sending OTP..." : "Verify Now"}
            </button>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSave}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormInput id="fullName" label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <FormInput id="username" label="Username" value={username} onChange={(e) => setUsername(e.target.value)} prefix="@" />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] uppercase font-sans font-bold tracking-[0.2em] text-primary/40">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="min-h-[120px] w-full resize-none rounded-none border border-primary/20 bg-zinc-50 p-4 text-sm font-sans text-[#0A192F] outline-none transition-all focus:border-primary focus:bg-white focus:ring-0"
              rows={4}
            />
            <p className="text-right text-[10px] font-sans font-bold text-primary/40 tracking-widest">{bio.length} / 300</p>
          </div>

          {selected.length > 0 && (
            <div className="flex flex-wrap gap-2 border border-primary/20 bg-zinc-50 p-4 rounded-none">
              {selected.map((item) => (
                <span
                  key={item}
                  className="cursor-pointer rounded-none border border-primary/10 bg-white px-4 py-1.5 text-[10px] font-sans font-bold uppercase tracking-[0.1em] text-primary/80 transition-all hover:border-primary/40"
                  onClick={() => toggleInterest(item)}
                >
                  {item} x
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            {allInterests.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => toggleInterest(item)}
                className={`rounded-none border px-4 py-1.5 text-[10px] font-sans font-bold uppercase tracking-[0.1em] transition-all cursor-pointer ${selected.includes(item)
                    ? "border-primary bg-primary text-white"
                    : "border-primary/20 bg-transparent text-primary/60 hover:border-primary/40"
                  }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-4 pt-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="h-12 w-full sm:flex-1 rounded-none border border-primary/20 bg-transparent text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/60 transition-all hover:border-primary/40 hover:text-primary disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || initialSyncLoading}
              className="h-12 w-full sm:flex-1 rounded-none bg-primary text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-white shadow-lg transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Saving..." : initialSyncLoading ? "Loading..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

}
