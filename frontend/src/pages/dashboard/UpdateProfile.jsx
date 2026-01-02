import React, { useEffect, useState } from "react";
import { Pencil, UploadCloud, Trash2, Save, CheckCircle } from "lucide-react";

export default function AdminProfilePic() {
  const [profile, setProfile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // New State for the Success Message
  const [successMessage, setSuccessMessage] = useState(null);

  const API_BASE_URL = "http://127.0.0.1:8000/api/portfolio/profile/";
  const API_REFRESH_URL = "http://127.0.0.1:8000/api/token/refresh/";

  // --- AUTO-HIDE MESSAGE LOGIC ---
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3500); // 3.5 seconds
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const getAuthToken = () => {
    return localStorage.getItem("access_token") || localStorage.getItem("access");
  };

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
      } else {
        localStorage.clear();
        window.location.href = "/admin-login";
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  const fetchProfiles = async () => {
    let token = getAuthToken();
    if (!token) return;
    try {
      let response = await fetch(API_BASE_URL, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (response.status === 401) {
        token = await refreshAccessToken();
        if (token) {
          response = await fetch(API_BASE_URL, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          });
        }
      }
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setProfile(data[0]);
          setPreview(data[0].profile_image);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchProfiles(); }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveToDatabase = async () => {
    let token = getAuthToken();
    if (!token || !selectedFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("profile_image", selectedFile);

    try {
      const method = profile && profile.id ? "PATCH" : "POST";
      const url = profile && profile.id ? `${API_BASE_URL}${profile.id}/` : API_BASE_URL;

      let response = await fetch(url, {
        method: method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.status === 401) {
        token = await refreshAccessToken();
        if (token) {
          response = await fetch(url, {
            method: method,
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          });
        }
      }

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setSuccessMessage("Profile picture updated successfully!"); // SET MESSAGE
        setSelectedFile(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    let token = getAuthToken();
    if (!profile) return;
    if (!window.confirm("Are you sure?")) return;

    try {
      let response = await fetch(`${API_BASE_URL}${profile.id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        token = await refreshAccessToken();
        if (token) {
          response = await fetch(`${API_BASE_URL}${profile.id}/`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
        }
      }

      if (response.ok) {
        setProfile(null);
        setPreview(null);
        setSelectedFile(null);
        setSuccessMessage("Profile picture removed."); // SET MESSAGE
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="pt-6 px-6 pb-12 relative">
      
      {/* --- SUCCESS MODAL / TOAST --- */}
      {successMessage && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 animate-in fade-in zoom-in duration-300">
          <div className="bg-emerald-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-emerald-400">
            <CheckCircle size={20} />
            <span className="font-medium">{successMessage}</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white">Update Profile Picture</h1>
          <p className="text-gray-400 mt-1">Manage your portfolio profile image</p>
        </div>
      </div>

      <div className="max-w-xl mx-auto bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-xl">
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <img
              src={preview || "/default.jpg"}
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover border-4 border-indigo-500 shadow-lg"
            />
            {selectedFile && (
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white font-bold text-xs">
                Unsaved
              </div>
            )}
          </div>
          <p className="text-gray-400 text-sm mt-3">
            {selectedFile ? "New Image Selected" : "Current Profile Picture"}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex justify-center">
            <label className="cursor-pointer bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-xl text-white font-medium flex items-center gap-2 shadow-sm transition w-full justify-center border border-slate-600">
              <UploadCloud size={18} />
              {selectedFile ? "Change Selection" : "1. Choose New Picture"}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <button
              onClick={handleSaveToDatabase}
              disabled={loading || !selectedFile}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-semibold shadow-md transition transform hover:-translate-y-1 
                ${loading || !selectedFile ? "bg-gray-600 opacity-50" : "bg-emerald-600 hover:bg-emerald-700"}`}
            >
              <Save size={18} />
              {loading ? "Saving..." : "2. Save Picture"}
            </button>

            <button
              onClick={handleDelete}
              disabled={!profile}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-semibold shadow-md transition transform hover:-translate-y-1 
                ${!profile ? "bg-gray-600 opacity-50" : "bg-red-600 hover:bg-red-700"}`}
            >
              <Trash2 size={18} />
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}