// src/components/dashboard/NotificationDropdown.jsx
import { Link } from "react-router-dom";

export function NotificationDropdown({ isOpen, setIsOpen, total, messages, donations }) {
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="w-8.5 h-8.5 rounded-[9px] bg-gray-50 border border-gray-200 flex items-center justify-center cursor-pointer text-gray-500 text-[15px] hover:bg-gray-100 transition-colors"
      >
        <i className="ti ti-bell" aria-hidden="true" />
      </button>
      
      {total > 0 && (
        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute top-1.5 right-2 shadow-[0_0_5px_rgba(245,158,11,0.6)]" />
      )}

      {isOpen && (
        <div className="absolute right-0 top-11 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden text-left">
          <div className="px-4 py-3 border-b border-gray-100 text-sm font-semibold text-gray-800">
            Notifications {total > 0 && `(${total})`}
          </div>
          <div className="max-h-72 overflow-y-auto">
            {messages.slice(0, 3).map((m) => (
              <Link
                key={m._id}
                to="/admin/messages"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2.5 hover:bg-gray-50 border-b border-gray-50"
              >
                <div className="text-xs font-medium text-gray-900">{m.name}</div>
                <div className="text-xs text-gray-500 truncate">{m.subject}</div>
              </Link>
            ))}
            {donations.slice(0, 3).map((d) => (
              <Link
                key={d._id}
                to="/admin/dons"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2.5 hover:bg-gray-50 border-b border-gray-50"
              >
                <div className="text-xs font-medium text-gray-900">{d.donorName}</div>
                <div className="text-xs text-gray-500">
                  {d.amount.toLocaleString("fr-FR")} GNF
                </div>
              </Link>
            ))}
            {total === 0 && (
              <div className="px-4 py-6 text-center text-xs text-gray-400">
                Aucune nouvelle notification
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}