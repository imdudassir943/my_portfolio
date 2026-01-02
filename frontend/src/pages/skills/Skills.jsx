import React, { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

export default function SkillsPage() {
  const [isVisible, setIsVisible] = useState(false);

  // Static dummy skills (matching Django model fields)
  const skills = [
    { name: "JavaScript", level: "Expert", order: 1 },
    { name: "React", level: "Advanced", order: 2 },
    { name: "Django", level: "Intermediate", order: 3 },
    { name: "Python", level: "Expert", order: 4 },
    { name: "SQL", level: "Intermediate", order: 5 },
    { name: "Git", level: "Advanced", order: 6 },
  ];

  useEffect(() => {
    // Timeout added to ensure component is mounted before setting isVisible to true,
    // which helps in triggering the initial CSS transitions.
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100); 

    return () => clearTimeout(timer);
  }, []);

  /**
   * Helper function to get distinct color classes based on skill level.
   * @param {string} level The skill level (Expert, Advanced, Intermediate).
   * @returns {string} Tailwind CSS class for text color.
   */
  const getLevelColor = (level) => {
    switch (level) {
      case "Expert":
        return "text-green-400"; // Distinct color for Expert
      case "Advanced":
        return "text-yellow-400"; // Distinct color for Advanced
      case "Intermediate":
        return "text-cyan-400"; // Distinct color for Intermediate
      default:
        return "text-purple-300"; // Default color
    }
  };

  /**
   * Helper function to get distinct badge background/text classes based on skill level.
   * @param {string} level The skill level.
   * @returns {string} Tailwind CSS class for badge background/border/text.
   */
  const getLevelBadgeClasses = (level) => {
    switch (level) {
      case "Expert":
        return "bg-green-500/20 border-green-500/30 text-green-200";
      case "Advanced":
        return "bg-yellow-500/20 border-yellow-500/30 text-yellow-200";
      case "Intermediate":
        return "bg-cyan-500/20 border-cyan-500/30 text-cyan-200";
      default:
        return "bg-gray-500/20 border-gray-500/30 text-gray-200";
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative pt-32 px-6">

      {/* Background Glow Elements */}
      <div className="absolute top-40 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />

      {/* Header Section */}
      <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-2 mb-6">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-purple-300">My Technical Skills</span>
        </div>

        <h1 className="text-6xl font-extrabold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
          Skills & Technologies
        </h1>

        {/* UPDATED LINE BELOW: Shorter and more concise */}
        <p className="text-gray-300 text-lg max-w-2xl mx-auto mt-6">
          Technologies I excel at, clearly coded by mastery level
        </p>
      </div>

      {/* Skills Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {skills.map((skill, idx) => (
          <div
            key={idx}
            className={`relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-500 hover:scale-105 hover:bg-white/10 ${isVisible ? "opacity-100" : "opacity-0"}`}
            style={{ transitionDelay: `${idx * 80}ms` }}
          >
            {/* Skill Name with Level Color */}
            <h3 className={`text-2xl font-bold mb-2 ${getLevelColor(skill.level)}`}>{skill.name}</h3>
            
            {/* Level Badge */}
            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4 ${getLevelBadgeClasses(skill.level)}`}>
              {skill.level}
            </span>
            
            {/* Order Badge (Original secondary information) */}
            <p className="text-gray-400 text-sm">
              Order: {skill.order}
            </p>
          </div>
        ))}
      </div>

      {/* CTA Footer Section */}
      <div className="text-center mt-24 mb-20">
        <h2 className="text-5xl font-bold mb-4">
          Growing
          <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"> Every Day</span>
        </h2>
        <p className="text-gray-300 mb-8 max-w-xl mx-auto">
          Skills evolve with experience — this list will keep getting bigger.
        </p>
      </div>
    </div>
  );
}