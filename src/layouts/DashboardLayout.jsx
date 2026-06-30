// src/layouts/DashboardLayout.jsx
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { useNProgress } from "../utils/useNProgress ";

const NAV_ITEMS = [
  {
    section: "Principal",
    items: [
      {
        path: "/admin/dashboard",
        label: "Tableau de bord",
        icon: "ti-layout-dashboard",
      },
      { path: "/admin/projets", label: "Projets", icon: "ti-clipboard-list" },
      { path: "/admin/actualites", label: "Actualités", icon: "ti-news" },
    ],
  },
  {
    section: "Contenu",
    items: [
      { path: "/admin/galerie", label: "Galerie", icon: "ti-photo" },
      {
        path: "/admin/partenaires",
        label: "Partenaires",
        icon: "ti-heart-handshake",
      },
      {
        path: "/admin/temoignages",
        label: "Témoignages",
        icon: "ti-message-dots",
      },
    ],
  },
  {
    section: "Données",
    items: [
      {
        path: "/admin/statistiques",
        label: "Statistiques",
        icon: "ti-chart-bar",
      },
      { path: "/admin/domaines", label: "Domaines", icon: "ti-plant" },
      { path: "/admin/timeline", label: "Timeline", icon: "ti-calendar-event" },
    ],
  },
];

const S = {
  // Shell
  shell: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  // Overlay mobile
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    zIndex: 999,
  },

  // Sidebar
  sidebar: (open) => ({
    width: 230,
    background:
      "linear-gradient(175deg, #0a2e1a 0%, #0d3d22 60%, #0f4c2a 100%)",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    height: "100vh",
    overflowY: "auto",
    zIndex: 1000,
    transition: "transform 0.28s ease",
    transform: open ? "translateX(0)" : "translateX(-230px)",
  }),

  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 11,
    flexShrink: 0,
    background: "linear-gradient(135deg, #16a34a, #15803d)",
    border: "1px solid rgba(74,222,128,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    fontWeight: 800,
    color: "#fff",
    boxShadow: "0 0 14px rgba(34,197,94,0.2)",
    overflow: "hidden",
  },

  navSection: {
    fontSize: 9,
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "rgba(240,253,244,0.38)",
    padding: "12px 10px 5px",
    display: "block",
  },

  navItem: (active) => ({
    display: "flex",
    alignItems: "center",
    gap: 9,
    padding: "9px 10px",
    borderRadius: 10,
    margin: "1px 10px",
    textDecoration: "none",
    color: active ? "#bbf7d0" : "rgba(240,253,244,0.62)",
    background: active ? "rgba(34,197,94,0.15)" : "transparent",
    border: `1px solid ${active ? "rgba(74,222,128,0.2)" : "transparent"}`,
    fontSize: 13,
    fontWeight: 400,
    transition: "all 0.18s",
    position: "relative",
  }),

  navIndicator: {
    position: "absolute",
    left: -10,
    top: "50%",
    transform: "translateY(-50%)",
    width: 3,
    height: 18,
    borderRadius: "0 3px 3px 0",
    background: "#4ade80",
  },

  sbUser: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    padding: "9px 10px",
    borderRadius: 10,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    marginBottom: 8,
  },

  sbAvatar: {
    width: 30,
    height: 30,
    borderRadius: 9,
    flexShrink: 0,
    background:
      "linear-gradient(135deg, rgba(34,197,94,0.3), rgba(16,163,74,0.3))",
    border: "1px solid rgba(74,222,128,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 700,
    color: "#4ade80",
    overflow: "hidden",
  },

  btnLogout: {
    width: "100%",
    padding: "9px 12px",
    background: "rgba(220,38,38,0.1)",
    border: "1px solid rgba(248,113,113,0.15)",
    borderRadius: 10,
    color: "#fca5a5",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 7,
  },

  // Topbar mobile
  mobileTopbar: {
    height: 54,
    flexShrink: 0,
    background: "linear-gradient(90deg, #0a2e1a, #0d3d22)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
    gap: 12,
  },

  mobileMenuBtn: {
    width: 36,
    height: 36,
    borderRadius: 9,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#f0fdf4",
    fontSize: 17,
  },

  // Topbar desktop
  desktopTopbar: {
    height: 52,
    flexShrink: 0,
    background: "#fff",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
    display: "flex",
    alignItems: "center",
    padding: "0 20px",
    gap: 12,
  },

  topbarBtn: {
    width: 34,
    height: 34,
    borderRadius: 9,
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#6b7280",
    fontSize: 15,
  },

  // Main content
  content: {
    flex: 1,
    background: "#f3f8f4",
    minHeight: "calc(100vh - 52px)",
  },
};

// ── Logout Modal ──────────────────────────────────────────────────
function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1100,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "88%",
          maxWidth: 300,
          background: "linear-gradient(145deg, #0d3d22, #0f4c2a)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 18,
          padding: "28px 20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            margin: "0 auto 14px",
            background: "rgba(220,38,38,0.15)",
            border: "1px solid rgba(248,113,113,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <i
            className="ti ti-logout"
            style={{ color: "#f87171", fontSize: 22 }}
            aria-hidden="true"
          />
          <img src="/logo.png" alt="logo" style={{ width: 48, height: 48 }} />
        </div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#f0fdf4",
            marginBottom: 6,
          }}
        >
          Déconnexion
        </div>
        <div
          style={{
            fontSize: 12,
            color: "rgba(240,253,244,0.38)",
            marginBottom: 20,
            lineHeight: 1.5,
          }}
        >
          Voulez-vous vraiment quitter le dashboard ?
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 10,
              cursor: "pointer",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(240,253,244,0.62)",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 10,
              cursor: "pointer",
              background: "rgba(220,38,38,0.2)",
              border: "1px solid rgba(248,113,113,0.25)",
              color: "#fca5a5",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Layout principal ──────────────────────────────────────────────
