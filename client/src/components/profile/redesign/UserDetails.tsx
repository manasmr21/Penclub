import { useRouter } from "next/navigation";
import Image from "next/image";
import { IoSettingsOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useAppStore } from "@/src/lib/store/store";
import {
  fetchAuthorArticlesCount,
  fetchAuthorBooksCount,
} from "@/src/lib/profile-stats-api";

const UserDetails = () => {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const isAuthor = user?.role === "author";
  const isReader = user?.role === "reader";
  type PictureLike = string | { secure_url?: string; url?: string } | null | undefined;
  const getProfileUrl = (pic: PictureLike) => {
    if (!pic) return null;
    if (typeof pic === "string") {
      try {
        const parsed = JSON.parse(pic);
        return parsed.secure_url || parsed.url || pic;
      } catch {
        return pic;
      }
    }
    if (typeof pic === "object") {
      return pic.secure_url || pic.url || null;
    }
    return null;
  };

  const picUrl = getProfileUrl(user?.profilePicture);
  const hasProfilePicture = typeof picUrl === "string" && picUrl.trim().length > 0;
  const displayName = user?.name || user?.username || "Pen Club Member";

  const initials = displayName.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  const fallbackInitials =
    initials.length > 1
      ? `${initials[0].charAt(0)}${initials[1].charAt(0)}`.toUpperCase()
      : initials[0]?.charAt(0).toUpperCase() || "PC";

  const parsedInterests = Array.isArray(user?.interests)
    ? user.interests
    : typeof user?.interests === "string"
      ? user.interests
          // @ts-expect-error interests may be string from persisted API payload
          .split(",")
          .map((interest: string) => interest.trim())
          .filter(Boolean)
      : [];
  const [bookCount, setBookCount] = useState(0);
  const [articleCount, setArticleCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadCounts = async () => {
      if (!isAuthor || !user?.id) {
        if (isMounted) {
          setBookCount(0);
          setArticleCount(0);
        }
        return;
      }

      try {
        const [nextBookCount, nextArticleCount] = await Promise.all([
          fetchAuthorBooksCount(user.id),
          fetchAuthorArticlesCount(user.id),
        ]);

        if (isMounted) {
          setBookCount(nextBookCount);
          setArticleCount(nextArticleCount);
        }
      } catch {
        if (isMounted) {
          setBookCount(0);
          setArticleCount(0);
        }
      }
    };

    void loadCounts();

    return () => {
      isMounted = false;
    };
  }, [isAuthor, user?.id]);

  const stats = [
    ...(isReader ? [] : [{ label: "Books", value: bookCount }]),
    ...(isAuthor ? [{ label: "Articles", value: articleCount }] : []),
    ...(isAuthor ? [{ label: "Followers", value: user?.followersCount ?? 0 }] : []),
    { label: "Following", value: user?.followingCount ?? 0 },
  ];

  return (
    <div className={`w-full max-w-5xl mx-auto px-6 ${isReader ? "pt-8" : "py-12"}`}>
      <div className={isReader ? "rounded-3xl border border-outline-variant/20 bg-white px-6 py-10 shadow-[0_18px_45px_rgba(15,23,42,0.08)]" : ""}>
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-12 w-full">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-10 w-full md:w-auto">
        {/* Profile Image */}
        <div
          className="relative w-[160px] md:w-[200px] shrink-0 aspect-square overflow-hidden rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] ring-4 ring-offset-4 ring-outline-variant/10"
        >
          {hasProfilePicture ? (
            <Image
              src={picUrl || ""}
              alt="profile picture"
              width={300}
              height={300}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-5xl select-none">
              {fallbackInitials}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 justify-center max-w-2xl text-center md:text-left mt-4 md:mt-2">
          <h1 className="text-4xl md:text-[2.75rem] font-bold tracking-tight text-primary mb-4 leading-none">
            {displayName}
          </h1>
          <p className="text-base md:text-[17px] text-on-surface-variant opacity-80 font-serif italic leading-relaxed mb-10 md:border-l-2 md:border-primary/20 md:pl-5 mx-auto md:mx-0 max-w-lg">
            {user?.bio || "No biography added yet."}
          </p>
          <div className="mb-10 mx-auto md:mx-0 max-w-lg">
            <p className="text-[11px] tracking-[0.2em] uppercase text-on-surface-variant/70 mb-3">
              Interests
            </p>
            {parsedInterests.length > 0 ? (
              <div className="flex flex-wrap gap-2.5 justify-center md:justify-start">
                {parsedInterests.map((interest: string) => (
                  <span
                    key={interest}
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium capitalize"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant/70">
                No interests added yet.
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center md:justify-start gap-8 md:gap-14">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center md:items-start group cursor-default"
              >
                <span className="text-[2rem] leading-none font-bold text-primary group-hover:text-tertiary transition-colors duration-300">
                  {stat.value}
                </span>
                <span className="text-[10px] tracking-[0.25em] uppercase font-medium text-on-surface-variant/70 mt-2">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex w-full md:w-auto mt-6 md:mt-4 items-center justify-center md:justify-end shrink-0">
        <button
          onClick={() => router.push("/profile/settings")}
          className="group flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 bg-white text-primary shadow-sm transition-all duration-300 hover:bg-primary/10"
          aria-label="Open profile settings"
        >
          <IoSettingsOutline className="text-[22px] transition-transform group-hover:rotate-45" />
        </button>
      </div>
    </div>
    </div>
    </div>
  );
};

export default UserDetails;
