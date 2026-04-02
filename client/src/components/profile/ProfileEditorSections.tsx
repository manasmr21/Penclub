
import { Upload } from "lucide-react";
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
