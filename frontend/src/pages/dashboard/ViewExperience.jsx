import React, { useEffect, useState } from "react";
import { 
  Pencil, 
  Trash2, 
  PlusCircle, 
  MapPin, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  User 
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

export default function ViewExperience() {
  const navigate = useNavigate();
  
  // --- API CONFIG ---
  const API_BASE_URL = "http://127.0.0.1:8000/api/portfolio/admin/experience/";
  const API_REFRESH_URL = "http://127.0.0.1:8000/api/token/refresh/";
  const API_PROFILE_URL = "http://127.0.0.1:8000/api/portfolio/profile/";

  // --- STATE ---
  const [experienceList, setExperienceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
  const [user, setUser] = useState({ name: "Admin", email: "admin@example.com" });
  const [profileImage, setProfileImage] = useState(null);
  
  // Modal State
  const [deleteModal, setDeleteModal] = useState({ show: false, expId: null });

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
    } catch (error) { console.error("Error fetching profile:", error); }
  };

  const fetchExperiences = async () => {
    setLoading(true);
    let token = getAuthToken();
    try {
      let response = await fetch(API_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        token = await refreshAccessToken();
        if (token) {
          response = await fetch(API_BASE_URL, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          navigate("/login");
          return;
        }
      }

      if (response.ok) {
        const data = await response.json();
        setExperienceList(data);
      }
    } catch (error) {
      setStatusMsg({ type: "error", text: "Failed to load experiences." });
    } finally {
      setLoading(false);
    }
  };

  // --- DELETE HANDLER (CUSTOM MODAL VERSION) ---
  const confirmDelete = async () => {
    const id = deleteModal.expId;
    if (!id) return;

    setIsDeleting(true);
    let token = getAuthToken();
    const deleteUrl = `${API_BASE_URL}${id}/`;

    try {
      let response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        token = await refreshAccessToken();
        if (token) {
          response = await fetch(deleteUrl, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
        }
      }

      if (response.status === 204 || response.ok) {
        setExperienceList(prev => prev.filter(exp => exp.id !== id));
        setStatusMsg({ type: "success", text: "Experience deleted successfully!" });
      } else {
        setStatusMsg({ type: "error", text: "Delete failed." });
      }
    } catch (error) {
      setStatusMsg({ type: "error", text: "Connection error." });
    } finally {
      setIsDeleting(false);
      setDeleteModal({ show: false, expId: null });
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user_info");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser({
        name: parsed.first_name ? `${parsed.first_name} ${parsed.last_name}` : (parsed.username || "Admin"),
        email: parsed.email || "admin@example.com",
      });
    }
    fetchExperiences();
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
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
            onClick={() => !isDeleting && setDeleteModal({ show: false, expId: null })}
          ></div>
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl relative z-10 animate-in zoom-in duration-200">
            <div className="flex items-center gap-4 mb-4 text-red-400">
              <div className="bg-red-500/10 p-3 rounded-full">
                <Trash2 size={28} />
              </div>
              <h3 className="text-xl font-bold text-white">Delete Experience?</h3>
            </div>
            <p className="text-gray-400 mb-8">
              Are you sure you want to remove this record? This action will permanently delete this experience from your profile.
            </p>
            <div className="flex gap-3">
              <button 
                disabled={isDeleting}
                onClick={() => setDeleteModal({ show: false, expId: null })}
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

        <NavLink to="/add-experience" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-5 py-3 rounded-xl text-white text-sm font-semibold shadow-md transition transform hover:scale-105 active:scale-95">
          <PlusCircle size={18} />
          Add New Experience
        </NavLink>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center text-white">Work Experience</h1>

      {/* --- CONTENT --- */}
      {loading ? (
        <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
          <Loader2 className="animate-spin mb-4" size={40} />
          <p>Loading your career history...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {experienceList.map((exp) => (
            <div key={exp.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-md hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <h2 className="text-2xl font-bold text-blue-400 group-hover:text-indigo-400 transition-colors">{exp.job_title}</h2>
                <p className="text-gray-300 mt-1 font-medium">{exp.company}</p>
                
                {exp.location && (
                  <p className="flex items-center gap-1 text-gray-400 text-sm mt-2">
                    <MapPin size={14} /> {exp.location}
                  </p>
                )}

                <p className="text-gray-400 text-sm mt-4">
                  {exp.start_date} - {exp.is_current ? <span className="text-green-400 font-semibold">Present</span> : exp.end_date}
                </p>

                {exp.description && (
                  <p className="text-gray-400 text-sm mt-4 line-clamp-3 italic">"{exp.description}"</p>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => navigate(`/edit-experience/${exp.id}`)}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2.5 rounded-xl text-white text-sm transition"
                >
                  <Pencil size={15} /> Edit
                </button>
                <button 
                  onClick={() => setDeleteModal({ show: true, expId: exp.id })}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white px-4 py-2.5 rounded-xl text-sm transition border border-red-600/30 hover:border-red-600"
                >
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && experienceList.length === 0 && (
        <div className="text-center mt-20">
          <div className="bg-slate-800 inline-block p-6 rounded-full mb-4">
             <PlusCircle size={48} className="text-slate-600" />
          </div>
          <p className="text-gray-400 text-lg">No experience records found.</p>
          <NavLink to="/add-experience" className="text-indigo-400 hover:underline">Start by adding your first experience</NavLink>
        </div>
      )}
    </div>
  );
}