import React from "react";
import { logo } from "@/public/images";
import Image from "next/image";

const Navbar = () => {
  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <Image src={logo} alt="logo" className="logo-image" />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
