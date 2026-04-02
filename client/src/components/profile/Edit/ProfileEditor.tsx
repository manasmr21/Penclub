import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/src/lib/store/store';
import { updateProfile, UpdateUserProfilePayload } from "@/src/lib/auth";

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
  <header className="glass-header flex items-center justify-between px-4 py-2 border-b border-outline-variant/10">
    <button type="button" onClick={onClose} className="text-sm text-primary hover:text-primary-container transition-colors">← Back</button>
    <h1 className="font-semibold text-primary">Pen Club</h1>
    <div className="w-10" />
  </header>
);

const ProfilePictureUpdate = ({ 
  currentPicture, 
  name, 
  email, 
  onFileSelect 
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
      const file = e.target.files[0];
      onFileSelect(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20">
        <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-primary/20 bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
          {imageSource ? (
            <img
              src={imageSource}
              className="w-full h-full object-cover"
              alt="Profile Preview"
            />
          ) : (
            <span className="select-none">{getInitials()}</span>
          )}
        </div>

        <input 
          type="file" 
          ref={fileInputRef} 
          hidden 
          accept="image/*" 
          onChange={handleFileChange} 
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white border flex items-center justify-center text-xs shadow hover:bg-gray-50 transition-colors text-primary"
        >
          ✎
        </button>
      </div>

      <button type="button" onClick={() => fileInputRef.current?.click()} className="text-xs text-secondary hover:underline">Change</button>
    </div>
  );
};

const FormInput = ({ id, label, value, onChange, type = 'text', prefix }: FormInputProps) => (
  <div className="space-y-1">
    <label htmlFor={id} className="text-xs text-muted-foreground">{label}</label>
    <div className="relative">
      {prefix && <span className="absolute left-2 top-2 text-xs text-muted-foreground">{prefix}</span>}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full bg-surface-container-low border border-border rounded px-2 py-1 text-sm focus:ring-1 focus:ring-primary outline-none transition-colors ${prefix ? 'pl-6' : ''}`}
      />
    </div>
  </div>
);

export default function ProfileEditor({ onClose }: ProfileEditorProps) {
  const user = useAppStore((s) => s.user);
  const updateUser = useAppStore((s) => s.updateUser);

  const allInterests = ['Poetry', 'Fiction', 'Non-fiction', 'Essays', 'Memoir', 'Fantasy', 'Modernist Fiction'];

  const [selected, setSelected] = useState<string[]>([]);
  const [bio, setBio] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setUsername(user.username || '');
      setBio(user.bio || '');
      
      const parsed = Array.isArray(user.interests)
        ? user.interests
        : typeof user.interests === "string"
        ? (user.interests as string)
            .split(",")
            .map((interest: string) => interest.trim())
            .filter(Boolean)
        : [];
        
      setSelected(parsed);
    }
  }, [user]);

  const toggleInterest = (item: string) => {
    setSelected(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      const payload: UpdateUserProfilePayload = {
        bio,
        interests: selected
      };
      
      if (file) {
        payload.profilePictureFile = file;
      }
      
      // Update remotely
      await updateProfile(
        { id: user.id, profilePictureId: user.profilePictureId },
        payload,
        setLoading
      );
      
      // Optimistic user state update (Profile picture might need re-fetch, but bio/interests match)
      updateUser({
        bio,
        interests: selected,
        // (name and username might be added here when backend fully supports them)
      });
      
      if (onClose) onClose();
      
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto profile-surface edit-profile-theme">
      <ProfileHeader onClose={onClose} />

      <div className="p-4 space-y-4">
        <h2 className="text-lg font-semibold text-center text-primary">Edit Details</h2>

        <ProfilePictureUpdate currentPicture={user?.profilePicture} name={user?.name} email={user?.email} onFileSelect={setFile} />

        <form className="space-y-3" onSubmit={handleSave}>
          <div className="grid grid-cols-2 gap-3">
            <FormInput id="fullName" label="Full Name" value={name} onChange={e => setName(e.target.value)} />
            <FormInput id="username" label="Username" value={username} onChange={e => setUsername(e.target.value)} prefix="@" />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-surface-container-low border border-border rounded px-2 py-1 text-sm focus:ring-1 focus:ring-primary outline-none resize-none transition-colors"
              rows={3}
            />
            <p className="text-[10px] text-right text-muted-foreground">{bio.length} / 300</p>
          </div>

          {selected.length > 0 && (
            <div className="border border-border rounded p-2 flex flex-wrap gap-1 bg-surface-container transition-all">
              {selected.map(item => (
                <span
                  key={item}
                  className="text-xs px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container cursor-pointer hover:bg-secondary-fixed transition-colors"
                  onClick={() => toggleInterest(item)}
                >
                  {item} &times;
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-1">
            {allInterests.map(item => (
              <button
                type="button"
                key={item}
                onClick={() => toggleInterest(item)}
                className={`text-xs px-2 py-1 rounded border transition-colors ${selected.includes(item) ? 'bg-primary text-white border-primary' : 'bg-surface-container-low border-border hover:bg-surface-container-high'}`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} disabled={loading} className="flex-1 border border-border rounded py-1 text-sm hover:bg-surface-container transition-colors disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 ink-gradient text-white rounded py-1 text-sm shadow hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
