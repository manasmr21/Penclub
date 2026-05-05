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
      // @ts-expect-error profilePicture may come from API
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
      <div className="flex flex-col md:flex-row gap-10 items-start mb-16 animate-pulse">
        <div className="w-40 h-40 md:w-48 md:h-48 rounded-none bg-zinc-200" />
        <div className="flex-1 space-y-5">
          <div className="h-10 bg-zinc-200 w-48 rounded-none" />
          <div className="h-4 bg-zinc-200 w-72 rounded-none" />
          <div className="flex gap-8">
            <div className="h-16 w-20 bg-zinc-200 rounded-none" />
            <div className="h-16 w-20 bg-zinc-200 rounded-none" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row gap-10 items-start mb-16 relative w-full"
    >
      <div className="relative group shrink-0">
        <div className="w-40 h-40 md:w-48 md:h-48 rounded-none overflow-hidden shadow-2xl rotate-1 group-hover:rotate-0 transition-transform duration-500 bg-black/5">
          {hasProfilePicture ? (
            <Image
              src={picUrl!}
              alt={displayName}
              width={400}
              height={400}
              className="object-cover w-full h-full"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-primary/40 font-serif font-bold text-6xl">
              {fallbackInitials}
            </div>
          )}
        </div>
        {isAuthor && (
          <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-primary rounded-none flex items-center justify-center text-white shadow-lg">
            <IoCheckmarkCircle className="text-2xl" />
          </div>
        )}
      </div>

      <div className="flex-1 space-y-6 w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary tracking-tight mb-2 capitalize">
              {displayName}
            </h1>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-sans tracking-widest text-primary/50 uppercase">
                @{user?.username || displayName.toLowerCase().replace(/\s/g, "")}
              </span>
            </div>
            <p className="text-lg italic text-primary/70 max-w-xl leading-relaxed font-serif">
              "{displayBio}"
            </p>
          </div>
          
          {isOwnProfile ? (
            <Link href="/profile/settings" className="bg-primary text-white px-8 py-3 rounded-none font-sans font-semibold text-sm hover:opacity-90 transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2 w-full max-w-[150px]">
              <IoSettingsOutline size={16} /> Settings
            </Link>
          ) : (
            <button onClick={handleShare} className="border border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-none font-sans font-semibold text-sm transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2 w-full max-w-[150px]">
              <Share2 size={16} /> Share
            </button>
          )}
        </div>

        <div className="flex flex-nowrap gap-4 sm:gap-8 pt-6 border-t border-primary/20 overflow-x-auto no-scrollbar">
          {stats.map((stat) => (
            <div key={stat.label} className="text-left shrink-0">
              <span className="block text-xl md:text-2xl font-serif font-bold text-primary">{stat.value}</span>
              <span className="text-[10px] md:text-xs font-sans uppercase tracking-widest text-primary/60">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.header>
  );
};

export default UserDetails;