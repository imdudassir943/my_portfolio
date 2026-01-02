import React, { useEffect, useState } from "react";
import { Mail, Send, User, MessageSquare, Loader2, CheckCircle, XCircle } from "lucide-react";

export default function ContactPage() {
  const [isVisible, setIsVisible] = useState(false);
  
  // 1. State for Form Data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  // 2. State for API Request Status
  const [status, setStatus] = useState({
    loading: false,
    success: null, // null | true | false
    message: ""
  });

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // 3. Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 4. Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: null, message: "" });

    try {
      // connecting to the endpoint defined in your portfolio/urls.py
      const response = await fetch("http://127.0.0.1:8000/api/portfolio/contact/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ 
          loading: false, 
          success: true, 
          message: "Message received! I'll get back to you shortly." 
        });
        setFormData({ name: "", email: "", message: "" }); // Reset form
      } else {
        // Handle validation errors from Django Serializer
        const errorMsg = data.detail || "Failed to send message. Please try again.";
        setStatus({ loading: false, success: false, message: errorMsg });
      }
    } catch (error) {
      setStatus({ 
        loading: false, 
        success: false, 
        message: "Network error. Is the backend running?" 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative pt-32 px-6">

      {/* Background Glows */}
      <div className="absolute top-40 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>

      {/* Header Section */}
      <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-2 mb-6">
          <Mail className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-purple-300">Get in Touch</span>
        </div>

        <h1 className="text-6xl font-extrabold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
          Contact Me
        </h1>
      </div>

      {/* Contact Form */}
      <div
        className={`max-w-3xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-10 shadow-xl transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Status Message Banner */}
          {status.message && (
            <div className={`flex items-center space-x-2 p-4 rounded-xl border ${
              status.success 
                ? "bg-green-500/10 border-green-500/30 text-green-300" 
                : "bg-red-500/10 border-red-500/30 text-red-300"
            }`}>
              {status.success ? <CheckCircle size={20}/> : <XCircle size={20}/>}
              <span>{status.message}</span>
            </div>
          )}

          {/* Name Field */}
          <div className="flex flex-col">
            <label className="text-gray-300 mb-2 font-semibold">Your Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-purple-300" size={20} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 py-3 text-white focus:outline-none focus:border-purple-400 transition"
                placeholder="Enter your name"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="flex flex-col">
            <label className="text-gray-300 mb-2 font-semibold">Your Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-purple-300" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 py-3 text-white focus:outline-none focus:border-cyan-400 transition"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Message Field */}
          <div className="flex flex-col">
            <label className="text-gray-300 mb-2 font-semibold">Your Message</label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 text-purple-300" size={20} />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 py-3 text-white focus:outline-none focus:border-purple-400 transition"
                placeholder="Write your message..."
              ></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status.loading}
            className={`w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-cyan-500 px-6 py-3 rounded-xl font-bold text-white shadow-lg shadow-purple-500/20 transition-all duration-300 
              ${status.loading ? "opacity-70 cursor-wait" : "hover:scale-105"}`}
          >
            {status.loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>Send Message</span>
              </>
            )}
          </button>

        </form>
      </div>
      
      {/* Footer Space */}
      <div className="h-20"></div>
    </div>
  );
}
