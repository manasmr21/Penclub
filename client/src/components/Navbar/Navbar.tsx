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

  return (
    <>
      <nav
        className={`navbar fixed w-full top-0 z-[999] ${
          scrolled ? "bg-background" : "bg-transparent"
        } `}
      >
        <div className="main-container flex items-center justify-between px-4 py-2 font-inter">
          <div className="logo">
            <Image
              src={logo}
              alt="logo"
              className="w-[30px] md:w-[65px] h-auto"
            />
          </div>
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
                <li className="cursor-pointer ">magazine</li>
                <li className="cursor-pointer ">books</li>
                <li className="cursor-pointer ">podcast</li>
                <li className="cursor-pointer ">events</li>
                <div className="responsive-contact hidden">
                  <button className=" bg-white py-3 px-5 text-center rounded-full text-primary">
                    9534545333
                  </button>
                </div>
              </ul>
              <div
                className="close-burger text-4xl hidden"
                onClick={() => setMenuOpen(false)}
              >
                <ImCross />
              </div>
            </div>
          </div>
          <div className="contacts flex items-center gap-3">
            <Image src={contact} alt="contact" className="contact-image w-11" />
            <button className=" bg-primary py-3 px-5 text-center rounded-full text-white">
              9534545333
            </button>
          </div>

          <div
            className="burger-menu hidden text-4xl"
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
