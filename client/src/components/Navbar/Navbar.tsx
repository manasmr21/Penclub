import React from "react";
import { logo, contact } from "@/public/images";
import Image from "next/image";

const Navbar = () => {
  return (
    <>
      <nav className="navbar fixed w-full top-0">
        <div className="main-container flex items-center justify-between px-4 py-2 font-inter">
          <div className="logo">
            <Image src={logo} alt="logo" className="logo-image" />
          </div>
          <div className="nav-menu text-primary">
            <div>
              <h3 className="uppercase text-center text-3xl font-bold">
                pen club
              </h3>
            </div>
            <div className="menu-items uppercase mt-2">
              <ul className="flex gap-3">
                <li className="cursor-pointer">magazine</li>
                <li className="cursor-pointer">books</li>
                <li className="cursor-pointer">podcast</li>
                <li className="cursor-pointer">events</li>
              </ul>
            </div>
          </div>
          <div className="contacts flex items-center gap-3">
            <Image src={contact} alt="contact" className="contact-image w-11" />
            <button className=" bg-primary py-3 px-5 text-center rounded-full">
              9534545333
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
