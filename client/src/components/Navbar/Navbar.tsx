"use client";

import { logo, contact } from "@/public/images";
import Image from "next/image";
import { useEffect, useState } from "react";
import "./Navbar.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { ImCross } from "react-icons/im";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when menu open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [menuOpen]);

  return (
    <>
      <nav
        className={`navbar fixed w-full top-0 z-[999] transition-all duration-300 ${
          scrolled ? "bg-background shadow-md" : "bg-transparent"
        }`}
      >
        <div className="main-container relative flex items-center justify-between py-2 font-inter">
          {/* LOGO */}
          <div className="logo">
            <Image
              src={logo}
              alt="logo"
              className="w-[30px] md:w-[65px] h-auto"
            />
          </div>

          {/* CENTER MENU */}
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
                <li>magazine</li>
                <li>books</li>
                <li>podcast</li>
                <li>events</li>

                <div className="responsive-contact hidden">
                  <button>9534545333</button>
                </div>
              </ul>

              <div
                className="close-burger hidden"
                onClick={() => setMenuOpen(false)}
              >
                <ImCross />
              </div>
            </div>
          </div>

          {/* CONTACTS (DESKTOP) */}
          <div className="contacts flex items-center gap-3">
            <Image
              src={contact}
              alt="contact"
              className="contact-image w-11 hover:rotate-25 duration-300"
            />
            <button className="cursor-pointer border border-transparent hover:bg-transparent hover:border-primary duration-300 hover:text-primary font-semibold bg-primary py-3 px-5 text-center rounded-full text-white">
              9534545333
            </button>
          </div>

          {/* BURGER */}
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