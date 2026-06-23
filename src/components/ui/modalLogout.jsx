// src/components/ui/LogoutModal.jsx

export function LogoutModal({ isOpen, onClose, onConfirm, isMobile }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        backdropFilter: "blur(4px)", // Floute l'arrière-plan du dashboard
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "20px",
      }}
      onClick={onClose}
    >
      {/* Conteneur du Modal avec style Glassmorphism */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.25)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)", // Support Safari
          border: "1px solid rgba(255, 255, 255, 0.3)",
          borderRadius: "20px",
          padding: isMobile ? "24px 16px" : "32px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
          color: "#111827",
          textAlign: "center",
          animation: "scaleUp 0.2s ease-out",
        }}
        onClick={(e) => e.stopPropagation()} // Empêche la fermeture en cliquant sur le blanc
      >
        {/* Section Logo (Récupéré depuis le dossier /public) */}
        <div style={{ marginBottom: "20px" }}>
          <img
            src="/logo.png" // Remplace par le nom exact de ton fichier dans public/ (ex: logo-ong.png)
            alt="Logo ONG C.E.G"
            style={{
              height: "64px",
              objectFit: "contain",
              filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.1))",
            }}
            onError={(e) => {
              // Fallback si le logo n'est pas trouvé
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "block";
            }}
          />
          <div style={{ display: "none", fontSize: "40px" }}>🌱</div>
        </div>

        {/* Titre et message */}
        <h3 style={{ margin: "0 0 8px", fontSize: "18px", fontWeight: "700" }}>
          Déconnexion
        </h3>
        <p style={{ margin: "0 0 24px", fontSize: "14px", color: "#374151" }}>
          Êtes-vous sûr de vouloir quitter votre session de gestion ?
        </p>

        {/* Boutons d'action */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px",
              background: "rgba(255, 255, 255, 0.5)",
              border: "1px solid rgba(255, 255, 255, 0.5)",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px",
              color: "#4B5563",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.background = "rgba(255, 255, 255, 0.8)")}
            onMouseLeave={(e) => (e.target.style.background = "rgba(255, 255, 255, 0.5)")}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "12px",
              background: "#DC2626", // Rouge pour l'action destructive
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px",
              color: "white",
              boxShadow: "0 4px 12px rgba(220, 38, 38, 0.2)",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.target.style.opacity = "1")}
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}