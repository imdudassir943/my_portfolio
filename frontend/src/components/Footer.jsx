import React from "react";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 relative text-white pt-16 pb-8 overflow-hidden">
      {/* Glowing Orbs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Brand */}
        <div className="flex items-center justify-center mb-6">
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            &lt;/&gt;Portfolio
          </span>
        </div>

        {/* Quick Links */}
        <div className="flex justify-center space-x-8 mb-6 flex-wrap text-lg">
          <a href="#hero" className="hover:text-purple-400 transition-colors">Home</a>
          <a href="#work" className="hover:text-purple-400 transition-colors">Projects</a>
          <a href="#skills" className="hover:text-purple-400 transition-colors">Skills</a>
          <a href="#contact" className="hover:text-purple-400 transition-colors">Contact</a>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center space-x-6 mb-8">
          <a href="#" className="hover:text-purple-400 transition-transform hover:scale-110">
            <Github className="w-6 h-6" />
          </a>
          <a href="#" className="hover:text-purple-400 transition-transform hover:scale-110">
            <Linkedin className="w-6 h-6" />
          </a>
          <a href="#" className="hover:text-purple-400 transition-transform hover:scale-110">
            <Mail className="w-6 h-6" />
          </a>
        </div>

        {/* Newsletter / CTA */}
        <div className="text-center mb-8">
          <p className="text-gray-300 mb-4">Want to collaborate? Send me a message!</p>
          <a
            href="#contact"
            className="inline-block bg-gradient-to-r from-purple-500 to-cyan-500 px-8 py-3 rounded-full font-semibold hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
          >
            Get in Touch
          </a>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mb-4"></div>

        {/* Copyright */}
        <p className="text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Portfolio. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
