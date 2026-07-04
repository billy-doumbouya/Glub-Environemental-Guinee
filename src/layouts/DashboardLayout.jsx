// src/layouts/DashboardLayout.jsx
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { useNProgress } from "../utils/useNProgress ";
import { Sidebar } from "../components/ui/sidebar";
import { LogoutModal } from "../components/ui/modalLogout";
import { useUnreadNotifications } from "../hooks/useUnreadNotifications";
import { NotificationDropdown } from "../components/ui/NotificationDropdown";

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
        navItems={NAV_ITEMS}
        onLogoutClick={() => setLogoutModal(true)}
      />

      {/* ── CONTENU CENTRAL ── */}
      <div
        className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ${isMobile ? "ml-0" : "ml-[230px]"}`}
      >
        {/* Topbar Mobile */}
        {isMobile && (
          <header className="h-[54px] flex-shrink-0 bg-gradient-to-r from-[#0a2e1a] to-[#0d3d22] border-b border-white/8 flex items-center px-4 gap-3">
            <button
              className="w-9 h-9 rounded-[9px] bg-white/8 border border-white/12 flex items-center justify-center cursor-pointer text-[#f0fdf4] text-lg"
              onClick={() => setMenuOpen(true)}
            >
              <i className="ti ti-menu-2" aria-hidden="true" />
            </button>
            <div className="font-bold text-[#f0fdf4] flex-1 text-sm">
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
          <header className="h-13 flex-shrink-0 bg-white border-b border-black/6 flex items-center px-5 gap-3">
            <div className="flex items-center gap-1.5 flex-1 text-xs text-gray-500">
              <i className="ti ti-home text-[14px]" aria-hidden="true" />
              <span className="text-gray-300">/</span>
              <span className="text-gray-900 font-medium">{currentLabel}</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Notification Dropdown Desktop */}
              <NotificationDropdown
                isOpen={notifOpen}
                setIsOpen={setNotifOpen}
                total={total}
                messages={messages}
                donations={donations}
              />

              <Link
                to="/admin/apparence/backgrounds"
                className="w-8.5 h-8.5 rounded-[9px] bg-gray-50 border border-gray-200 flex items-center justify-center cursor-pointer text-gray-500 text-[15px] hover:bg-gray-100 transition-colors"
              >
                <i className="ti ti-settings" aria-hidden="true" />
              </Link>

              <div className="h-8.5 rounded-[9px] bg-gray-50 border border-gray-200 flex items-center text-gray-700 text-xs px-2.5 gap-1.5 select-none">
                <div className="w-5.5 h-5.5 rounded-md overflow-hidden bg-green-100 flex items-center justify-center">
                  <img
                    src="/admin.jpg"
                    alt="admin"
                    className="w-full h-full object-cover"
                  />
                </div>
                M. Koly Doré
              </div>
            </div>
          </header>
        )}

        {/* Corps de la page */}
        <main className="flex-1 bg-[#f3f8f4] min-h-[calc(100vh-52px)]">
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
