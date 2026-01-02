import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, ArrowRight, Sparkles, ExternalLink } from 'lucide-react';
import profileImg from "../../assets/profile.jpg";

export default function PortfolioHome() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // ⭐ Dummy Experience (backend integration later)
  const experience = [
    {
      job_title: "Frontend Developer",
      company: "Tech Vision Pvt Ltd",
      location: "Lahore, Pakistan",
      start_date: "2022",
      end_date: "2023",
      is_current: false,
      description: "Worked with React, Tailwind CSS, and REST APIs to deliver responsive UI components.",
    },
    {
      job_title: "Python Developer Intern",
      company: "SoftMatrix Solutions",
      location: "Remote",
      start_date: "2023",
      end_date: "Present",
      is_current: true,
      description: "Developing automation scripts, REST APIs, and backend modules using Django.",
    }
  ];

  // ⭐ Dummy Education Data
  const education = [
    {
      institution: "University of Lahore",
      degree_title: "Bachelor of Science in Computer Science",
      field_of_study: "Software Engineering",
      start_year: 2020,
      end_year: 2024,
      marks_percentage: 85.6,
      grade: "A",
      description: "Focused on full-stack development, data structures, and machine learning."
    },
    {
      institution: "Punjab College",
      degree_title: "Intermediate (FSC Pre-Engineering)",
      field_of_study: "Engineering",
      start_year: 2018,
      end_year: 2020,
      marks_percentage: 87.2,
      grade: "A+",
      description: "Studied foundational mathematics, physics, and computer science."
    },
    {
      institution: "Govt. High School",
      degree_title: "Matriculation (Science)",
      field_of_study: "Computer Science",
      start_year: 2016,
      end_year: 2018,
      marks_percentage: 89.5,
      grade: "A+",
      description: "Matriculated with distinction in science subjects."
    }
  ];

  const projects = [
    {
      title: "E-Commerce Platform",
      description: "Full-stack application with payment integration",
      tech: ["React", "Node.js", "MongoDB"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "AI Chat Assistant",
      description: "Real-time chat with AI-powered responses",
      tech: ["Python", "FastAPI", "WebSocket"],
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Analytics Dashboard",
      description: "Data visualization and reporting system",
      tech: ["Vue.js", "D3.js", "PostgreSQL"],
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative pt-28">

      {/* Animated Background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139,92,246,0.3), transparent 50%)`
        }}
      />
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Hero Section */}
        <div className={`text-center mb-32 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

          {/* Profile */}
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur-2xl opacity-50 animate-pulse" />
            <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-purple-500/50 shadow-2xl shadow-purple-500/50">
              <img src={profileImg} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-4 border-slate-900 flex items-center justify-center">
              <span className="text-2xl">👋</span>
            </div>
          </div>

          <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">Available for freelance work</span>
          </div>

          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
              Creative Developer
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              & Designer
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Crafting beautiful digital experiences with modern technologies.
            Specializing in full-stack development and UI/UX design.
          </p>

          <div className="flex justify-center space-x-4">
            <button className="group bg-gradient-to-r from-purple-500 to-cyan-500 px-8 py-4 rounded-full font-semibold flex items-center space-x-2 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105">
              <span>View My Work</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border border-purple-500/50 px-8 py-4 rounded-full font-semibold hover:bg-purple-500/10 transition-all duration-300 hover:border-purple-400">
              Get in Touch
            </button>
          </div>

          {/* Social Icons */}
          <div className="flex justify-center space-x-6 mt-12">
            <a href="#" className="hover:text-purple-400 transition-colors hover:scale-110 duration-200">
              <Github className="w-6 h-6" />
            </a>
            <a href="#" className="hover:text-purple-400 transition-colors hover:scale-110 duration-200">
              <Linkedin className="w-6 h-6" />
            </a>
            <a href="#" className="hover:text-purple-400 transition-colors hover:scale-110 duration-200">
              <Mail className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* Featured Projects */}
        <div className={`mb-32 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl font-bold mb-12 text-center">Featured Projects</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div
                key={index}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`} />
                <div className="relative z-10">
                  <div className={`w-12 h-12 bg-gradient-to-br ${project.color} rounded-lg mb-4 flex items-center justify-center`}>
                    <ExternalLink className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                  <p className="text-gray-400 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm text-purple-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ⭐ Experience Section */}
        <div className={`mb-32 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl font-bold mb-12 text-center">Experience</h2>

          <div className="max-w-3xl mx-auto space-y-8">
            {experience.map((exp, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]"
              >
                <h3 className="text-2xl font-semibold mb-1">{exp.job_title}</h3>

                <p className="text-purple-300 font-medium">{exp.company}</p>

                {exp.location && (
                  <p className="text-sm text-cyan-300 mb-3">{exp.location}</p>
                )}

                <div className="flex justify-center space-x-6 text-gray-300 mb-3">
                  <span>
                    {exp.start_date} — {exp.is_current ? "Present" : exp.end_date}
                  </span>
                </div>

                {exp.description && (
                  <p className="text-gray-400 text-sm max-w-xl mx-auto">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ⭐ Education Section */}
        <div className={`text-center transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl font-bold mb-12">Education</h2>

          <div className="max-w-3xl mx-auto space-y-8">
            {education.map((edu, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]"
              >
                <h3 className="text-2xl font-semibold mb-1">{edu.degree_title}</h3>
                <p className="text-purple-300 font-medium mb-3">{edu.institution}</p>

                <div className="flex justify-center space-x-6 text-gray-300 mb-3">
                  <span>{edu.start_year} — {edu.end_year ?? "Present"}</span>
                  {edu.grade && <span>Grade: {edu.grade}</span>}
                  {edu.marks_percentage && <span>{edu.marks_percentage}%</span>}
                </div>

                {edu.field_of_study && (
                  <p className="text-sm text-cyan-300 mb-2">Field: {edu.field_of_study}</p>
                )}

                {edu.description && (
                  <p className="text-gray-400 text-sm max-w-xl mx-auto">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-32 text-center">
          <h2 className="text-5xl font-bold mb-6">
            Let's Build Something
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"> Amazing</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Have a project in mind? Let's discuss how we can work together.
          </p>
          <button className="bg-gradient-to-r from-purple-500 to-cyan-500 px-10 py-5 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105">
            Start a Conversation
          </button>
        </div>

      </div>
    </div>
  );
}
