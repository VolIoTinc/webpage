import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-2 text-center">
      <p>&copy; {new Date().getFullYear()} VolIoT. All rights reserved.</p>
      <div className="flex items-center justify-evenly mt-1 text-gray-500 sm:text-2xs md:text-xs lg:text-sm">
        <a
          href="/penis"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-400"
        >
          Terms & Conditions
        </a>
        <a
          href="/contact"
          rel="noopener noreferrer"
          className="hover:text-blue-400"
        >
          Contact Us
        </a>
        <a
          href="/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-400"
        >
          Privacy Policy
        </a>
      </div>
      <p className="mt-0 text-right text-3xs">Webpage Handmade by VolIoT</p>
    </footer>
  );
};

export default Footer;
