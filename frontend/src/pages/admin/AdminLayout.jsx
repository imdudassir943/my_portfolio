// components/AdminLayout.jsx (or wherever you store layouts)
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Briefcase,
  UserCircle,
  LayoutDashboard,
  FolderKanban,
  BadgeCheck,
  Mail,
  GraduationCap,
  LogOut,
} from "lucide-react";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();

  const logout = () => {
    // 1. Clear the tokens
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_info");
    
    // 2. Redirect to login
    navigate("/admin-login");
  };

  const linkClasses =
    "flex items-center gap-3 px-3 py-2 rounded-lg transition";

  return (
    <div className="flex min-h-screen bg-slate-900 text-white"> 
      {/* Note: I removed pt-24 to make the sidebar full height */}

      {/* ================= Sidebar ================= */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 py-8 px-4 flex flex-col fixed h-full z-50">
        <h1 className="text-2xl font-bold text-purple-300 mb-8 pl-2">
          Admin Panel
        </h1>

        <nav className="flex flex-col gap-3">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? "bg-slate-800 text-purple-300" : "hover:bg-slate-800"}`
            }
          >
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>

          <NavLink
            to="/profile-view"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? "bg-slate-800 text-purple-300" : "hover:bg-slate-800"}`
            }
          >
            <UserCircle size={20} /> Profile
          </NavLink>

          <NavLink
            to="/projects-view"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? "bg-slate-800 text-purple-300" : "hover:bg-slate-800"}`
            }
          >
            <FolderKanban size={20} /> Projects
          </NavLink>

          <NavLink
            to="/experience-view"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? "bg-slate-800 text-purple-300" : "hover:bg-slate-800"}`
            }
          >
            <Briefcase size={20} /> Experience
          </NavLink>

          <NavLink
            to="/skills-view"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? "bg-slate-800 text-purple-300" : "hover:bg-slate-800"}`
            }
          >
            <BadgeCheck size={20} /> Skills
          </NavLink>

          <NavLink
            to="/messages-view"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? "bg-slate-800 text-purple-300" : "hover:bg-slate-800"}`
            }
          >
            <Mail size={20} /> Messages
          </NavLink>

          <NavLink
            to="/education-view"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? "bg-slate-800 text-purple-300" : "hover:bg-slate-800"}`
            }
          >
            <GraduationCap size={20} /> Education
          </NavLink>
        </nav>

        <button
          onClick={logout}
          className="mt-auto flex items-center gap-3 px-3 py-2 bg-red-600/20 border border-red-600/50 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition"
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* ================= Main Content ================= */}
      {/* Added ml-64 to push content to the right of the fixed sidebar */}
      <main className="flex-1 p-10 ml-64 bg-slate-900 min-h-screen">
        {children}
      </main>
    </div>
  );
}