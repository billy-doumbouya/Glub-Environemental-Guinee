// src/components/layout/DashboardLayout.jsx
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import NProgress from "nprogress";
import { useAuth } from "../hooks/useAuth";
import { LogoutModal } from "../components/ui/modalLogout";
import { LogOut, X } from "lucide-react";

const NAV_ITEMS = [
  { path: "/admin/dashboard", label: "Tableau de bord", icon: "🏠" },
  { path: "/admin/projets", label: "Projets", icon: "📋" },
  { path: "/admin/actualites", label: "Actualités", icon: "📰" },
  { path: "/admin/galerie", label: "Galerie", icon: "🖼️" },
  { path: "/admin/partenaires", label: "Partenaires", icon: "🤝" },
  { path: "/admin/temoignages", label: "Témoignages", icon: "💬" },
  { path: "/admin/statistiques", label: "Statistiques", icon: "📊" },
  { path: "/admin/domaines", label: "Domaines", icon: "🌿" },
  { path: "/admin/timeline", label: "Timeline", icon: "📅" },
];

export function DashboardLayout({ children }) {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // État du modal

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    NProgress.start();
    const timer = setTimeout(() => NProgress.done(), 300);
    setIsMobileMenuOpen(false);
    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [location.pathname]);

  // Exécuté uniquement quand l'utilisateur confirme dans le modal
  const handleConfirmLogout = async () => {
    setIsLogoutModalOpen(false);
    await logout();
    toast.success("Déconnecté avec succès");
    navigate("/admin-login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      
      {/* Overlay pour fermer le menu mobile en cliquant à côté */}
      {isMobile && isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            zIndex: 999
          }}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        style={{
          width: "240px",
          background: "#15803D",
          color: "white",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          height: "100vh",
          overflowY: "auto",
          zIndex: 1000,
          transition: "transform 0.3s ease",
          transform: isMobile && !isMobileMenuOpen ? "translateX(-240px)" : "translateX(0)"
        }}
      >
        {/* Logo */}
        <div style={{ padding: "24px 20px", borderBottom: "1px solid rgba(255,255,255,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "18px", fontWeight: "700" }}>🌿 ONG C.E.G</div>
            <div style={{ fontSize: "12px", opacity: 0.8, marginTop: "4px" }}>Dashboard Admin</div>
          </div>
          {isMobile && (
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ background: "transparent", border: "none", color: "white", fontSize: "20px", cursor: "pointer" }}
            >
              <X  size={24} color="white" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "12px 0" }}>
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "11px 20px",
                  textDecoration: "none",
                  color: "white",
                  background: isActive ? "rgba(255,255,255,0.2)" : "transparent",
                  borderLeft: isActive ? "3px solid white" : "3px solid transparent",
                  fontSize: "14px",
                  transition: "all 0.2s",
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bouton de déclenchement du Modal */}
        <div style={{ padding: "16px", borderTop: "1px solid rgba(255,255,255,0.2)" }}>
          <button
            onClick={() => setIsLogoutModalOpen(true)} // Ouvre le modal au lieu de déconnecter directement
            style={{
              width: "100%",
              padding: "10px",
              background: "rgba(255,255,255,0.15)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
            }} className="flex  gap-1.5 items-center"
          >
          <LogOut size={24} color="white" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, marginLeft: isMobile ? "0px" : "240px", minWidth: 0 }}>
        
        {/* Topbar mobile */}
        {isMobile && (
          <header style={{
            height: "60px",
            background: "#15803D",
            color: "white",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              style={{ background: "transparent", border: "none", color: "white", fontSize: "24px", cursor: "pointer", marginRight: "16px" }}
            >
              ☰
            </button>
            <div style={{ fontWeight: "700" }}>🌿 ONG C.E.G</div>
          </header>
        )}

        <main style={{ flex: 1, background: "#f8fafc", minHeight: "calc(100vh - 60px)" }}>
          {children}
        </main>
      </div>

      {/* Insertion du Modal à la racine du layout */}
      <LogoutModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        isMobile={isMobile}
      />

    </div>
  );
}