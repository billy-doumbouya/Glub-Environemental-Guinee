// src/components/dashboard/sidebar.jsx
import { Link } from "react-router-dom";

export function Sidebar({
  isMobile,
  visible,
  setMenuOpen,
  location,
  navItems,
  onLogoutClick,
}) {
  return (
    <aside
      className={`w-[230px] bg-gradient-to-b from-[#0a2e1a] via-[#0d3d22] to-[#0f4c2a] flex flex-col fixed h-screen overflow-y-auto z-[1000] transition-transform duration-300 ${
        visible ? "translate-x-0" : "-translate-x-[230px]"
      }`}
    >
      {/* Logo Container */}
      <div className="p-[18px_14px_16px] border-b border-white/8 flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-[38px] h-[38px] rounded-[11px] flex-shrink-0 bg-gradient-to-br from-green-600 to-green-700 border border-green-400/30 flex items-center justify-center font-extrabold text-white shadow-[0_0_14px_rgba(34,197,94,0.2)] overflow-hidden">
            <img
              src="/logo.png"
              fetchPriority="high"
              alt="C.E.G Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="text-sm font-bold text-[#f0fdf4]">ONG C.E.G</div>
            <div className="text-[10px] text-[#f0fdf4]/38 mt-px">
              Dashboard Admin
            </div>
          </div>
        </div>
        {isMobile && (
          <button
            onClick={() => setMenuOpen(false)}
            className="bg-transparent border-none cursor-pointer text-[#f0fdf4]/60 text-xl flex items-center"
          >
            <i className="ti ti-x" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Nav List */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {navItems.map((group) => (
          <div key={group.section}>
            <span className="text-[9px] font-semibold tracking-wider uppercase text-[#f0fdf4]/38 p-[12px_10px_5px] block">
              {group.section}
            </span>
            {group.items.map((item) => {
              const active =
                location.pathname === item.path ||
                (item.path !== "/admin/dashboard" &&
                  location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2.5 p-[9px_10px] rounded-xl my-px mx-2.5 no-underline transition-all duration-200 relative text-xs ${
                    active
                      ? "text-[#bbf7d0] bg-green-500/15 border border-green-400/20 font-medium"
                      : "text-[#f0fdf4]/62 bg-transparent border border-transparent hover:bg-white/5"
                  }`}
                >
                  {active && (
                    <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-0.5 h-4.5 rounded-e bg-green-400" />
                  )}
                  <i
                    className={`ti ${item.icon} text-sm w-4.5 text-center ${
                      active ? "text-green-400" : "text-[#f0fdf4]/38"
                    }`}
                    aria-hidden="true"
                  />
                  <span className="flex-1">{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Profil / Deconnexion Footer */}
      <div className="p-3 border-t border-white/7">
        <div className="flex items-center gap-2.5 p-[9px_10px] rounded-xl bg-white/5 border border-white/8 mb-2">
          <div className="w-7.5 h-7.5 rounded-[9px] flex-shrink-0 bg-gradient-to-br from-green-500/30 to-green-600/30 border border-green-400/20 flex items-center justify-center overflow-hidden">
            <img
              src="/admin.jpg"
              alt="admin"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="text-xs font-medium text-[#f0fdf4] leading-tight">
              M. Koly Doré
            </div>
            <div className="text-[10px] text-[#f0fdf4]/38">Administrateur</div>
          </div>
        </div>
        <button
          className="w-full p-[9px_12px] bg-red-600/10 border border-red-400/15 rounded-xl text-[#fca5a5] text-xs font-medium cursor-pointer flex items-center gap-1.5 hover:bg-red-600/20 transition-colors"
          onClick={onLogoutClick}
        >
          <i className="ti ti-logout" aria-hidden="true" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
