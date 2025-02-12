import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/Vimg.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: "/about", label: "About" },
    { path: "/services", label: "Services" },
    { path: "/", label: "VolIoT", isBrand: true },
    { path: "/contact", label: "Contact" },
    { path: "/team", label: "Team" },
  ];

  return (
    <nav className="bg-gray-800 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src={logo}
              alt="Company Logo"
              className="h-8 w-8 md:h-10 md:w-10 rounded-full"
            />
            <span className="text-3xl font-bold text-blue-200">VolIoT</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map(({ path, label, isBrand }) =>
              !isBrand ? (
                <Link
                  key={path}
                  to={path}
                  className={`hover:text-blue-400 transition-all duration-300 ${
                    location.pathname === path
                      ? "border-b-2 border-blue-400"
                      : ""
                  }`}
                >
                  {label}
                </Link>
              ) : null
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden focus:outline-none"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 text-center py-4">
          {navLinks.map(({ path, label, isBrand }) =>
            !isBrand ? (
              <Link
                key={path}
                to={path}
                className="block py-2 hover:text-blue-400"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ) : null
          )}
        </div>
      )}

      {/* Bottom Glow Effect */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 shadow-lg opacity-50"></div>
    </nav>
  );
};

export default Navbar;
