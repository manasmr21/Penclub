"use client";

import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <footer id="contact" className={isHome ? "bg-primary text-white" : "fixed bottom-0 w-full z-[998] bg-primary text-white shadow-[0_-4px_10px_rgba(0,0,0,0.1)]"}>
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-4">
        <div className="
          flex flex-col 
          md:flex-row 
          items-center 
          justify-between 
          gap-4
        ">
          
          {/* Left */}
          <div className="text-sm font-medium text-center md:text-left flex justify-center items-center">
             <span className="text-xl mr-2">©</span>{new Date().getFullYear()} Penclub
          </div>

          {/* Center */}
          <div className="text-xl font-quicksand  font-semibold text-center">
            Penned with love ❤️
          </div>

          {/* Right */}
          <div className="flex items-center gap-4 text-lg">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-secondary transition"
            >
              <FaInstagram />
            </a>

            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-secondary transition"
            >
              <FaTwitter />
            </a>

            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-secondary transition"
            >
              <FaYoutube />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
