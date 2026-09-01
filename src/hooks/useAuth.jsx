// src/hooks/useAuth.js
// Hook personnalisé pour gérer l'état d'authentification

import { useState, useEffect, createContext, useContext } from "react";
import { authService } from "../../api/services";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Vérifier la session au chargement
  useEffect(() => {
    authService.me()
      .then(() => setIsAdmin(true))
      .catch(() => setIsAdmin(false))
      .finally(() => setLoading(false));
  }, []);

  const login = async (password) => {
    const res = await authService.login(password);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("ongceg_auth_redirected");
    }
    setIsAdmin(true);
    return res;
  };

  const logout = async () => {
    await authService.logout();
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("ongceg_auth_redirected");
    }
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans AuthProvider");
  return ctx;
};
