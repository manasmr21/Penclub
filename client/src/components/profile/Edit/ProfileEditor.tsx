import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/src/lib/store/store';
import { updateProfile, UpdateUserProfilePayload } from "@/src/lib/auth";
import { resendUserOtp, updateUserProfile } from "@/src/lib/auth-api";
import { extractErrorMessage } from "@/src/lib/http-client";
import { X, Camera, Check, ChevronLeft, Hash, Edit3, User, Mail, AtSign } from 'lucide-react';
import AnimateIn from '@/src/components/ui/AnimateIn';
import { motion } from 'motion/react';

interface ProfileEditorProps {
  inModal?: boolean;
  onClose?: () => void;
}

interface FormInputProps {
  id: string;
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: React.HTMLInputTypeAttribute;
  prefixIcon?: React.ReactNode;
  isTextArea?: boolean;
}


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
    if (email) return email.substring(0, 2).toUpperCase();
    return "PC";
  };

  const imageSource = preview || (currentPicture && currentPicture.trim().length > 0 ? currentPicture : null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      onFileSelect(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3 mb-8">
      <div className="relative group">
        <div className="h-28 w-28 rounded-3xl bg-[#FDF9F0]/60 flex items-center justify-center overflow-hidden transition-all duration-300 cursor-pointer">
          {imageSource ? (
            <img src={imageSource} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <span className="text-2xl font-serif font-black text-[#1D4E89]/20">{getInitials()}</span>
          )}
          <input
            type="file"
            ref={fileInputRef}
            className="absolute inset-0 opacity-0 cursor-pointer"
            accept="image/*"
            onChange={handleFileChange}
          />

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <Camera size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#E6693E] text-white flex items-center justify-center rounded-xl hover:scale-110 active:scale-95 transition-all border-2 border-white"
        >
          <Edit3 size={14} />
        </button>
      </div>
      <span className="text-[9px] uppercase font-sans font-black tracking-[0.2em] text-[#1D4E89]/50">
        Update Portrait
      </span>
    </div>
  );
};

const FormInput = ({ id, label, value, onChange, type = 'text', prefixIcon, isTextArea }: FormInputProps) => (
  <div className="flex flex-col space-y-1.5 w-full group">
    <label htmlFor={id} className="text-[10px] font-sans font-black uppercase tracking-[0.2em] text-[#1D4E89]/60 group-focus-within:text-[#1D4E89] transition-colors">
      {label}
    </label>
    <div className="relative w-full">
      {prefixIcon && (
        <div className="absolute left-4 inset-y-0 flex items-center text-[#1D4E89]/30">
          {prefixIcon}
        </div>
      )}
      {isTextArea ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          className={`w-full bg-[#FDF9F0]/40 px-4 py-3.5 text-sm font-sans font-bold text-[#1D4E89] placeholder:text-gray-300 outline-none transition-all duration-300 focus:bg-white rounded-2xl min-h-[120px] resize-none ${prefixIcon ? 'pl-11' : ''}`}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          className={`w-full bg-[#FDF9F0]/40 px-4 py-3.5 text-sm font-sans font-bold text-[#1D4E89] placeholder:text-gray-300 outline-none transition-all duration-300 focus:bg-white rounded-2xl ${prefixIcon ? 'pl-11' : ''}`}
        />
      )}
    </div>
  </div>
);

