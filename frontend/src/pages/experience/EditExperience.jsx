import React, { useState, useEffect } from "react";
import { Save, ArrowLeft, CheckCircle, AlertCircle, Loader2, User } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditExperience() {
  const navigate = useNavigate();
  const { id } = useParams();

  // --- API CONFIG ---
  const API_BASE_URL = `http://127.0.0.1:8000/api/portfolio/admin/experience/${id}/`;
  const API_REFRESH_URL = "http://127.0.0.1:8000/api/token/refresh/";
  const API_PROFILE_URL = "http://127.0.0.1:8000/api/portfolio/profile/";

  // --- STATE ---
  const [user, setUser] = useState({ name: "Admin", email: "admin@example.com" });
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
  const [form, setForm] = useState({
    job_title: "",
    company: "",
    location: "",
    start_date: "",
    end_date: "",
    is_current: false,
    description: "",
    order: 0,
  });

  // --- AUTH HELPERS ---
  const getAuthToken = () => localStorage.getItem("access_token") || localStorage.getItem("access");

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refresh_token") || localStorage.getItem("refresh");
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
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (profRes.ok) {
          const profData = await profRes.json();
          if (Array.isArray(profData) && profData.length > 0) {
            setProfileImage(profData[0].profile_image);
          }
        }
      } catch (err) { console.error("Profile fetch error", err); }

      // 2. Fetch Experience Data
      try {
        let response = await fetch(API_BASE_URL, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.status === 401) {
          token = await refreshAccessToken();
          if (token) {
            response = await fetch(API_BASE_URL, {
              headers: { "Authorization": `Bearer ${token}` }
            });
          } else {
            navigate("/login");
            return;
          }
        }

        if (response.ok) {
          const data = await response.json();
          setForm({
            ...data,
            end_date: data.end_date || "",
          });
        } else {
          setStatusMsg({ type: "error", text: "Could not load experience data." });
        }
      } catch (err) {
        setStatusMsg({ type: "error", text: "Connection error." });
      } finally {
        setFetching(false);
      }
    };

    // Set User Text info from LocalStorage
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

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let token = getAuthToken();
    const payload = { 
        ...form,
        end_date: form.is_current ? null : form.end_date,
        order: parseInt(form.order) || 0 
    };

    try {
      let response = await fetch(API_BASE_URL, {
        method: "PUT",
        headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        token = await refreshAccessToken();
        if (token) {
          response = await fetch(API_BASE_URL, {
            method: "PUT",
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload),
          });
        }
      }

      if (response.ok) {
        setStatusMsg({ type: "success", text: "Experience updated successfully!" });
        setTimeout(() => navigate("/experience-view"), 1500);
      } else {
        setStatusMsg({ type: "error", text: "Failed to update. Check inputs." });
      }
    } catch (error) {
      setStatusMsg({ type: "error", text: "Connection error." });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p>Fetching experience details...</p>
      </div>
    );
  }

  return (
    <div className="pt-6 px-6 pb-12 relative">
      {/* --- STATUS MODAL --- */}
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

        <button onClick={() => navigate("/experience-view")} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-5 py-3 rounded-xl text-white text-sm font-semibold shadow-md transition">
          <ArrowLeft size={18} /> Cancel Edit
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center text-white">Edit Experience</h1>

      <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-lg max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <label className="block">
            <span className="text-gray-300 font-medium text-sm">Job Title</span>
            <input type="text" name="job_title" value={form.job_title} onChange={handleChange} className="w-full mt-1 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-purple-500 outline-none transition" required />
          </label>
          <label className="block">
            <span className="text-gray-300 font-medium text-sm">Company</span>
            <input type="text" name="company" value={form.company} onChange={handleChange} className="w-full mt-1 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-purple-500 outline-none transition" required />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <label className="block">
            <span className="text-gray-300 font-medium text-sm">Location</span>
            <input type="text" name="location" value={form.location} onChange={handleChange} className="w-full mt-1 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-purple-500 outline-none transition" />
          </label>
          <label className="block">
            <span className="text-gray-300 font-medium text-sm">Sort Order</span>
            <input type="number" name="order" value={form.order} onChange={handleChange} className="w-full mt-1 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-purple-500 outline-none transition" />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <label className="block">
            <span className="text-gray-300 font-medium text-sm">Start Date</span>
            <input type="date" name="start_date" value={form.start_date} onChange={handleChange} className="w-full mt-1 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-purple-500 outline-none transition [color-scheme:dark]" required />
          </label>
          <label className="block">
            <span className="text-gray-300 font-medium text-sm">End Date</span>
            <input 
                type="date" 
                name="end_date" 
                value={form.end_date} 
                onChange={handleChange} 
                disabled={form.is_current}
                className={`w-full mt-1 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-purple-500 outline-none transition [color-scheme:dark] ${form.is_current ? "opacity-50 cursor-not-allowed" : ""}`} 
                required={!form.is_current}
            />
          </label>
        </div>

        <div className="mb-6">
          <label className="flex items-center gap-3 cursor-pointer group w-fit">
            <div className="relative">
                <input type="checkbox" name="is_current" checked={form.is_current} onChange={handleChange} className="sr-only" />
                <div className={`w-10 h-6 rounded-full transition-colors ${form.is_current ? 'bg-purple-600' : 'bg-slate-700'}`}></div>
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${form.is_current ? 'translate-x-4' : ''}`}></div>
            </div>
            <span className="text-gray-300 font-medium text-sm group-hover:text-white transition-colors">I currently work here</span>
          </label>
        </div>

        <label className="block mb-6">
          <span className="text-gray-300 font-medium text-sm">Job Description</span>
          <textarea name="description" value={form.description} onChange={handleChange} rows={5} className="w-full mt-1 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-purple-500 outline-none transition" />
        </label>

        <div className="flex justify-end gap-4 mt-8 border-t border-slate-700 pt-6">
          <button type="button" onClick={() => navigate("/experience-view")} className="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition font-medium">
            Cancel
          </button>
          <button type="submit" disabled={loading} className={`flex items-center gap-2 px-8 py-3 rounded-xl text-white text-sm font-bold shadow-md transition ${loading ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700"}`}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {loading ? "Updating..." : "Update Experience"}
          </button>
        </div>
      </form>
    </div>
  );
}