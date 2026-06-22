// src/components/shared/ProtectedRoute.jsx
// Protège les routes nécessitant une authentification

import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function ProtectedRoute({ children }) {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: "100vh", fontSize: "16px", color: "#15803D",
      }}>
        Chargement...
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/login" replace />;

  return children;
}
