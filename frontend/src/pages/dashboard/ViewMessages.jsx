import React, { useEffect, useState } from "react";
import { 
  Mail, 
  Trash2, 
  User, 
  Loader2, 
  CheckCircle, 
  AlertCircle 
} from "lucide-react";

export default function ViewMessages() {
  // --- API CONFIG ---
  // Assuming your backend supports GET/DELETE on contact messages
  const API_BASE_URL = "http://127.0.0.1:8000/api/portfolio/contact/";
  const API_REFRESH_URL = "http://127.0.0.1:8000/api/token/refresh/";
  const API_PROFILE_URL = "http://127.0.0.1:8000/api/portfolio/profile/";
  const API_MESSAGES_URL = "http://127.0.0.1:8000/api/portfolio/contact/messages/";


  // --- STATE ---
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
  const [user, setUser] = useState({ name: "Admin", email: "admin@example.com" });
  const [profileImage, setProfileImage] = useState(null);
  
  // Modal State
  const [deleteModal, setDeleteModal] = useState({ show: false, msgId: null });

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
        if (Array.isArray(data) && data.length > 0) setProfileImage(data[0].profile_image);
      }
    } catch (error) { console.error("Error profile:", error); }
  };

  const fetchMessages = async () => {
  setLoading(true);
  let token = getAuthToken();

  try {
    let response = await fetch(API_MESSAGES_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    // 🔁 Refresh token if expired
    if (response.status === 401) {
      token = await refreshAccessToken();
      if (token) {
        response = await fetch(API_MESSAGES_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
      }
    }

    if (!response.ok) {
      throw new Error("Failed to fetch messages");
    }

    const data = await response.json();

    // ✅ Works for both paginated & normal DRF responses
    if (Array.isArray(data)) {
      setMessages(data);
    } else if (Array.isArray(data.results)) {
      setMessages(data.results);
    } else {
      setMessages([]);
    }
  } catch (error) {
    setStatusMsg({ type: "error", text: "Failed to load messages." });
  } finally {
    setLoading(false);
  }
};


  // --- DELETE HANDLER ---
  const confirmDelete = async () => {
    const id = deleteModal.msgId;
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
          response = await fetch(deleteUrl, { 
            method: "DELETE", 
            headers: { Authorization: `Bearer ${token}` } 
          });
        }
      }

      if (response.status === 204 || response.ok) {
        setMessages(prev => prev.filter(m => m.id !== id));
        setStatusMsg({ type: "success", text: "Message deleted successfully!" });
      } else {
        setStatusMsg({ type: "error", text: "Delete failed." });
      }
    } catch (error) {
      setStatusMsg({ type: "error", text: "Connection error." });
    } finally {
      setIsDeleting(false);
      setDeleteModal({ show: false, msgId: null });
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
    fetchMessages();
    fetchProfileData();
  }, []);

  useEffect(() => {
    if (statusMsg.text) {
      const timer = setTimeout(() => setStatusMsg({ type: "", text: "" }), 3500);
      return () => clearTimeout(timer);
    }
  }, [statusMsg]);

  return (
    <div className="pt-6 px-6 pb-12 relative min-h-screen">
      
      {/* --- CUSTOM DELETE MODAL --- */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => !isDeleting && setDeleteModal({ show: false, msgId: null })}></div>
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl relative z-10 animate-in zoom-in duration-200">
            <div className="flex items-center gap-4 mb-4 text-red-400">
              <div className="bg-red-500/10 p-3 rounded-full">
                <Trash2 size={28} />
              </div>
              <h3 className="text-xl font-bold text-white">Delete Message?</h3>
            </div>
            <p className="text-gray-400 mb-8">
              Are you sure you want to delete this message? This action is permanent.
            </p>
            <div className="flex gap-3">
              <button disabled={isDeleting} onClick={() => setDeleteModal({ show: false, msgId: null })} className="flex-1 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition">Cancel</button>
              <button disabled={isDeleting} onClick={confirmDelete} className="flex-1 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition flex items-center justify-center gap-2">
                {isDeleting ? <Loader2 className="animate-spin" size={18} /> : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- STATUS NOTIFICATION --- */}
      {statusMsg.text && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 animate-in fade-in zoom-in duration-300">
          <div className={`px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border ${statusMsg.type === "success" ? "bg-emerald-500 text-white border-emerald-400" : "bg-red-500 text-white border-red-400"}`}>
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
        <span className="text-gray-400 text-sm opacity-70">Messages are auto-collected</span>
      </div>

      <h1 className="text-3xl font-bold mb-10 text-center text-white">Contact Messages</h1>

      {/* --- MESSAGES GRID --- */}
      {loading ? (
        <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
          <Loader2 className="animate-spin mb-4" size={40} />
          <p>Checking for new inquiries...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.map((msg) => (
            <div key={msg.id} className="relative bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition duration-300 group flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="text-purple-400 group-hover:text-purple-300 transition" size={22} />
                  <h2 className="text-xl font-semibold text-white">{msg.name}</h2>
                </div>
                <p className="text-gray-400 text-sm mb-3">
                  <span className="font-medium text-gray-300">Email:</span>{" "}
                  <span className="text-white select-all">{msg.email}</span>
                </p>
                <p className="text-gray-300 text-sm leading-relaxed p-4 rounded-xl border border-slate-700 bg-slate-900 min-h-[100px]">
                  {msg.message}
                </p>
              </div>

              <div className="flex justify-between items-center mt-6">
                <p className="text-gray-500 text-xs italic">
                  Received: {new Date(msg.created_at).toLocaleString()}
                </p>
                <button 
                  onClick={() => setDeleteModal({ show: true, msgId: msg.id })}
                  className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white px-4 py-2 rounded-xl text-sm transition border border-red-600/30"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && messages.length === 0 && (
        <div className="text-center mt-20">
          <Mail size={48} className="mx-auto text-slate-700 mb-4" />
          <p className="text-gray-400 text-lg">Your inbox is empty.</p>
        </div>
      )}
    </div>
  );
}
