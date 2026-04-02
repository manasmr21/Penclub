
import { Upload } from "lucide-react";
import { Button } from "@/src/components/ui/button";

const inputClassName =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";
const helperTextClassName = "text-xs text-slate-500";
const panelClassName = "rounded-xl border border-slate-200 bg-slate-50";

type ProfilePictureSectionProps = {
  error?: string;
  profilePicture: string;
  showProfilePreview: boolean;
  previewSrc: string;
  onProfilePictureChange: (value: string) => void;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPreviewError: () => void;
};

export function ProfilePictureSection({
  error,
  profilePicture,
  showProfilePreview,
  previewSrc,
  onProfilePictureChange,
  onUpload,
  onPreviewError,
}: ProfilePictureSectionProps) {
  return (
    <>
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
          {showProfilePreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewSrc}
              alt="Profile"
              className="h-full w-full object-cover"
              onError={onPreviewError}
            />
          ) : (
            <span className="text-sm text-slate-400">Blank</span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="profilePicture" className="text-sm font-medium text-slate-800">
          Profile picture
        </label>
        <div className="space-y-3">
          <div className="relative">
            <input
              id="profilePicture"
              type="url"
              value={profilePicture}
              onChange={(event) => onProfilePictureChange(event.target.value)}
              className={`${inputClassName} pr-12`}
              placeholder="https://example.com/profile.jpg"
            />
            <label
              htmlFor="profilePictureUpload"
              className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg border border-primary/20 bg-white text-primary transition hover:bg-primary/5"
              aria-label="Upload image"
              title="Upload image"
            >
              <Upload size={16} />
            </label>
          </div>
          <p className={helperTextClassName}>
            Paste an image URL or upload a file. We will compress uploads before saving.
          </p>
          <input
            id="profilePictureUpload"
            type="file"
            accept="image/*"
            onChange={onUpload}
            className="hidden"
          />
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </div>
    </>
  );
}

type InterestsSectionProps = {
  options: string[];
  interests: string[];
  error?: string;
  onToggle: (interest: string) => void;
};

export function InterestsSection({
  options,
  interests,
  error,
  onToggle,
}: InterestsSectionProps) {
  return (
    <>
      {interests.length > 0 ? (
        <div className="flex flex-wrap gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3">
          {interests.map((interest) => (
            <div
              key={interest}
              className="flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-sm text-white"
            >
              <span className="capitalize">{interest}</span>
              <button
                type="button"
                onClick={() => onToggle(interest)}
                className="text-white hover:opacity-80"
              >
                X
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <div className="space-y-2">
        <label htmlFor="interests" className="text-sm font-medium text-slate-800">
          Interests
        </label>
        <div id="interests" className={`grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 ${panelClassName}`}>
          {options.map((interest) => (
            <label
              key={interest}
              className="flex items-center gap-2 text-sm text-slate-700"
            >
              <input
                type="checkbox"
                checked={interests.includes(interest)}
                onChange={() => onToggle(interest)}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
              />
              <span className="capitalize">{interest}</span>
            </label>
          ))}
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </div>
    </>
  );
}

type ProfileEditorActionsProps = {
  loading: boolean;
  canVerifyEmail: boolean;
  verifying: boolean;
  onVerify: () => void;
  onBack: () => void;
  onLogout: () => void;
  showLogout?: boolean;
  backLabel?: string;
};

export function ProfileEditorActions({
  loading,
  canVerifyEmail,
  verifying,
  onVerify,
  onBack,
  onLogout,
  showLogout = true,
  backLabel = "Back to profile",
}: ProfileEditorActionsProps) {
  return (
    <>
      {canVerifyEmail ? (
        <Button
          type="button"
          onClick={onVerify}
          disabled={verifying}
          variant="outline"
          className="w-full rounded-xl border-primary/20 text-primary hover:bg-primary/5"
        >
          {verifying ? "Sending..." : "Verify email"}
        </Button>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" disabled={loading} className="w-full rounded-xl text-sm font-semibold">
          {loading ? "Saving..." : "Save profile"}
        </Button>
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="w-full rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50"
        >
          {backLabel}
        </Button>
        {showLogout ? (
          <Button
            type="button"
            onClick={onLogout}
            variant="outline"
            className="w-full rounded-xl border-primary/20 text-primary hover:bg-primary/5"
          >
            Logout
          </Button>
        ) : null}
      </div>
    </>
  );
}
