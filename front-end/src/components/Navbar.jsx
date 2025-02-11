import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-3 text-white flex justify-around sticky top-0 z-50">
      <Link
        to="/about"
        className="hover:text-blue-400 sm:text-sm md:text-lg lg:text-xl"
      >
        About
      </Link>
      <Link
        to="/services"
        className="hover:text-blue-400 sm:text-sm md:text-lg lg:text-xl"
      >
        Services
      </Link>
      <Link
        to="/"
        className="hover:text-blue-400 sm:text-lg md:text-xl lg:text-2xl"
      >
        VolIoT
      </Link>
      <Link
        to="/contact"
        className="hover:text-blue-400 sm:text-sm md:text-lg lg:text-xl"
      >
        Contact
      </Link>
      <Link
        to="/team"
        className="hover:text-blue-400 sm:text-sm md:text-lg lg:text-xl"
      >
        Team
      </Link>
    </nav>
  );
};

export default Navbar;
