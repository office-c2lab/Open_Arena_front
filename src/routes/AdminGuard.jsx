// src/routes/AdminGuard.jsx
import { Navigate } from "react-router-dom";

export default function AdminGuard({ children }) {
  const hasAdminToken = document.cookie.includes("admin_token=");

  if (!hasAdminToken) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
