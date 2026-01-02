// components/ProtectedRoutes.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");

  // If no token exists, force redirect to Login
  if (!token) {
    return <Navigate to="/admin-login" replace />;
  }

  // If token exists, render the child component (The Dashboard/Admin Layout)
  return children;
};

export default ProtectedRoute;