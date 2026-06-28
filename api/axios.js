// src/api/axios.js
// Instance Axios centralisée avec intercepteurs et barre de progression NProgress

import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { toast } from "sonner";

// Configuration NProgress
NProgress.configure({ showSpinner: false, speed: 400, trickleSpeed: 200 });

// Instance Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/",
  withCredentials: true, // Envoyer les cookies de session (crucial pour la prod)
  timeout: 120000,
  headers: { "Content-Type": "application/json" },
});

// ─── Intercepteur de requête ──────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    NProgress.start();
    return config;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

// ─── Intercepteur de réponse (Unique et Corrigé) ──────────────────────────────
api.interceptors.response.use(
  (response) => {
    NProgress.done();
    return response;
  },
  (error) => {
    NProgress.done();

    const status = error.response?.status;
    const message = error.response?.data?.message || "Une erreur est survenue";
    const currentPath = window.location.pathname;

    // Session expirée — rediriger vers login UNIQUEMENT si on tente d'accéder à l'admin
    if (status === 401) {
      const isTryingToAccessAdmin = currentPath.startsWith("/admin");
      const isAlreadyOnLogin = currentPath.includes("/admin-login");

      if (isTryingToAccessAdmin && !isAlreadyOnLogin) {
        toast.error("Session expirée — veuillez vous reconnecter");
        setTimeout(() => { 
          window.location.href = "/admin-login"; 
        }, 1500);
      }
    } else if (status === 404) {
      toast.error("Ressource non trouvée");
    } else if (status === 500) {
      toast.error(message || "Erreur serveur, réessayez plus tard");
    }

    return Promise.reject(error);
  }
);

export default api;