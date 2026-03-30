import AuthField from "@/src/components/auth/AuthField";
import {
  authHelperTextClassName,
  authInputClassName,
  authPanelClassName,
} from "@/src/components/auth/auth-styles";
import { Button } from "@/src/components/ui/button";

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

      <AuthField id="profilePicture" label="Profile picture URL" error={error}>
        <div className="space-y-3">
          <input
            id="profilePicture"
            type="url"
            value={profilePicture}
            onChange={(event) => onProfilePictureChange(event.target.value)}
            className={authInputClassName}
            placeholder="https://example.com/profile.jpg"
          />
          <p className={authHelperTextClassName}>
            The current backend accepts a profile image URL in `profilePicture`, not a file upload.
          </p>
          <div className={`${authPanelClassName} border-dashed border-slate-300 bg-slate-50 p-3`}>
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
              onChange={onUpload}
              className="hidden"
            />
            <p className={`mt-2 ${authHelperTextClassName}`}>
              Choose a JPG, PNG, or WEBP image up to 5 MB. We will compress it before upload.
            </p>
          </div>
        </div>
      </AuthField>
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

      <AuthField id="interests" label="Interests" error={error}>
        <div className={`grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 ${authPanelClassName}`}>
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
      </AuthField>
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
};

export function ProfileEditorActions({
  loading,
  canVerifyEmail,
  verifying,
  onVerify,
  onBack,
  onLogout,
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
          Back to profile
        </Button>
        <Button
          type="button"
          onClick={onLogout}
          variant="outline"
          className="w-full rounded-xl border-primary/20 text-primary hover:bg-primary/5"
        >
          Logout
        </Button>
      </div>
    </>
  );
}
