import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { IoSettingsOutline, IoCheckmarkCircle } from "react-icons/io5";
import { Share2, Edit3 } from "lucide-react";
import { useAppStore } from "@/src/lib/store/store";

interface User {
  id: string;
  name?: string;
  username?: string;
  role?: "author" | "user";
  bio?: string;
  interests?: string[] | string;
  createdAt?: string;
  profilePicture?: string | { secure_url?: string; url?: string };
  bookCount?: number;
  articleCount?: number;
  followersCount?: number;
  followingCount?: number;
}

interface UserDetailsProps {
  /** If true, shows edit controls (settings gear + Edit Profile button) */
  isOwnProfile?: boolean;
  /** Optional user override – if not provided, uses logged‑in user from store */
  userOverride?: User;
}

const UserDetails = ({ isOwnProfile = true, userOverride }: UserDetailsProps) => {
  const router = useRouter();
  const storeUser = useAppStore((state) => state.user);
  const user = userOverride ?? storeUser;
  const isAuthor = user?.role === "author";

  const fetchCounts = useAppStore(useCallback((state) => state.fetchCounts, []));

  useEffect(() => {
    if (isAuthor && user?.id) {
      let isMounted = true;
      fetchCounts(user.id).catch((err) => {
        if (isMounted) console.error("Failed to fetch counts:", err);
      });
      return () => {
        isMounted = false;
      };
    }
  }, [isAuthor, user?.id, fetchCounts]);

  const getProfileUrl = useCallback((pic: User["profilePicture"]): string | null => {
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
  }, []);

  const picUrl = getProfileUrl(user?.profilePicture);
  const hasProfilePicture = typeof picUrl === "string" && picUrl.trim().length > 0;
  const displayName = user?.name || user?.username || "Author";
  const bio = user?.bio;

  const fallbackInitials = useMemo(() => {
    const parts = displayName.trim().split(/\s+/).filter(Boolean).slice(0, 2);
    if (parts.length === 0) return "A";
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
  }, [displayName]);

  const memberSince = useMemo(() => {
    if (!user?.createdAt) return "recently";
    const year = new Date(user.createdAt).getFullYear();
    return isNaN(year) ? "recently" : year.toString();
  }, [user?.createdAt]);

  const displayBio = bio || `Member since ${memberSince}`;

  const stats = [
    { label: "Books", value: user?.bookCount ?? 0 },
    { label: "Articles", value: user?.articleCount ?? 0 },
    ...(user?.followersCount !== undefined ? [{ label: "Followers", value: user.followersCount }] : []),
    ...(user?.followingCount !== undefined ? [{ label: "Following", value: user.followingCount }] : []),
  ];

  const handleShare = async () => {
    const url = `${window.location.origin}/profile/${user?.id || user?.username}`;
    try {
      await navigator.clipboard.writeText(url);
      alert("Profile link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col md:flex-row gap-10 items-center md:items-start mb-16 animate-pulse">
        <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-zinc-200" />
        <div className="flex-1 flex flex-col items-center md:items-start space-y-5 w-full">
          <div className="h-10 bg-zinc-200 w-48 rounded-none" />
          <div className="h-4 bg-zinc-200 w-72 rounded-none" />
          <div className="flex gap-8 justify-center md:justify-start">
            <div className="h-16 w-20 bg-zinc-200 rounded-none" />
            <div className="h-16 w-20 bg-zinc-200 rounded-none" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#0A192F] px-8 py-10 mb-10 text-white relative w-full"
    >
      {isOwnProfile && (
        <Link 
          href="/profile/settings" 
          className="absolute top-6 right-6 p-2 bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
          title="Pen Club Settings"
        >
          <IoSettingsOutline size={18} />
        </Link>
      )}

      <div className="max-w-5xl mx-auto flex flex-col items-center">
        {/* Top Content Row */}
        <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-start gap-10 md:gap-14 mb-10">
          {/* Profile Picture (Left on Desktop) */}
          <div className="relative shrink-0">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-none border-2 border-white/20 p-1">
              <div className="w-full h-full relative overflow-hidden bg-white/5">
                {hasProfilePicture ? (
                  <Image
                    src={picUrl!}
                    alt={displayName}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20 font-serif font-bold text-5xl">
                    {fallbackInitials}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* User Info (Right on Desktop) */}
          <div className="flex-1 space-y-4 text-center md:text-left w-full">
            <div className="space-y-3">
              <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight leading-tight">
                {displayName}
              </h1>
              <p className="text-base md:text-lg font-serif italic text-white/70 max-w-2xl">
                {displayBio}
              </p>
            </div>

            {user?.interests && user.interests.length > 0 && (
              <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                {(Array.isArray(user.interests) 
                  ? user.interests 
                  : typeof user.interests === 'string' 
                    ? (user.interests as string).split(',').map(i => i.trim()).filter(Boolean)
                    : []
                ).map((tag) => (
                  <span key={tag} className="px-4 py-1.5 border border-white/20 text-[10px] font-sans font-bold uppercase tracking-widest text-white/80">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="w-full max-w-3xl border border-white/10 p-6 grid grid-cols-2 md:grid-cols-4 gap-6 relative">
          {stats.map((stat, idx) => (
            <div key={stat.label} className="relative flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-serif font-bold mb-1">{stat.value}</span>
              <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-white/40">{stat.label}</span>
              {idx < stats.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 h-10 w-[1px] bg-white/10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.header>
  );
};

export default UserDetails;