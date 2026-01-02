import React, { useEffect, useState, } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState({});
  const [profileImage, setProfileImage] = useState(null); // 1. State for the image

  const [stats] = useState({
    projects: 6,
    skills: 12,
    messages: 3,
    education: 4,
    experienceFields: 5,
  });

  const navigate = useNavigate();


  // API URL for profile
  const API_PROFILE_URL = "http://127.0.0.1:8000/api/portfolio/profile/";

  useEffect(() => {
    // --- Existing User Info Logic ---
    const storedUser = localStorage.getItem("user_info");
    if (storedUser) {
        const parsed = JSON.parse(storedUser);
        const fullName = parsed.first_name ? `${parsed.first_name} ${parsed.last_name}` : parsed.username;
        setUser({
            name: fullName || "Admin",
            email: parsed.email || "admin@example.com"
        });
    }

    // --- 2. Call the fetch function on mount ---
    fetchProfileImage();
  }, []);

  // --- 3. Function to fetch the image from Backend ---
  const fetchProfileImage = async () => {
    // Retrieve the correct token key (access_token)
    const token = localStorage.getItem("access_token"); 

    if (!token) return;

    try {
      const response = await fetch(API_PROFILE_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        // If data exists, set the image URL
        if (Array.isArray(data) && data.length > 0) {
          setProfileImage(data[0].profile_image);
        }
      }
    } catch (error) {
      console.error("Error fetching profile pic for dashboard:", error);
    }
  };

  return (
    <div> 
      <h1 className="text-3xl font-bold mb-6 text-white">Welcome, {user.name}</h1>

      {/* PROFILE SECTION */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex items-center gap-4 mb-10">
        
        {/* 4. Avatar: Conditional Rendering */}
        <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border-2 border-slate-600">
          {profileImage ? (
            // If image exists, show it
            <img 
              src={profileImage} 
              alt="Admin Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            // If no image, show the default Icon
            <User className="text-gray-300 w-8 h-8" />
          )}
        </div>

        {/* Name + Email */}
        <div>
          <h2 className="text-xl font-semibold text-white">{user.name}</h2>
          <p className="text-gray-400">{user.email}</p>
        </div>
      </div>

      {/* DASHBOARD CARDS */}
      <div className="grid md:grid-cols-4 gap-8">

        {/* Projects */}
       <div
          onClick={() => navigate("/projects-view")}
          className="bg-slate-800 p-6 rounded-xl border border-slate-700 cursor-pointer hover:bg-slate-700 transition"
        >
          <h2 className="text-xl font-semibold text-purple-300 mb-1">Projects</h2>
          <p className="text-white text-3xl font-bold">{stats.projects}</p>
          <p className="text-gray-400 text-sm">Total Projects</p>
        </div>

        {/* Skills */}
        <div
          onClick={() => navigate("/skills-view")}
          className="bg-slate-800 p-6 rounded-xl border border-slate-700 cursor-pointer hover:bg-slate-700 transition"
        >
          <h2 className="text-xl font-semibold text-cyan-300 mb-1">Skills</h2>
          <p className="text-white text-3xl font-bold">{stats.skills}</p>
          <p className="text-gray-400 text-sm">Total Skills</p>
        </div>

        {/* Messages */}
        <div
          onClick={() => navigate("/messages-view")}
          className="bg-slate-800 p-6 rounded-xl border border-slate-700 cursor-pointer hover:bg-slate-700 transition"
        >
          <h2 className="text-xl font-semibold text-green-300 mb-1">Messages</h2>
          <p className="text-white text-3xl font-bold">{stats.messages}</p>
          <p className="text-gray-400 text-sm">Unread Messages</p>
        </div>

        {/* Education */}
        <div
          onClick={() => navigate("/education-view")}
          className="bg-slate-800 p-6 rounded-xl border border-slate-700 cursor-pointer hover:bg-slate-700 transition"
        >
          <h2 className="text-xl font-semibold text-yellow-300 mb-1">Education</h2>
          <p className="text-white text-3xl font-bold">{stats.education}</p>
          <p className="text-gray-400 text-sm">Education Items</p>
        </div>

        {/* Experience */}
        <div
          onClick={() => navigate("/experience-view")}
          className="bg-slate-800 p-6 rounded-xl border border-slate-700 cursor-pointer hover:bg-slate-700 transition"
        >
          <h2 className="text-xl font-semibold text-green-300 mb-1">Experience</h2>
          <p className="text-white text-3xl font-bold">{stats.experienceFields}</p>
          <p className="text-gray-400 text-sm">Expertise Field</p>
        </div>

      </div>
    </div>
  );
}