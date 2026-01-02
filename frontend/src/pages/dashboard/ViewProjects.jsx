import React, { useState, useEffect } from "react";
import { 
  Pencil, 
  Trash2, 
  ExternalLink, 
  PlusCircle, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  User,
  X
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

export default function ViewProjects() {
  const navigate = useNavigate();
  
  // --- API CONFIG ---
  const API_BASE_URL = "http://127.0.0.1:8000/api/portfolio/add/projects/";
  const API_DETAIL_URL = "http://127.0.0.1:8000/api/portfolio/admin/projects/";
  const API_REFRESH_URL = "http://127.0.0.1:8000/api/token/refresh/";
  const API_PROFILE_URL = "http://127.0.0.1:8000/api/portfolio/profile/";

  // --- STATE ---
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false); // Loading state for delete button
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
  const [user, setUser] = useState({ name: "Admin", email: "admin@example.com" });
  const [profileImage, setProfileImage] = useState(null);
  
  // Modal State
  const [deleteModal, setDeleteModal] = useState({ show: false, projectId: null });

  // --- AUTH HELPERS ---
  const getAuthToken = () => localStorage.getItem("access_token") || localStorage.getItem("access");

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) return null;
    try {
      const response = await fetch(API_REFRESH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("access_token", data.access);
        return data.access;
      }
      return null;
    } catch (err) { return null; }
  };

  // --- FETCH DATA FUNCTIONS ---
  const fetchProfileImage = async () => {
    const token = getAuthToken();
    if (!token) return;
    try {
      const response = await fetch(API_PROFILE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) setProfileImage(data[0].profile_image);
      }
    } catch (error) { console.error("Error profile:", error); }
  };

  const fetchProjects = async () => {
    setLoading(true);
    let token = getAuthToken();
    try {
      let response = await fetch(API_BASE_URL, { headers: { Authorization: `Bearer ${token}` } });
      if (response.status === 401) {
        token = await refreshAccessToken();
        if (token) response = await fetch(API_BASE_URL, { headers: { Authorization: `Bearer ${token}` } });
      }
      if (response.ok) setProjects(await response.json());
    } catch (error) { setStatusMsg({ type: "error", text: "Network error." }); }
    finally { setLoading(false); }
  };

  // --- DELETE HANDLER ---
  const confirmDelete = async () => {
    const id = deleteModal.projectId;
    if (!id) return;

    setIsDeleting(true);
    let token = getAuthToken();
    const deleteUrl = `${API_DETAIL_URL}${id}/`;

    try {
      let response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 401) {
        token = await refreshAccessToken();
        if (token) {
          response = await fetch(deleteUrl, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
        }
      }

      if (response.status === 204 || response.ok) {
        setProjects(prev => prev.filter(p => p.id !== id));
        setStatusMsg({ type: "success", text: "Project deleted successfully!" });
      } else {
        setStatusMsg({ type: "error", text: "Delete failed." });
      }
    } catch (error) {
      setStatusMsg({ type: "error", text: "Connection error." });
    } finally {
      setIsDeleting(false);
      setDeleteModal({ show: false, projectId: null });
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user_info");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser({
        name: parsed.first_name ? `${parsed.first_name} ${parsed.last_name}` : (parsed.username || "Admin"),
        email: parsed.email || "admin@example.com"
      });
    }
    fetchProjects();
    fetchProfileImage();
  }, []);

  useEffect(() => {
    if (statusMsg.text) {
      const timer = setTimeout(() => setStatusMsg({ type: "", text: "" }), 3500);
      return () => clearTimeout(timer);
    }
  }, [statusMsg]);

  return (
    <div className="pt-6 px-6 pb-12 relative min-h-screen">
      
      {/* --- CUSTOM DELETE CONFIRMATION MODAL --- */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => !isDeleting && setDeleteModal({ show: false, projectId: null })}></div>
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl relative z-10 animate-in zoom-in duration-200">
            <div className="flex items-center gap-4 mb-4 text-red-400">
              <div className="bg-red-500/10 p-3 rounded-full">
                <Trash2 size={28} />
              </div>
              <h3 className="text-xl font-bold text-white">Delete Project?</h3>
            </div>
            <p className="text-gray-400 mb-8">
              Are you sure you want to delete this project? This action cannot be undone and will remove the data from your portfolio.
            </p>
            <div className="flex gap-3">
              <button 
                disabled={isDeleting}
                onClick={() => setDeleteModal({ show: false, projectId: null })}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                disabled={isDeleting}
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition flex items-center justify-center gap-2"
              >
                {isDeleting ? <Loader2 className="animate-spin" size={18} /> : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- STATUS NOTIFICATION --- */}
      {statusMsg.text && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 animate-in fade-in zoom-in duration-300">
          <div className={`px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border ${
            statusMsg.type === "success" ? "bg-emerald-500 text-white border-emerald-400" : "bg-red-500 text-white border-red-400"
          }`}>
            {statusMsg.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span className="font-medium">{statusMsg.text}</span>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border border-purple-500 shadow-lg">
            {profileImage ? (
              <img src={profileImage} className="w-full h-full object-cover" alt="profile" />
            ) : (
              <User className="text-gray-300 w-7 h-7" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{user.name}</h2>
            <p className="text-gray-400 text-sm">{user.email}</p>
          </div>
        </div>

        <NavLink to="/add-project" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-5 py-3 rounded-xl text-white text-sm font-semibold shadow-md transition transform hover:scale-105 active:scale-95">
          <PlusCircle size={18} />
          Add New Project
        </NavLink>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center text-white">Portfolio Projects</h1>

      {/* --- PROJECTS GRID --- */}
      {loading ? (
        <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
          <Loader2 className="animate-spin mb-4" size={40} />
          <p>Loading your amazing work...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-4 shadow-md hover:border-indigo-500/50 transition-all duration-300 group">
              <div className="relative overflow-hidden rounded-xl">
                <img src={project.image || "https://via.placeholder.com/400x250?text=No+Image"} alt={project.title} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" />
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="absolute top-2 right-2 p-2 bg-indigo-600/80 hover:bg-indigo-500 rounded-full text-white transition backdrop-blur-sm">
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>

              <h2 className="text-xl font-bold mt-4 text-white line-clamp-1">{project.title}</h2>
              <p className="text-gray-400 text-sm mt-2 line-clamp-2 h-10">{project.description}</p>

              <div className="flex items-center justify-between text-gray-500 text-xs mt-4 py-2 border-t border-slate-700/50">
                <span>Order: <b className="text-indigo-400">{project.order}</b></span>
                <span>{new Date(project.created_at).toLocaleDateString()}</span>
              </div>

              <div className="flex gap-3 mt-4">
                <button 
                  onClick={() => navigate(`/edit-project/${project.id}`)}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2.5 rounded-xl text-white text-sm transition"
                >
                  <Pencil size={15} /> Edit
                </button>
                <button 
                  onClick={() => setDeleteModal({ show: true, projectId: project.id })}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white px-4 py-2.5 rounded-xl text-sm transition border border-red-600/30 hover:border-red-600"
                >
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && projects.length === 0 && (
        <div className="text-center mt-20">
          <p className="text-gray-500 text-lg mb-4">No projects found in the database.</p>
          <NavLink to="/add-project" className="text-indigo-400 hover:underline">Start by adding your first project</NavLink>
        </div>
      )}
    </div>
  );
}