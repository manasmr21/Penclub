"use client";

import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer id="contact" className="bg-primary text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 md:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:justify-between">
          <div className="order-2 w-full text-center text-sm font-medium sm:w-auto md:order-1 md:text-left">
            &copy; {new Date().getFullYear()} Penclub
          </div>

          <div className="order-1 w-full text-center text-base font-quicksand font-semibold sm:text-lg md:order-2 md:w-auto">
            Penned with love
          </div>

          <div className="order-3 flex items-center justify-center gap-4 text-lg">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="transition hover:text-secondary"
            >
              <FaInstagram />
            </a>

            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="transition hover:text-secondary"
            >
              <FaTwitter />
            </a>

            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="transition hover:text-secondary"
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
