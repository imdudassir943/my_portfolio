import React, { useState, useEffect } from "react";
import { GraduationCap, PlusCircle, ArrowLeft, Loader2, CheckCircle, AlertCircle, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AddEducation() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

  // --- API CONFIG ---
  const API_BASE_URL = "http://127.0.0.1:8000/api/portfolio/admin/education/";
  const API_REFRESH_URL = "http://127.0.0.1:8000/api/token/refresh/";
  const API_PROFILE_URL = "http://127.0.0.1:8000/api/portfolio/profile/";

  // --- USER & PROFILE STATE ---
  const [user, setUser] = useState({ name: "Admin", email: "admin@example.com" });
  const [profileImage, setProfileImage] = useState(null);

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
        // Assuming profile returns a list, take the first item
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
    setTimeout(() => setIsVisible(true), 100);

    const storedUser = localStorage.getItem("user_info");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser({
        name: parsed.first_name ? `${parsed.first_name} ${parsed.last_name}` : (parsed.username || "Admin"),
        email: parsed.email || "admin@example.com"
      });
    }

    fetchProfileData();

    if (statusMsg.text) {
      const timer = setTimeout(() => setStatusMsg({ type: "", text: "" }), 4000);
      return () => clearTimeout(timer);
    }
  }, [statusMsg.text]);

  // --- FORM STATE ---
  const [form, setForm] = useState({
    order: 0,
    institution: "",
    degree_title: "",
    field_of_study: "",
    start_year: "",
    end_year: "",
    marks_percentage: "",
    grade: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let token = getAuthToken();

    const payload = {
      ...form,
      order: parseInt(form.order) || 0,
      start_year: parseInt(form.start_year),
      end_year: form.end_year ? parseInt(form.end_year) : null,
      marks_percentage: form.marks_percentage ? parseFloat(form.marks_percentage) : null,
    };

    try {
      let response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        token = await refreshAccessToken();
        if (token) {
          response = await fetch(API_BASE_URL, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
        } else {
          navigate("/login");
          return;
        }
      }

      if (response.ok) {
        setStatusMsg({ type: "success", text: "Education added successfully!" });
        setTimeout(() => navigate("/education-view"), 1500);
      } else {
        const errorData = await response.json();
        setStatusMsg({ type: "error", text: errorData.detail || "Failed to save. Please check inputs." });
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

      {/* --- PROFILE HEADER --- */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full border border-indigo-500 shadow-lg bg-slate-700 flex items-center justify-center overflow-hidden">
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
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-5 py-3 rounded-xl text-white text-sm font-semibold shadow-md transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      <div className="flex items-center justify-center gap-3 mb-8">
        <GraduationCap size={35} className="text-indigo-400" />
        <h1 className="text-3xl font-bold text-center text-white">Add New Education</h1>
      </div>

      <div className={`bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-lg transition-all duration-500 ${isVisible ? "opacity-100" : "opacity-0"} max-w-4xl mx-auto`}>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form fields same as before... */}
          <div>
            <label className="text-sm text-gray-300 mb-1 block">Order</label>
            <input type="number" name="order" value={form.order} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-indigo-500 outline-none" placeholder="1" />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-gray-300 mb-1 block">Institution</label>
            <input type="text" name="institution" value={form.institution} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-indigo-500 outline-none" placeholder="University Name" required />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-gray-300 mb-1 block">Degree Title</label>
            <input type="text" name="degree_title" value={form.degree_title} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-indigo-500 outline-none" placeholder="BS Computer Science" required />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-gray-300 mb-1 block">Field of Study (Optional)</label>
            <input type="text" name="field_of_study" value={form.field_of_study} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-indigo-500 outline-none" placeholder="Artificial Intelligence" />
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-1 block">Start Year</label>
            <input type="number" name="start_year" value={form.start_year} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-indigo-500 outline-none" placeholder="2021" required />
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-1 block">End Year (Optional)</label>
            <input type="number" name="end_year" value={form.end_year} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-indigo-500 outline-none" placeholder="2025" />
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-1 block">Marks Percentage (Optional)</label>
            <input type="number" step="0.01" name="marks_percentage" value={form.marks_percentage} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-indigo-500 outline-none" placeholder="85.50" />
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-1 block">Grade (Optional)</label>
            <input type="text" name="grade" value={form.grade} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-indigo-500 outline-none" placeholder="A+" />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-gray-300 mb-1 block">Description (Optional)</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows="4" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-indigo-500 outline-none" placeholder="Short notes..." />
          </div>

          <div className="md:col-span-2 flex justify-between mt-6">
             <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition shadow-md">
               Cancel
             </button>

            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl text-white text-sm font-semibold shadow-md transition ${loading ? "bg-gray-600 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <PlusCircle size={18} />}
              {loading ? "Adding..." : "Add Education"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}