export function DashboardLayout({ children }) {
  useNProgress();
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);

  useEffect(() => {
    const onResize = () => {
      const m = window.innerWidth <= 768;
      setIsMobile(m);
      if (!m) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleConfirmLogout = async () => {
    setLogoutModal(false);
    await logout();
    toast.success("Déconnecté avec succès");
    navigate("/admin-login");
  };

  const currentLabel =
    NAV_ITEMS.flatMap((s) => s.items).find(
      (i) =>
        location.pathname === i.path ||
        location.pathname.startsWith(i.path + "/"),
    )?.label ?? "Dashboard";

  return (
    <div style={S.shell}>
      {/* Overlay mobile */}
      {isMobile && menuOpen && (
        <div style={S.overlay} onClick={() => setMenuOpen(false)} />
      )}

      {/* ── SIDEBAR ── */}
      <aside style={S.sidebar(!isMobile || menuOpen)}>
        {/* Logo */}
        <div
          style={{
            padding: "18px 14px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={S.logoBadge}>
              <img
                src="/logo.png"
                decoding="async"
                fetchPriority="high"
                srcSet="/logo.png 1x, /logo@2x.png 2x"
                alt="C.E.G Logo"
                width="40"
                height="40"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#f0fdf4" }}>
                ONG C.E.G
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "rgba(240,253,244,0.38)",
                  marginTop: 1,
                }}
              >
                Dashboard Admin
              </div>
            </div>
          </div>
          {isMobile && (
            <button
              onClick={() => setMenuOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "rgba(240,253,244,0.6)",
                fontSize: 20,
                display: "flex",
                alignItems: "center",
              }}
            >
              <i className="ti ti-x" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "8px 0", overflowY: "auto" }}>
          {NAV_ITEMS.map((group) => (
            <div key={group.section}>
              <span style={S.navSection}>{group.section}</span>
              {group.items.map((item) => {
                const active =
                  location.pathname === item.path ||
                  (item.path !== "/admin/dashboard" &&
                    location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={S.navItem(active)}
                  >
                    {active && <div style={S.navIndicator} />}
                    <i
                      className={`ti ${item.icon}`}
                      style={{
                        fontSize: 15,
                        color: active ? "#4ade80" : "rgba(240,253,244,0.38)",
                        width: 18,
                        textAlign: "center",
                      }}
                      aria-hidden="true"
                    />
                    <span style={{ flex: 1 }}>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer : user + logout */}
        <div
          style={{
            padding: "12px 10px",
            borderTop: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div style={S.sbUser}>
            <div style={S.sbAvatar}>
              <img
                src="/admin.jpg"
                alt="admin-image"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#f0fdf4",
                  lineHeight: 1.2,
                }}
              >
                M. Koly Doré
              </div>
              <div style={{ fontSize: 10, color: "rgba(240,253,244,0.38)" }}>
                Administrateur
              </div>
            </div>
          </div>
          <button style={S.btnLogout} onClick={() => setLogoutModal(true)}>
            <i className="ti ti-logout" aria-hidden="true" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          marginLeft: isMobile ? 0 : 230,
          minWidth: 0,
        }}
      >
        {/* Topbar mobile */}
        {isMobile && (
          <header style={S.mobileTopbar}>
            <button style={S.mobileMenuBtn} onClick={() => setMenuOpen(true)}>
              <i className="ti ti-menu-2" aria-hidden="true" />
            </button>
            <div
              style={{
                fontWeight: 700,
                color: "#f0fdf4",
                flex: 1,
                fontSize: 15,
              }}
            >
              ONG C.E.G
            </div>
            <div style={{ position: "relative" }}>
              <div style={S.mobileMenuBtn}>
                <i
                  className="ti ti-bell"
                  style={{ fontSize: 16 }}
                  aria-hidden="true"
                />
              </div>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#f59e0b",
                  position: "absolute",
                  top: 7,
                  right: 7,
                  boxShadow: "0 0 5px rgba(245,158,11,0.7)",
                }}
              />
            </div>
          </header>
        )}

        {/* Topbar desktop */}
        {!isMobile && (
          <header style={S.desktopTopbar}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                flex: 1,
                fontSize: 13,
                color: "#6b7280",
              }}
            >
              <i
                className="ti ti-home"
                style={{ fontSize: 14 }}
                aria-hidden="true"
              />
              <span style={{ color: "#d1d5db" }}>/</span>
              <span style={{ color: "#111827", fontWeight: 500 }}>
                {currentLabel}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ position: "relative" }}>
                <div style={S.topbarBtn}>
                  <i className="ti ti-bell" aria-hidden="true" />
                </div>
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#f59e0b",
                    position: "absolute",
                    top: 7,
                    right: 8,
                    boxShadow: "0 0 5px rgba(245,158,11,0.6)",
                  }}
                />
              </div>
              <div style={S.topbarBtn}>
                <i className="ti ti-settings" aria-hidden="true" />
              </div>
              <div
                style={{
                  ...S.topbarBtn,
                  width: "auto",
                  padding: "0 10px",
                  gap: 6,
                  fontSize: 12,
                  color: "#374151",
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    background: "#d1fae5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#15803d",
                  }}
                >
                  KD
                </div>
                M. Koly Doré
              </div>
            </div>
          </header>
        )}

        {/* Page content */}
        <main style={S.content}>{children}</main>
      </div>

      {/* Modal logout */}
      <LogoutModal
        isOpen={logoutModal}
        onClose={() => setLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
}
