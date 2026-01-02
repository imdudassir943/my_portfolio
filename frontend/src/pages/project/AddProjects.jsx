import React, { useState, useEffect } from "react";
import { 
  PlusCircle, 
  Image as ImageIcon, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  User 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AddProject() {
  const navigate = useNavigate();

  // --- API CONFIG ---
  const API_BASE_URL = "http://127.0.0.1:8000/api/portfolio/add/projects/";
  const API_REFRESH_URL = "http://127.0.0.1:8000/api/token/refresh/";
  const API_PROFILE_URL = "http://127.0.0.1:8000/api/portfolio/profile/";

  // --- STATE ---
  const [user, setUser] = useState({ name: "Admin", email: "admin@example.com" });
  const [profileImage, setProfileImage] = useState(null); // Database profile pic
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
  const [preview, setPreview] = useState(null); // Project image preview
  const [form, setForm] = useState({
    order: 0,
    title: "",
    description: "",
    link: "",
    image: null,
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

  // --- FETCH DATA FUNCTIONS ---
  const fetchProfileData = async () => {
    const token = getAuthToken();
    if (!token) return;
    try {
      const response = await fetch(API_PROFILE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        // Assuming profile API returns an array or object with profile_image
        if (Array.isArray(data) && data.length > 0) {
          setProfileImage(data[0].profile_image);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  // --- EFFECTS ---
  useEffect(() => {
    // 1. Fetch User Info from localStorage
    const storedUser = localStorage.getItem("user_info");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser({
        name: parsed.first_name ? `${parsed.first_name} ${parsed.last_name}` : (parsed.username || "Admin"),
        email: parsed.email || "admin@example.com"
      });
    }

    // 2. Fetch Profile Image from Database
    fetchProfileData();

    // 3. Status message auto-hide
    if (statusMsg.text) {
      const timer = setTimeout(() => setStatusMsg({ type: "", text: "" }), 4000);
      return () => clearTimeout(timer);
    }
  }, [statusMsg.text]);

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      if (file) {
        setForm({ ...form, image: file });
        setPreview(URL.createObjectURL(file));
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let token = getAuthToken();
    const formData = new FormData();
    formData.append("order", String(form.order));
    formData.append("title", form.title);
    formData.append("description", form.description);
    if (form.link) formData.append("link", form.link);
    if (form.image) formData.append("image", form.image);

    try {
      let response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      });

      if (response.status === 401) {
        token = await refreshAccessToken();
        if (token) {
          response = await fetch(API_BASE_URL, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` },
            body: formData,
          });
        }
      }

      if (response.ok) {
        setStatusMsg({ type: "success", text: "Project added successfully!" });
        setTimeout(() => navigate("/projects-view"), 1500);
      } else {
        setStatusMsg({ type: "error", text: "Failed to save. Check inputs." });
      }
    } catch (error) {
      setStatusMsg({ type: "error", text: "Connection error." });
    } finally {
      setLoading(false);
    }
  };

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

        <button 
          onClick={() => navigate("/projects-view")}
          className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-5 py-3 rounded-xl text-white text-sm font-semibold shadow-md transition"
        >
          <ArrowLeft size={18} />
          Back to Projects
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center text-white">Add New Project</h1>

      {/* --- FORM CARD --- */}
      <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-lg max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block mb-4">
            <span className="text-gray-300 font-medium text-sm">Order</span>
            <input type="number" name="order" value={form.order} onChange={handleChange} className="w-full mt-1 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-purple-500 outline-none transition" />
          </label>

          <label className="block mb-4">
            <span className="text-gray-300 font-medium text-sm">Title</span>
            <input type="text" name="title" value={form.title} onChange={handleChange} className="w-full mt-1 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-purple-500 outline-none transition" required />
          </label>
        </div>

        <label className="block mb-4">
          <span className="text-gray-300 font-medium text-sm">Description</span>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full mt-1 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-purple-500 outline-none transition" required />
        </label>

        <label className="block mb-6">
          <span className="text-gray-300 font-medium text-sm">Project Image</span>
          <div className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-xl p-4 hover:border-purple-500 transition-colors cursor-pointer relative group">
            <input type="file" name="image" accept="image/*" onChange={handleChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" required />
            {preview ? (
              <img src={preview} alt="preview" className="w-full h-48 object-cover rounded-lg" />
            ) : (
              <div className="text-center py-4">
                <ImageIcon className="mx-auto text-gray-500 group-hover:text-purple-500 mb-2" size={40} />
                <p className="text-gray-500 text-sm font-medium">Click to upload image</p>
              </div>
            )}
          </div>
        </label>

        <label className="block mb-6">
          <span className="text-gray-300 font-medium text-sm">Project Link</span>
          <input type="url" name="link" value={form.link} onChange={handleChange} className="w-full mt-1 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-purple-500 outline-none transition" placeholder="https://" />
        </label>

        <div className="flex justify-between mt-8 border-t border-slate-700 pt-6">
          <button type="button" onClick={() => navigate("/projects-view")} className="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition shadow-md font-medium">
            Cancel
          </button>

          <button type="submit" disabled={loading} className={`flex items-center gap-2 px-8 py-3 rounded-xl text-white text-sm font-bold shadow-md transition transform active:scale-95 ${loading ? "bg-gray-600 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"}`}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : <PlusCircle size={18} />}
            {loading ? "Saving..." : "Save Project"}
          </button>
        </div>
      </form>
    </div>
  );
}