"use client";

import "../Navbar/Navbar.css";
import { logo } from "@/public/images";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { GiHamburgerMenu } from "react-icons/gi";
import { ImCross } from "react-icons/im";
import { motion, AnimatePresence } from "motion/react";
import { useAppStore } from "@/src/lib/store/store";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/bookshelf", label: "Books" },
  { href: "/articles", label: "Articles" },
  { href: "/podcast", label: "Podcast" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact Us" },
];
const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState("");
  const user = useAppStore((state) => state.user);
  const hydrated = useAppStore((state) => state.hydrated);
  const isHomePage = pathname === "/";
  const showSolidNavbar = !isHomePage || scrolled;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [menuOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const syncHash = () => setCurrentHash(window.location.hash || "");
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const openProfile = () => {
    closeMenu();
    router.push("/profile");
  };

  const isActiveLink = (href: string) => {
    if (href.startsWith("#")) {
      return isHomePage && currentHash === href;
    }

    if (href === "/bookshelf") return pathname.startsWith("/bookshelf");
    if (href === "/articles") return pathname.startsWith("/articles");
    return pathname === href;
  };

  const getProfileUrl = (pic: unknown) => {
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
      // @ts-expect-error profilePicture may come from API as a cloudinary-like object
      return pic.secure_url || pic.url || null;
    }
    return null;
  };

  const picUrl = getProfileUrl(user?.profilePicture);
  const hasProfilePicture = typeof picUrl === "string" && picUrl.trim().length > 0;

  const profileDisplayName = user?.name ?? user?.username ?? "User";
  const nameParts = profileDisplayName.trim().split(/\s+/).filter(Boolean);
  const profileInitials =
    nameParts.length > 1
      ? `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase()
      : (nameParts[0]?.charAt(0).toUpperCase() || "U");

  const profileChip = (
    <Link
      href="/profile"
      className="group relative flex items-center justify-center"
      onClick={(e) => {
        e.preventDefault();
        openProfile();
      }}
      aria-label="Profile"
    >
      <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-primary/10 bg-white shadow-sm transition-all duration-500 group-hover:border-primary group-hover:shadow-md overflow-hidden">
        {/* Outer Ring Animation */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-primary/5 transition-all duration-700 scale-110 group-hover:scale-100" />
        
        <div className="relative h-full w-full overflow-hidden rounded-full border border-primary/5">
          {hasProfilePicture ? (
            <img
              src={picUrl!}
              alt={user?.name ?? user?.username ?? "Profile"}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary/[0.03] text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <span className="text-[10px] font-sans font-black uppercase tracking-widest">
                {profileInitials}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );

  return (
    <>
      <nav
        className={`navbar fixed w-full top-0 z-[999] transition-all duration-500 
          ${isHomePage && !scrolled
            ? "bg-transparent border-transparent shadow-none"
            : "bg-white/60 dark:bg-black/60 backdrop-blur-lg border-b border-primary/50"
          }`}
      >
        <div className="w-full max-w-[95%] mx-auto px-6 relative flex items-center justify-between py-1 font-sans">
          <Link href="/" className="logo" onClick={closeMenu}>
            <Image
              src={logo}
              alt="logo"
              className="w-[30px] md:w-[45px] h-auto"
            />
          </Link>

          <div className="nav-menu text-primary">
            <div>
              <h3 className="uppercase text-center md:text-xl font-bold text-lg font-brand">
                pen club
              </h3>
            </div>

            {/* DESKTOP MENU */}
            <div className="menu-items hidden lg:block uppercase mt-1">
              <ul className="flex w-full items-center gap-3 md:w-auto">
                {navLinks.map((link) => (
                  <li key={link.href} className={isActiveLink(link.href) ? "active" : ""}>
                    {link.href.startsWith("/") ? (
                      <Link href={link.href}>
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.href} onClick={() => setCurrentHash(link.href)}>
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="contacts flex items-center gap-3">
            <div className="hidden lg:block">
              {hydrated && user ? profileChip : (
                <Link
                  href="/sign-in"
                  className="cursor-pointer border border-primary hover:bg-transparent hover:text-primary duration-300 font-medium bg-primary py-2 px-8 text-center rounded-none text-white text-sm tracking-widest uppercase font-sans"
                >
                  Sign in
                </Link>
              )}
            </div>

            <button
              className="lg:hidden text-2xl text-primary transition-all active:scale-90"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Menu"
            >
              {menuOpen ? <ImCross size={20} /> : <GiHamburgerMenu />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE OVERLAY MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[1000] bg-primary flex flex-col p-8 pt-24 lg:hidden"
          >
            {/* Dedicated Close Button */}
            <button
              onClick={closeMenu}
              className="absolute top-8 right-8 text-white text-2xl hover:opacity-70 transition-opacity cursor-pointer"
              aria-label="Close Menu"
            >
              <ImCross size={24} />
            </button>

            <div className="flex flex-col h-full">
              <div className="mb-12">
                <span className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-white/30">
                  Navigation
                </span>
              </div>

              <ul className="space-y-6">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.3 + i * 0.1,
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1] as any
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      className="text-4xl md:text-5xl font-serif font-black text-white hover:text-white/60 transition-colors inline-block"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-auto pt-10 border-t border-white/10 flex flex-col gap-6">
                {hydrated && user ? (
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.8,
                      duration: 0.6
                    }}
                    className="flex items-center gap-4"
                  >
                    <Link href="/profile" onClick={closeMenu} className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20">
                        {hasProfilePicture ? (
                          <img src={picUrl!} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-white/10 flex items-center justify-center text-white font-bold">
                            {profileInitials}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white font-serif font-bold text-lg">{profileDisplayName}</span>
                        <span className="text-white/40 text-[10px] uppercase tracking-widest">View Profile</span>
                      </div>
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.8,
                      duration: 0.6
                    }}
                  >
                    <Link
                      href="/sign-in"
                      onClick={closeMenu}
                      className="block w-full min-w-[150px] bg-white text-primary py-4 text-center font-sans font-black text-xs uppercase tracking-widest"
                    >
                      Sign In
                    </Link>
                  </motion.div>
                )}

                <div className="flex gap-6">
                  {["Instagram", "Twitter", "Medium"].map((social, i) => (
                    <motion.a
                      key={social}
                      href="#"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 1.0 + i * 0.1,
                        duration: 0.5
                      }}
                      className="text-[10px] font-sans font-bold uppercase tracking-widest text-white/40 hover:text-white"
                    >
                      {social}
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
