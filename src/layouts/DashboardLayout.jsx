// src/layouts/DashboardLayout.jsx
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { useNProgress } from "../utils/useNProgress ";
import { LogoutModal } from "../components/ui/modalLogout";
import { useUnreadNotifications } from "../hooks/useUnreadNotifications";
import { NotificationDropdown } from "../components/ui/NotificationDropdown";
import { Sidebar } from "../components/ui/sidebar";

// Importations des sous-composants

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
      { path: "/admin/messages", label: "Messages", icon: "ti-mail" },
      { path: "/admin/dons", label: "Dons", icon: "ti-coin" },
    ],
  },
  {
    section: "Veille & financement",
    items: [
      { path: "/admin/veille", label: "Vue synthétique", icon: "ti-chart-dots" },
      {
        path: "/admin/veille/opportunites",
        label: "Appels à projets",
        icon: "ti-file-search",
      },
      { path: "/admin/veille/sources", label: "Sources", icon: "ti-database" },
      { path: "/admin/veille/profil", label: "Profil ONG", icon: "ti-user-circle" },
    ],
  },
  {
    section: "Apparence",
    items: [
      {
        path: "/admin/apparence/backgrounds",
        label: "Images de fond",
        icon: "ti-photo-edit",
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

export function DashboardLayout({ children }) {
  useNProgress();
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { messages, donations, total } = useUnreadNotifications();

  const [notifOpen, setNotifOpen] = useState(false);
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  const activeNavPath = NAV_ITEMS.flatMap((group) => group.items).reduce(
    (best, item) => {
      const current = location.pathname;
      const isExactMatch = current === item.path;
      const isChildMatch =
        item.path !== "/" &&
        current.startsWith(`${item.path}/`);

      if (!best && (isExactMatch || isChildMatch)) return item.path;
      if (best && (isExactMatch || isChildMatch) && item.path.length > best.length) {
        return item.path;
      }
      return best;
    },
    null,
  );

  const handleConfirmLogout = async () => {
    setLogoutModal(false);
    await logout();
    toast.success("Vous êtes déconnecté du site.");
    navigate("/admin-login");
  };

  const currentLabel =
    NAV_ITEMS.flatMap((s) => s.items).find((i) => i.path === activeNavPath)?.label ??
    "Dashboard";

  return (
    <div className="flex min-h-screen bg-[#f3f8f4] font-sans antialiased select-none">
      {/* Overlay Mobile */}
      {isMobile && menuOpen && (
        <div
          className="fixed inset-0 bg-black/45 z-[999]"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* ── SIDEBAR COMPONENT ── */}
      <Sidebar
        isMobile={isMobile}
        visible={!isMobile || menuOpen}
        setMenuOpen={setMenuOpen}
        location={location}
        activePath={activeNavPath}
        navItems={NAV_ITEMS}
        onLogoutClick={() => setLogoutModal(true)}
      />

      {/* ── CONTENU CENTRAL ── */}
      <div
        className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ${isMobile ? "ml-0" : "ml-[230px]"}`}
      >
        {/* Topbar Mobile */}
        {isMobile && (
          <header className="fixed top-0 left-0 right-0 z-40 h-[62px] flex-shrink-0 bg-gradient-to-r from-[#0a2e1a] via-[#14532d] to-[#166534] border-b border-white/10 flex items-center px-4 gap-3 shadow-[0_18px_45px_rgba(20,83,45,0.18)]">
            <button
              className="w-10 h-10 rounded-2xl bg-white/8 border border-white/12 flex items-center justify-center cursor-pointer text-[#f0fdf4] text-lg shadow-md"
              onClick={() => setMenuOpen(true)}
            >
              <i className="ti ti-menu-2" aria-hidden="true" />
            </button>
            <div className="font-bold text-[#f0fdf4] flex-1 text-sm tracking-wide">
              ONG C.E.G
            </div>

            {/* Notification Dropdown Mobile */}
            <NotificationDropdown
              isOpen={notifOpen}
              setIsOpen={setNotifOpen}
              total={total}
              messages={messages}
              donations={donations}
            />
          </header>
        )}

        {/* Topbar Desktop */}
        {!isMobile && (
          <header className="fixed top-0 right-0 z-40 h-20 border-b border-green-100 bg-white/90 backdrop-blur-md shadow-[0_12px_30px_rgba(15,118,110,0.05)]" style={{ left: "230px", width: "calc(100% - 230px)" }}>
            <div className="flex h-full items-center justify-between gap-4 px-6 lg:px-8">
              <div className="flex min-w-0 items-center gap-3 text-sm">
                <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-green-700">
                  <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_0_4px_rgba(34,197,94,0.15)]" />
                  Admin
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <i className="ti ti-home text-[14px] text-green-700" aria-hidden="true" />
                  <span className="text-slate-300">/</span>
                  <span className="inline-flex items-center rounded-full border border-green-100 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-800">
                    {currentLabel}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <NotificationDropdown
                  isOpen={notifOpen}
                  setIsOpen={setNotifOpen}
                  total={total}
                  messages={messages}
                  donations={donations}
                  className="shrink-0"
                />

                <Link
                  to="/admin/apparence/backgrounds"
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-green-200 bg-gradient-to-br from-[#f0fdf4] to-white text-green-700 shadow-sm transition-all duration-200 hover:translate-y-[-1px] hover:shadow-md"
                  aria-label="Réglages"
                >
                  <i className="ti ti-settings text-[16px]" aria-hidden="true" />
                </Link>

                <div className="flex items-center gap-3 rounded-2xl border border-green-100 bg-gradient-to-r from-[#f0fdf4] via-white to-[#f8fafc] px-3 py-2 shadow-sm">
                  <div className="h-10 w-10 overflow-hidden rounded-xl border border-green-200 bg-green-100 shadow-inner">
                    <img
                      src="/admin.jpg"
                      alt="admin"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="text-left leading-tight">
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-green-700">
                      Admin
                    </span>
                    <span className="block text-sm font-semibold text-slate-800">
                      M. Koly Doré
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Corps de la page */}
        <main className={`flex-1 bg-[#f3f8f4] min-h-screen ${isMobile ? "pt-[62px]" : "pt-[80px]"}`}>
          {children}
        </main>
      </div>

      {/* ── LOGOUT MODAL COMPONENT ── */}
      <LogoutModal
        isOpen={logoutModal}
        onClose={() => setLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
}
