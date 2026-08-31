// src/components/dashboard/NotificationDropdown.jsx
import { Link } from "react-router-dom";

export function NotificationDropdown({
  isOpen,
  setIsOpen,
  total,
  messages,
  donations,
  className = "",
}) {
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#f0fdf4] to-white border border-green-200/80 shadow-sm flex items-center justify-center cursor-pointer text-green-700 text-[16px] hover:bg-green-50 transition-all duration-200 hover:shadow-md"
      >
        <i className="ti ti-bell" aria-hidden="true" />
      </button>

      {total > 0 && (
        <div className="w-2.5 h-2.5 rounded-full bg-amber-400 absolute top-1.5 right-2 border-2 border-white shadow-[0_0_0_3px_rgba(251,191,36,0.2)]" />
      )}

      {isOpen && (
        <div className="absolute right-0 top-14 w-72 bg-white border border-green-100 rounded-2xl shadow-[0_18px_45px_rgba(20,83,45,0.12)] z-50 overflow-hidden text-left">
          <div className="px-4 py-3 border-b border-green-50 text-sm font-semibold text-slate-800 bg-gradient-to-r from-[#f0fdf4] to-white">
            Notifications {total > 0 && `(${total})`}
          </div>
          <div className="max-h-72 overflow-y-auto">
            {messages.slice(0, 3).map((m) => (
              <Link
                key={m._id}
                to="/admin/messages"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2.5 hover:bg-green-50 border-b border-green-50 transition-colors"
              >
                <div className="text-xs font-medium text-slate-900">{m.name}</div>
                <div className="text-xs text-slate-500 truncate">{m.subject}</div>
              </Link>
            ))}
            {donations.slice(0, 3).map((d) => (
              <Link
                key={d._id}
                to="/admin/dons"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2.5 hover:bg-green-50 border-b border-green-50 transition-colors"
              >
                <div className="text-xs font-medium text-slate-900">{d.donorName}</div>
                <div className="text-xs text-slate-500">
                  {d.amount.toLocaleString("fr-FR")} GNF
                </div>
              </Link>
            ))}
            {total === 0 && (
              <div className="px-4 py-6 text-center text-xs text-slate-400">
                Aucune nouvelle notification
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}