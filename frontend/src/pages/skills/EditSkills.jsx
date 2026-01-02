import React, { useState, useEffect } from "react";
import { Save, ArrowLeft, CheckCircle, AlertCircle, Loader2, User } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditSkill() {
  const { id } = useParams(); // Get skill ID from URL
  const navigate = useNavigate();

  // --- API CONFIG ---
  const API_BASE_URL = `http://127.0.0.1:8000/api/portfolio/admin/skills/${id}/`;
  const API_REFRESH_URL = "http://127.0.0.1:8000/api/token/refresh/";
  const API_PROFILE_URL = "http://127.0.0.1:8000/api/portfolio/profile/";

  // --- STATE ---
  const [user, setUser] = useState({ name: "Admin", email: "admin@example.com" });
  const [profileImage, setProfileImage] = useState(null); // Real profile image state
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
  const [form, setForm] = useState({
    order: 0,
    name: "",
    level: "",
  });

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

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      let token = getAuthToken();

      // 1. Fetch Profile Data (Image)
      try {
        const profRes = await fetch(API_PROFILE_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (profRes.ok) {
          const profData = await profRes.json();
          if (Array.isArray(profData) && profData.length > 0) {
            setProfileImage(profData[0].profile_image);
          }
        }
      } catch (err) { console.error("Profile fetch error", err); }

      // 2. Fetch Skill Data
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
          }
        }

        if (response.ok) {
          const data = await response.json();
          setForm({
            order: data.order,
            name: data.name,
            level: data.level,
          });
        } else {
          setStatusMsg({ type: "error", text: "Could not find skill." });
        }
      } catch (error) {
        setStatusMsg({ type: "error", text: "Error loading skill data." });
      } finally {
        setFetching(false);
      }
    };

    // Set User textual info from LocalStorage
    const storedUser = localStorage.getItem("user_info");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser({
        name: parsed.first_name ? `${parsed.first_name} ${parsed.last_name}` : (parsed.username || "Admin"),
        email: parsed.email || "admin@example.com"
      });
    }

    fetchData();
  }, [id, navigate]);

  // --- AUTO-HIDE STATUS MSG ---
  useEffect(() => {
    if (statusMsg.text) {
      const timer = setTimeout(() => setStatusMsg({ type: "", text: "" }), 4000);
      return () => clearTimeout(timer);
    }
  }, [statusMsg]);

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ 
        ...form, 
        [name]: name === "order" ? parseInt(value) || 0 : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let token = getAuthToken();

    try {
      let response = await fetch(API_BASE_URL, {
        method: "PUT",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form),
      });

      if (response.status === 401) {
        token = await refreshAccessToken();
        if (token) {
          response = await fetch(API_BASE_URL, {
            method: "PUT",
            headers: { 
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(form),
          });
        }
      }

      if (response.ok) {
        setStatusMsg({ type: "success", text: "Skill updated successfully!" });
        setTimeout(() => navigate("/skills-view"), 1500);
      } else {
        setStatusMsg({ type: "error", text: "Update failed. Please check inputs." });
      }
    } catch (error) {
      setStatusMsg({ type: "error", text: "Connection error." });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
        <Loader2 className="animate-spin text-purple-500 mb-4" size={48} />
        <p className="text-gray-400">Loading skill details...</p>
      </div>
    );
  }

  return (
    <div className="pt-6 px-6 pb-12 relative min-h-screen">
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
          {/* Dynamic Profile Image Section */}
          <div className="w-14 h-14 rounded-full border border-purple-500 shadow-lg bg-slate-700 flex items-center justify-center overflow-hidden">
            {profileImage ? (
                <img src={profileImage} className="w-full h-full object-cover" alt="profile" />
            ) : (
                <User className="text-gray-400" size={24} />
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{user.name}</h2>
            <p className="text-gray-400 text-sm">{user.email}</p>
          </div>
        </div>

        <button 
          onClick={() => navigate("/skills-view")}
          className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-5 py-3 rounded-xl text-white text-sm font-semibold shadow-md transition"
        >
          <ArrowLeft size={18} />
          Back to Skills
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center text-white">Edit Skill</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-lg max-w-3xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <label className="block">
              <span className="text-gray-300 font-medium text-sm">Order</span>
              <input
                type="number"
                name="order"
                value={form.order}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-purple-500 outline-none transition"
                required
              />
            </label>

            <label className="block">
              <span className="text-gray-300 font-medium text-sm">Skill Name</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-purple-500 outline-none transition"
                required
              />
            </label>
        </div>

        <label className="block mb-6">
          <span className="text-gray-300 font-medium text-sm">Skill Level</span>
          <select
            name="level"
            value={form.level}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-purple-500 outline-none transition"
            required
          >
            <option value="">Select level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>
        </label>

        <div className="flex justify-between mt-8 border-t border-slate-700 pt-6">
          <button
            type="button"
            onClick={() => navigate("/skills-view")}
            className="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition shadow-md font-medium"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl text-white text-sm font-bold shadow-md transition transform active:scale-95 ${
              loading ? "bg-gray-600 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {loading ? "Updating..." : "Update Skill"}
          </button>
        </div>
      </form>
    </div>
  );
}
