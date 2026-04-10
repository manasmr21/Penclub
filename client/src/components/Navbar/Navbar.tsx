"use client";

import "../Navbar/Navbar.css"
import { logo } from "@/public/images";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { GiHamburgerMenu } from "react-icons/gi";
import { ImCross } from "react-icons/im";
import { useAppStore } from "@/src/lib/store/store";
import { logoutUser } from "@/src/lib/auth-api";
import { extractErrorMessage } from "@/src/lib/http-client";

const navLinks = [
  { href: "#magazine", label: "Magazine" },
  { href: "/bookshelf", label: "Books" },
  { href: "/articles", label: "Articles" },
  { href: "#podcast", label: "Podcast" },
  { href: "#events", label: "Events" },
  { href: "#contact", label: "Contact Us" },
];
const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState("");
  const user = useAppStore((state) => state.user);
  const hydrated = useAppStore((state) => state.hydrated);
  const clearAuth = useAppStore((state) => state.clearAuth);
  const setError = useAppStore((state) => state.setError);
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

  const isActiveLink = (href: string) => {
    if (href.startsWith("#")) {
      return isHomePage && currentHash === href;
    }

    if (href === "/bookshelf") return pathname.startsWith("/bookshelf");
    if (href === "/articles") return pathname.startsWith("/articles");
    return pathname === href;
  };

  const handleLogout = async () => {
    setError(null);
    try {
      if (user) {
        await logoutUser();
      }
    } catch (error) {
      const message = extractErrorMessage(error, "Logout failed.");
      setError(message);
      alert(message);
    } finally {
      clearAuth();
      closeMenu();
      router.push("/");
      router.refresh();
    }
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
      //@ts-expect-error
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
    <div className="group relative">
      <Link
        href="/profile"
        className="flex items-center rounded-full border border-primary/15 bg-white/80 p-2 text-primary transition hover:border-primary"
        onClick={closeMenu}
      >
        <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
          {hasProfilePicture ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={picUrl}
              alt={user?.name ?? user?.username ?? "Profile"}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xs font-semibold text-slate-600">
              {profileInitials}
            </span>
          )}
        </span>
      </Link>

      <div className="invisible absolute right-0 top-[calc(100%+0.45rem)] z-[1001] w-44 rounded-xl border border-primary/15 bg-white p-1 opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <Link
          href="/profile"
          className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          onClick={closeMenu}
        >
          My profile
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-0.5 block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 "
        >
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      <nav
        className={`navbar fixed w-full top-0 z-[999] transition-all duration-300 ${showSolidNavbar ? "bg-background" : "bg-transparent"
          }`}
      >
        <div className="main-container relative flex items-center justify-between py-2 font-inter">
          <Link href="/" className="logo" onClick={closeMenu}>
            <Image
              src={logo}
              alt="logo"
              className="w-[30px] md:w-[65px] h-auto"
            />
          </Link>

          <div className="nav-menu text-primary">
            <div>
              <h3 className="uppercase text-center md:text-3xl font-bold text-2xl font-logo">
                pen club
              </h3>
            </div>

            <div
              className="menu-items uppercase mt-2"
              menu-open={`${menuOpen}`}
            >
              <ul className="flex gap-3">
                {navLinks.map((link) => (
                  <li key={link.href} className={isActiveLink(link.href) ? "active" : ""}>
                    {link.href.startsWith("/") ? (
                      <Link href={link.href} onClick={closeMenu}>
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.href} onClick={() => { setCurrentHash(link.href); closeMenu(); }}>
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}

                <li className="responsive-contact hidden">
                  {hydrated && user ? (
                    profileChip
                  ) : (
                    <Link href="/sign-in" onClick={closeMenu}>
                      Sign in
                    </Link>
                  )}
                </li>
              </ul>

              <div
                className="close-burger hidden"
                onClick={() => setMenuOpen(false)}
              >
                <ImCross />
              </div>
            </div>
          </div>

          <div className="contacts flex items-center gap-3">
            {hydrated && user ? (
              profileChip
            ) : (
              <Link
                href="/sign-in"
                className="cursor-pointer border border-transparent hover:bg-transparent hover:border-primary duration-300 hover:text-primary font-medium bg-primary py-2 w-[150px] text-center rounded-full text-white text-lg"
              >
                Sign in
              </Link>
            )}
          </div>

          <div
            className="burger-menu hidden text-3xl"
            onClick={() => setMenuOpen(true)}
          >
            <GiHamburgerMenu />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