export default function ProfileEditor({ inModal = false, onClose }: ProfileEditorProps) {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const updateUser = useAppStore((s) => s.updateUser);
  const setError = useAppStore((s) => s.setError);

  const allInterests = ['Poetry', 'Fiction', 'Non-fiction', 'Essays', 'Memoir', 'Fantasy', 'Modernist Fiction', 'Digital Art', 'Editorial'];

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
        const response = await updateUserProfile(user.id, new FormData()) as any;
        if (isMounted && response?.user) {
          updateUser(response.user);
        }
      } catch {
      } finally {
        if (isMounted) setInitialSyncLoading(false);
      }
    };
    void syncLatestProfile();
    return () => { isMounted = false; };
  }, [user?.id, updateUser]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setUsername(user.username || '');
      setBio(user.bio || '');
      const parsed = Array.isArray(user.interests)
        ? user.interests
        : typeof user.interests === 'string'
          ? (user.interests as string).split(',').map(i => i.trim()).filter(Boolean)
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
      const payload: UpdateUserProfilePayload = { name, interests: selected };
      if (file) payload.profilePictureFile = file;

      const response = await updateProfile(
        { id: user.id, profilePictureId: user.profilePictureId },
        payload,
        setLoading,
      ) as any;

      const optimisticUpdate: any = { name, bio, interests: selected };
      if (file) optimisticUpdate.profilePicture = URL.createObjectURL(file);

      updateUser(optimisticUpdate);
      if (response?.user) updateUser(response.user);

      if (onClose) onClose();
    } catch (error) {
      const message = extractErrorMessage(error, "Failed to update profile.");
      setError(message);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyNow = async () => {
    if (!user?.email) return;
    setVerifyLoading(true);
    setError(null);
    try {
      const response = await resendUserOtp(user.role as any, user.email);
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
    <AnimateIn variant="fade-up" delay={0.05} className="w-full">
      <div
        className={`w-full bg-white mx-auto max-w-[600px] p-8 sm:p-10 rounded-[2.5rem] relative overflow-hidden`}
      >

        <div className="space-y-8">
          <ProfilePictureUpdate
            currentPicture={user?.profilePicture}
            name={user?.name}
            email={user?.email}
            onFileSelect={setFile}
          />

          {user?.isEmailVerified === false && (
            <div className="flex flex-col items-center bg-[#FDF9F0]/60 p-6 rounded-2xl mb-8">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#E6693E] mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E6693E] animate-pulse" />
                Action Required
              </span>
              <p className="text-[11px] text-[#1D4E89]/60 italic font-serif mb-3 text-center">
                Your email registry status is currently unverified.
              </p>
              <button
                type="button"
                onClick={handleVerifyNow}
                disabled={verifyLoading}
                className="w-full py-3 bg-[#1D4E89] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#11325C] transition-all disabled:opacity-60"
              >
                {verifyLoading ? "Sending Code..." : "Verify Registry"}
              </button>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSave}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormInput id="fullName" label="Full Name" value={name} onChange={(e) => setName(e.target.value)} prefixIcon={<User size={16} />} />
              <FormInput id="username" label="Archive Handle" value={username} onChange={(e) => setUsername(e.target.value)} prefixIcon={<AtSign size={16} />} />
            </div>

            <FormInput
              id="biography"
              label="Archival Biography"
              value={bio}
              isTextArea
              onChange={(e) => setBio(e.target.value)}
              prefixIcon={<Edit3 size={16} className="mt-1" />}
            />

            <div className="space-y-3">
              <label className="text-[10px] font-sans font-black uppercase tracking-[0.2em] text-[#1D4E89]/60">
                Atelier Focus & Topics
              </label>
              <div className="flex flex-wrap gap-2">
                {allInterests.map((item) => (
                  <motion.button
                    type="button"
                    key={item}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleInterest(item)}
                    className={`px-4 py-2 text-[10px] font-sans font-black uppercase tracking-widest rounded-xl transition-all duration-200 cursor-pointer ${selected.includes(item)
                      ? 'bg-[#1D4E89] text-white'
                      : 'bg-[#FDF9F0]/60 text-[#1D4E89]/40 hover:text-[#1D4E89]'
                      }`}
                  >
                    {item}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-4 pt-6">
              <motion.button
                type="button"
                onClick={handleClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-4 text-[10px] font-sans font-black uppercase tracking-widest text-[#1D4E89]/50 bg-[#FDF9F0]/60 rounded-2xl transition-colors hover:text-[#1D4E89]"
              >
                Discard
              </motion.button>
              <motion.button
                type="submit"
                disabled={loading || initialSyncLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-4 bg-[#1D4E89] text-white text-[10px] font-sans font-black uppercase tracking-widest rounded-2xl transition-all hover:bg-[#11325C]"
              >
                {loading ? "Saving..." : initialSyncLoading ? "Syncing..." : "Commit Changes"}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </AnimateIn>
  );
}

