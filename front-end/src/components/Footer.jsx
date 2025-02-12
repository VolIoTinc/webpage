import React from "react";
import { Link } from "react-router-dom";
import { FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-4 text-center">
      {/* Top Glow Effect */}
      <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-lg opacity-50"></div>

      {/* Copyright */}
      <p className="text-sm">
        &copy; {new Date().getFullYear()} VolIoT. All rights reserved.
      </p>

      {/* Navigation Links */}
      <div className="flex items-center justify-center space-x-6 mt-2 text-gray-400 text-xs md:text-sm">
        <Link to="/terms" className="hover:text-blue-400">
          Terms & Conditions
        </Link>
        <Link to="/contact" className="hover:text-blue-400">
          Contact Us
        </Link>
        <Link to="/privacy-policy" className="hover:text-blue-400">
          Privacy Policy
        </Link>
      </div>

      {/* Social Media Links */}
      <div className="flex justify-center space-x-4 mt-4 text-gray-400">
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-400"
        >
          <FaLinkedin size={20} />
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-400"
        >
          <FaTwitter size={20} />
        </a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-400"
        >
          <FaGithub size={20} />
        </a>
      </div>

      {/* Handmade Credit */}
      <p className="mt-2 text-gray-500 text-xs">Webpage Handmade by VolIoT</p>
    </footer>
  );
};

export default Footer;
