import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../constants/api";
import { Aperture } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State to handle error messages
  const [loading, setLoading] = useState(false); // State for loading spinner
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. GET TOKENS (Login)
      // Note: simplejwt expects 'username' by default. We map your email state to 'username'.
      const response = await fetch(`${API_BASE}/api/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email, 
          password: password,
        }),
      });

      const data = await response.json();

      if(response.status !== 200){
        // Login failed (wrong password/email)
        setError("Invalid credentials! Please try again.");
            return;
      }
        // 2. CHECK PERMISSIONS
        // We have the token, now let's check if this user is actually an Admin (is_staff)
        const userResponse = await fetch("http://127.0.0.1:8000/api/accounts/me/", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${data.access}`, // Attach the new token
                "Content-Type": "application/json",
            }
        });

        const userData = await userResponse.json();

        if(!userData.is_staff){
            // Fail: User logged in, but is not an admin
            setError("Access Denied: You do not have admin privileges.");
            return;
        }
        // Success: User is logged in AND is an admin
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        localStorage.setItem("user_info", JSON.stringify(userData));
        
        navigate("/dashboard");

    } catch (err) {
      console.error("Login Error:", err);
      setError("Server error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-6">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-10 w-full max-w-md shadow-xl">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-8 text-purple-300">
          Admin Login
        </h1>

        {/* Error Message Display */}
        {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm text-center">
                {error}
            </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email */}
          <div>
            <label className="text-sm text-gray-300 block mb-2">
              Admin Username / Email
            </label>
            <input
              type="text" // Changed to text to allow username or email
              placeholder="Enter admin username"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 
              rounded-lg text-white placeholder-gray-400 focus:outline-none 
              focus:border-purple-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-300 block mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 
              rounded-lg text-white placeholder-gray-400 focus:outline-none 
              focus:border-purple-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition shadow-lg 
            ${loading 
                ? "bg-purple-600/50 cursor-not-allowed" 
                : "bg-purple-600 hover:bg-purple-700 hover:shadow-purple-900/50"}`
            }
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}