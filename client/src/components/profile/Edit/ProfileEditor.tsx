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
  <header className="flex items-center justify-between border-b border-primary/10 bg-transparent pb-4 mb-6">
    <button type="button" onClick={onClose} className="text-xs uppercase tracking-widest font-bold text-primary hover:opacity-80 transition duration-150">
      &larr; Back
    </button>
    <h1 className="text-xl font-serif font-bold text-primary tracking-tight">Edit Profile</h1>
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
    <div className="flex flex-col items-center gap-3 border-b border-primary/10 pb-6 mb-6">
      <div className="relative h-24 w-24">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-none border border-primary/20 bg-card text-3xl font-serif font-bold text-primary shadow-sm">
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
          className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-none border border-primary/20 bg-background text-[11px] font-bold text-primary shadow-sm transition hover:bg-primary hover:text-white duration-150"
          title="Edit Photo"
        >
          ✏️
        </button>
      </div>

      <button 
        type="button" 
        onClick={() => fileInputRef.current?.click()} 
        className="text-[10px] uppercase tracking-widest font-bold text-secondary hover:text-primary transition duration-150"
      >
        Change Photo
      </button>
    </div>
  );
};

const FormInput = ({ id, label, value, onChange, type = 'text', prefix }: FormInputProps) => (
  <div className="space-y-1">
    <label htmlFor={id} className="block text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50">
      {label}
    </label>
    <div className="relative flex items-center">
      {prefix && <span className="absolute left-0 text-sm font-mono text-primary/70">{prefix}</span>}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full border-b border-primary/20 bg-transparent py-2.5 text-sm font-serif text-primary outline-none transition duration-150 focus:border-primary ${prefix ? 'pl-5' : ''}`}
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
      className={`w-full bg-transparent text-primary ${inModal
          ? "mx-auto mt-4 sm:mt-10 max-w-2xl max-h-[92vh] overflow-y-auto border border-primary/20 bg-card p-6"
          : "mx-auto max-w-none"
        }`}
    >
      {inModal && <ProfileHeader onClose={handleClose} />}

      <div className="space-y-6">
        <ProfilePictureUpdate
          currentPicture={user?.profilePicture}
          name={user?.name}
          email={user?.email}
          onFileSelect={setFile}
        />

        {user?.isEmailVerified === false && (
          <div className="flex justify-center border-b border-primary/10 pb-6 mb-6">
            <button
              type="button"
              onClick={handleVerifyNow}
              disabled={verifyLoading}
              className="h-10 rounded-none border border-primary px-5 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/5 transition duration-150 disabled:opacity-60"
            >
              {verifyLoading ? "Sending OTP..." : "Verify Identity"}
            </button>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSave}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormInput id="fullName" label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <FormInput id="username" label="Username" value={username} onChange={(e) => setUsername(e.target.value)} prefix="@" />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50">
              Biography
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="min-h-[120px] w-full resize-none border border-primary/20 bg-transparent p-3 text-sm font-serif text-primary outline-none transition duration-150 focus:border-primary rounded-none"
              rows={4}
              placeholder="Tell your story..."
            />
            <p className="text-right text-[10px] font-semibold text-primary/40 tracking-wider uppercase">{bio.length} / 300 Characters</p>
          </div>

          <div className="space-y-3">
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50">
              Atelier Interests & Topics
            </label>
            
            {selected.length > 0 && (
              <div className="flex flex-wrap gap-2 border border-primary/10 bg-primary/5 p-3 rounded-none">
                {selected.map((item) => (
                  <span
                    key={item}
                    className="cursor-pointer border border-primary bg-card px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary transition hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                    onClick={() => toggleInterest(item)}
                    title="Remove Tag"
                  >
                    {item} &times;
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-1">
              {allInterests.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => toggleInterest(item)}
                  className={`border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition rounded-none ${selected.includes(item)
                      ? "border-primary bg-primary text-white"
                      : "border-primary/20 bg-transparent text-primary/60 hover:bg-primary/5 hover:text-primary hover:border-primary/40"
                    }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-primary/10">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="h-12 w-full sm:flex-1 border border-primary/20 bg-transparent text-xs font-bold uppercase tracking-widest text-primary transition hover:bg-primary/5 rounded-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || initialSyncLoading}
              className="h-12 w-full sm:flex-1 bg-primary border border-primary text-xs font-bold uppercase tracking-widest text-white transition hover:bg-transparent hover:text-primary rounded-none shadow-md"
            >
              {loading ? "Saving..." : initialSyncLoading ? "Loading..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
