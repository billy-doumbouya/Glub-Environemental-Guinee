// src/pages/LoginPage.jsx
import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, Shield, ArrowRight } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) return toast.error("Entrez votre mot de passe");
    setLoading(true);
    try {
      await login(password);
      toast.success("Connexion réussie !");
    } catch (err) {
      toast.error(err.response?.data?.message || "Mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoClick = () => {
    const newClicks = logoClicks + 1;
    setLogoClicks(newClicks);

    if (newClicks >= 5) {
      toast.success("🎉 Easter egg débloqué !");
      setLogoClicks(0);
      navigate("/admin/dashboard");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(145deg, #0a2e1a 0%, #0d3d22 55%, #0f4c2a 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        position: "relative",
        overflow: "hidden",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* Ambient orbs */}
      <div
        style={{
          position: "absolute",
          top: -100,
          left: -80,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(34,197,94,0.13) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -80,
          right: -60,
          width: 240,
          height: 240,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(217,119,6,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Card */}
      <div
        style={{
          width: "100%",
          maxWidth: 380,
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.13)",
          borderRadius: 24,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          padding: "36px 28px 28px",
          boxShadow:
            "0 8px 48px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.1)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 28,
          }}
        >
          <div
            onClick={handleLogoClick}
            style={{
              width: 72,
              height: 72,
              overflow: "hidden",
              borderRadius: 20,
              marginBottom: 14,
              background:
                "linear-gradient(135deg, rgba(22,163,74,0.9), rgba(21,128,61,0.9))",
              border: "1px solid rgba(74,222,128,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                "0 0 28px rgba(34,197,94,0.22), inset 0 1px 0 rgba(255,255,255,0.15)",
              fontSize: 28,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: -1,
              cursor: "pointer",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <img
              src="/logo.png"
              alt="ONG C.E.G"
              className="w-full h-full object-cover"
            />
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#f0fdf4",
              marginBottom: 2,
            }}
          >
            ONG C.E.G
          </div>
          <div
            style={{
              fontSize: 12,
              color: "rgba(240,253,244,0.38)",
              letterSpacing: "0.04em",
            }}
          >
            Club Environnemental de Guinée
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "rgba(255,255,255,0.09)",
            marginBottom: 20,
          }}
        />

        {/* Security badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 12px",
            borderRadius: 8,
            background: "rgba(34,197,94,0.07)",
            border: "1px solid rgba(34,197,94,0.13)",
            marginBottom: 20,
          }}
        >
          <Shield size={15} color="#4ade80" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: "rgba(240,253,244,0.38)" }}>
            Espace sécurisé — Accès administrateur
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <label
            style={{
              display: "block",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              color: "rgba(240,253,244,0.38)",
              marginBottom: 8,
            }}
          >
            Mot de passe
          </label>

          <div style={{ position: "relative", marginBottom: 16 }}>
            {/* Lock icon */}
            <div
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "rgba(240,253,244,0.35)",
                fontSize: 17,
                pointerEvents: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>

            <input
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoFocus
              autoComplete="current-password"
              style={{
                width: "100%",
                padding: "13px 44px 13px 42px",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 12,
                color: "#f0fdf4",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "inherit",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(74,222,128,0.45)";
                e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255,255,255,0.12)";
                e.target.style.boxShadow = "none";
              }}
            />

            {/* Eye toggle button */}
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              aria-label={
                showPwd ? "Masquer le mot de passe" : "Afficher le mot de passe"
              }
              style={{
                position: "absolute",
                right: 14,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "rgba(240,253,244,0.35)",
                fontSize: 18,
                padding: 4,
                display: "flex",
                alignItems: "center",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#4ade80")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(240,253,244,0.35)")
              }
            >
              {showPwd ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: 14,
              background: "linear-gradient(135deg, #16a34a, #15803d)",
              border: "1px solid rgba(74,222,128,0.3)",
              borderRadius: 12,
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow:
                "0 4px 18px rgba(22,163,74,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
              opacity: loading ? 0.7 : 1,
              transition: "opacity 0.2s",
            }}
          >
            {loading ? (
              <>
                <span
                  style={{
                    width: 16,
                    height: 16,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
                Connexion…
              </>
            ) : (
              <>
                Se connecter
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p
          style={{
            textAlign: "center",
            color: "rgba(240,253,244,0.28)",
            fontSize: 11,
            marginTop: 20,
            lineHeight: 1.6,
          }}
        >
          Club Environnemental de Guinée © {new Date().getFullYear()}
          <br />
          <a
            href="https://www.clubenvironnementaldeguinee.org"
            target="_blank"
            rel="noreferrer"
            style={{ color: "rgba(74,222,128,0.6)", textDecoration: "none" }}
          >
            www.clubenvironnementaldeguinee.org
          </a>
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
