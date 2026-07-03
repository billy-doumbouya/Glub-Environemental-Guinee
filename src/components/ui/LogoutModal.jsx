// src/components/dashboard/LogoutModal.jsx
export function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/55"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[88%] max-w-[300px] bg-gradient-to-br from-[#0d3d22] to-[#0f4c2a] border border-white/12 rounded-[18px] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.5)] text-center"
      >
        <div className="w-12 h-12 rounded-[14px] mx-auto mb-3.5 bg-red-600/15 border border-red-400/20 flex items-center justify-center">
          <i
            className="ti ti-logout text-red-400 text-[22px]"
            aria-hidden="true"
          />
        </div>
        <div className="text-base font-bold text-[#f0fdf4] mb-1.5">
          Déconnexion
        </div>
        <div className="text-xs text-[#f0fdf4]/38 mb-5 leading-normal">
          Voulez-vous vraiment quitter le dashboard ?
        </div>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 p-2.5 rounded-xl cursor-pointer bg-white/5 border border-white/10 text-[#f0fdf4]/62 text-xs font-medium hover:bg-white/10 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 p-2.5 rounded-xl cursor-pointer bg-red-600/20 border border-red-400/25 text-[#fca5a5] text-xs font-bold hover:bg-red-600/30 transition-colors"
          >NotificationDropdown
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}
