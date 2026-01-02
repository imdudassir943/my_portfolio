import React, { useState, useEffect } from "react";
import { Code2, Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // 1. Trigger Animation
    setIsVisible(true);

    // 2. Check Authentication/Role
    const checkAdminStatus = () => {
      const storedUser = localStorage.getItem("user_info");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          // Check if the user exists and has the 'admin' role
          // Note: Ensure your login response includes a 'role' field
          if (parsedUser && parsedUser.role === "admin") {
            setIsAdmin(true);
          }
        } catch (error) {
          console.error("Failed to parse user info:", error);
        }
      }
    };

    checkAdminStatus();
  }, []);

  return (
    <header
      className={`
        fixed top-0 left-0 w-full z-50 
        backdrop-blur-xl border-b border-white/10
        transition-all duration-1000 
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}
      `}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Code2 className="w-8 h-8 text-purple-400" />
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Portfolio
          </span>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-10 text-lg text-white font-medium">
          <NavLink
            to="/"
            className={({ isActive }) => 
              `hover:text-purple-400 transition-colors ${isActive ? "text-purple-400" : ""}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/projects"
            className={({ isActive }) => 
              `hover:text-purple-400 transition-colors ${isActive ? "text-purple-400" : ""}`
            }
          >
            Projects
          </NavLink>

          <NavLink
            to="/skills"
            className={({ isActive }) => 
              `hover:text-purple-400 transition-colors ${isActive ? "text-purple-400" : ""}`
            }
          >
            Skills
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) => 
              `hover:text-purple-400 transition-colors ${isActive ? "text-purple-400" : ""}`
            }
          >
            Contact
          </NavLink>

          {/* ADMIN ONLY LINK */}
          {isAdmin && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) => 
                `hover:text-purple-400 transition-colors font-bold ${isActive ? "text-purple-400" : "text-gray-300"}`
              }
            >
              Dashboard
            </NavLink>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div
          className="
            md:hidden bg-slate-900/95 backdrop-blur-xl 
            border-t border-white/10 text-center py-6 space-y-6
            absolute w-full left-0 shadow-2xl
          "
        >
          <NavLink
            to="/"
            className="block text-lg text-white hover:text-purple-400 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Home
          </NavLink>

          <NavLink
            to="/projects"
            className="block text-lg text-white hover:text-purple-400 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Projects
          </NavLink>

          <NavLink
            to="/skills"
            className="block text-lg text-white hover:text-purple-400 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Skills
          </NavLink>

          <NavLink
            to="/contact"
            className="block text-lg text-white hover:text-purple-400 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </NavLink>

          {/* ADMIN ONLY LINK MOBILE */}
          {isAdmin && (
            <NavLink
              to="/dashboard"
              className="block text-lg text-purple-300 font-bold hover:text-purple-400 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </NavLink>
          )}
        </div>
      )}
    </header>
  );
}