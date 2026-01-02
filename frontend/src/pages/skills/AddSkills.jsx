import React, { useState, useEffect } from "react";
import { PlusCircle, ArrowLeft, Loader2, CheckCircle, AlertCircle, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AddSkill() {
  const navigate = useNavigate();

  // --- API CONFIG ---
  const API_BASE_URL = "http://127.0.0.1:8000/api/portfolio/skills/"; 
  const API_REFRESH_URL = "http://127.0.0.1:8000/api/token/refresh/";
  const API_PROFILE_URL = "http://127.0.0.1:8000/api/portfolio/profile/";

  // --- STATE ---
  const [user, setUser] = useState({ name: "Admin", email: "admin@example.com" });
  const [profileImage, setProfileImage] = useState(null); // Real profile image from DB
  const [loading, setLoading] = useState(false);
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

  // --- FETCH PROFILE DATA ---
  const fetchProfileData = async () => {
    let token = getAuthToken();
    try {
      let response = await fetch(API_PROFILE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        token = await refreshAccessToken();
        if (token) {
          response = await fetch(API_PROFILE_URL, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
      }

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setProfileImage(data[0].profile_image);
        }
      }
    } catch (error) {
      console.error("Failed to fetch profile image:", error);
    }
  };

  // --- EFFECTS ---
  useEffect(() => {
    // 1. Get name/email from local storage
    const storedUser = localStorage.getItem("user_info");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser({
        name: parsed.first_name ? `${parsed.first_name} ${parsed.last_name}` : (parsed.username || "Admin"),
        email: parsed.email || "admin@example.com"
      });
    }

    // 2. Fetch image from Database
    fetchProfileData();

    // 3. Status message timer
    if (statusMsg.text) {
      const timer = setTimeout(() => setStatusMsg({ type: "", text: "" }), 4000);
      return () => clearTimeout(timer);
    }
  }, [statusMsg.text]);

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "order" ? parseInt(value) || 0 : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let token = getAuthToken();

    const requestOptions = (authToken) => ({
      method: "POST",
      headers: {
        "Authorization": `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    try {
      let response = await fetch(API_BASE_URL, requestOptions(token));

      if (response.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          response = await fetch(API_BASE_URL, requestOptions(newToken));
        } else {
          navigate("/login");
          return;
        }
      }

      if (response.ok) {
        setStatusMsg({ type: "success", text: "Skill added successfully!" });
        setTimeout(() => navigate("/skills-view"), 1500);
      } else {
        const errorData = await response.json();
        setStatusMsg({ 
          type: "error", 
          text: errorData.detail || "Failed to save skill. Check permissions." 
        });
      }
    } catch (error) {
      setStatusMsg({ type: "error", text: "Connection error." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-6 px-6 pb-12 relative">
      
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

      <h1 className="text-3xl font-bold mb-8 text-center text-white">Add New Skill</h1>

      {/* --- FORM CARD --- */}
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-lg max-w-3xl mx-auto"
      >
        <label className="block mb-4">
          <span className="text-gray-300 font-medium">Order</span>
          <input
            type="number"
            name="order"
            value={form.order}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-purple-500 outline-none transition"
            placeholder="Skill display order"
            required
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-300 font-medium">Skill Name</span>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-purple-500 outline-none transition"
            placeholder="e.g. JavaScript, React, Django"
            required
          />
        </label>

        <label className="block mb-6">
          <span className="text-gray-300 font-medium">Skill Level</span>
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
            {loading ? <Loader2 className="animate-spin" size={18} /> : <PlusCircle size={18} />}
            {loading ? "Saving..." : "Save Skill"}
          </button>
        </div>
      </form>
    </div>
  );
}