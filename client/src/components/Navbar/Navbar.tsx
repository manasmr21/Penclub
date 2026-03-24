"use client";

import { logo } from "@/public/images";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./Navbar.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { ImCross } from "react-icons/im";
import { useAuthStore } from "@/src/store/auth-store";

const navLinks = [
  { href: "#magazine", label: "Magazine" },
  { href: "#books", label: "Books" },
  { href: "#podcast", label: "Podcast" },
  { href: "#events", label: "Events" },
  { href: "#contact", label: "Contact Us" },
];

const Navbar = () => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
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

  const closeMenu = () => setMenuOpen(false);

  const profileChip = (
    <Link
      href="/profile"
      className="flex items-center gap-3 rounded-full border border-primary/15 bg-white/80 px-3 py-2 text-primary transition hover:border-primary"
      onClick={closeMenu}
    >
      <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
        {user?.profilePicture ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.profilePicture}
            alt={user.name}
            className="h-full w-full object-cover"
          />
        ) : null}
      </span>
      <span className="max-w-[120px] truncate text-sm font-semibold">
        {user?.name}
      </span>
    </Link>
  );

  return (
    <>
      <nav
        className={`navbar fixed w-full top-0 z-[999] transition-all duration-300 ${
          showSolidNavbar ? "bg-background" : "bg-transparent"
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
                  <li key={link.href}>
                    <a href={link.href} onClick={closeMenu}>
                      {link.label}
                    </a>
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
