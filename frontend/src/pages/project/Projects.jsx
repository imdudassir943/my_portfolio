import React, { useEffect, useState } from "react";
import { ExternalLink, FolderGit2 } from "lucide-react";

export default function ProjectsPage() {
  const [isVisible, setIsVisible] = useState(false);

  // Dummy project data matching Django model fields
  const projects = [
    {
      order: 1,
      title: "Portfolio Website",
      description: "A modern personal portfolio built with React, Tailwind, and Django API.",
      image: "/projects/portfolio.jpg",
      link: "https://example.com",
      created_at: "2025-01-01",
    },
    {
      order: 2,
      title: "Restaurant Ordering System",
      description: "A C++ CLI-based digital menu and order system with formatted output.",
      image: "/projects/restaurant.jpg",
      link: null,
      created_at: "2025-02-15",
    },
    {
      order: 3,
      title: "Django Blog Platform",
      description: "A full-stack blog application with authentication and admin panel.",
      image: "/projects/blog.jpg",
      link: "https://example.com/blog",
      created_at: "2025-03-10",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white px-6 pt-32 relative overflow-hidden">

      {/* Background soft lights */}
      <div className="absolute top-40 left-10 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse delay-1000" />

      {/* Header */}
      <div
        className={`text-center mb-20 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/30 px-4 py-2 rounded-full mb-6">
          <FolderGit2 className="w-4 h-4 text-purple-300" />
          <span className="text-sm text-purple-200">My Projects</span>
        </div>

        <h1 className="text-6xl font-extrabold bg-gradient-to-r from-white via-purple-200 to-cyan-200 text-transparent bg-clip-text">
          Featured Work
        </h1>

        <p className="text-gray-300 text-lg max-w-2xl mx-auto mt-6">
          A showcase of the projects I’ve built, designed, and developed.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
        {projects.map((project, index) => (
          <div
            key={index}
            className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-xl transition-all duration-700 hover:scale-105 hover:bg-white/10 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: `${index * 120}ms` }}
          >
            {/* Project Image */}
            <div className="w-full h-52 overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover hover:scale-110 transition-all duration-700"
              />
            </div>

            {/* Project Content */}
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
                {project.title}
              </h3>

              <p className="text-gray-300 text-sm mb-4">{project.description}</p>

              {/* Order */}
              <p className="text-gray-400 text-xs mb-3">
                Order: {project.order} • Created: {new Date(project.created_at).toDateString()}
              </p>

              {/* Optional Link Button */}
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-purple-600/20 border border-purple-500/40 text-purple-200 text-sm font-semibold hover:bg-purple-600/30 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View Project</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="text-center mt-24 mb-20">
        <h2 className="text-5xl font-bold">
          More Projects Coming
          <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            {" "}
            Soon
          </span>
        </h2>

        <p className="text-gray-300 max-w-xl mx-auto mt-4">
          I keep building new things every month — this gallery will continue to grow.
        </p>
      </div>
    </div>
  );
}
