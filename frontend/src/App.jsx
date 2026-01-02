import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

// Layouts
import Header from "./components/Header";
import Footer from "./components/Footer";

import AdminLayout from "./pages/admin/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoutes";

// Public Pages
import PortfolioHome from "./pages/home/Home";
import ProjectsPage from "./pages/project/Projects";
import SkillsPage from "./pages/skills/Skills";
import ContactPage from "./pages/contact/Contact";
import AdminLogin from "./pages/admin/AdminLogin";

// Admin Dashboard Pages
import Dashboard from "./pages/dashboard/Dashboard";
import ViewProjects from "./pages/dashboard/ViewProjects";
import ViewSkills from "./pages/dashboard/ViewSkills";
import ViewMessages from "./pages/dashboard/ViewMessages";
import ViewEducation from "./pages/dashboard/ViewEducation";

// Admin Add/Edit Pages
import AddProject from "./pages/project/AddProjects";
import AddSkill from "./pages/skills/AddSkills";
import AddEducation from "./pages/education/AddEducation";
import AdminProfilePic from "./pages/dashboard/UpdateProfile";
import ViewExperience from "./pages/dashboard/ViewExperience";
import EditProject from "./pages/project/EditProjects";
import AddExperience from "./pages/experience/AddExperience";
import EditExperience from "./pages/experience/EditExperience";
import EditEducation from "./pages/education/EditEducation";
import EditSkill from "./pages/skills/EditSkills";

// --- Layout Wrappers ---

// 1. Public Layout (Header + Page + Footer)
const PublicLayout = () => {
  return (
    <>
      <Header />
      <Outlet /> {/* This represents the child route (e.g., Home, Contact) */}
      <Footer />
    </>
  );
};

// 2. Admin Layout Wrapper (Protected + Sidebar Layout)
const AdminLayoutWrapper = () => {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <Outlet /> {/* This represents the child route (e.g., Dashboard, ViewProjects) */}
      </AdminLayout>
    </ProtectedRoute>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* ================= PUBLIC ROUTES ================= */}
        {/* These routes will have Header and Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<PortfolioHome />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          {/* Login is public, but doesn't necessarily need Header/Footer? 
              If you want Login without header, move it outside this wrapper. 
              For now, I'll keep it here per your previous structure. */}
          <Route path="/admin-login" element={<AdminLogin />} />
        </Route>


        {/* ================= PROTECTED ADMIN ROUTES ================= */}
        {/* These routes will use the AdminLayout (Sidebar) and NO Header/Footer */}
        <Route element={<AdminLayoutWrapper />}>
          
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* View Pages */}
          <Route path="/projects-view" element={<ViewProjects />} />
          <Route path="/skills-view" element={<ViewSkills />} />
          <Route path="/messages-view" element={<ViewMessages />} />
          <Route path="/education-view" element={<ViewEducation />} />
          <Route path="/profile-view" element={<AdminProfilePic />} />
          <Route path="/experience-view" element={<ViewExperience />} />

          {/* Add/Action Pages */}
          <Route path="/add-project" element={<AddProject />} />
          <Route path="/add-skill" element={<AddSkill />} />
          <Route path="/add-education" element={<AddEducation />} />
          <Route path="/add-experience" element={<AddExperience />} />
          <Route path="/edit-experience/:id" element={<EditExperience />} />
          <Route path="/edit-education/:id" element={<EditEducation />} />
          <Route path="/edit-skill/:id" element={<EditSkill />} />
          <Route path="/edit-project/:id" element={<EditProject />} />
          
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;