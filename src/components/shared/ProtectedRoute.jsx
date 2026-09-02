// src/components/shared/ProtectedRoute.jsx
// Protège les routes nécessitant une authentification

import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const skeletonStyle = {
  background: "linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.14) 50%, rgba(255,255,255,0.05) 75%)",
  backgroundSize: "200% 100%",
  animation: "dashboard-shimmer 1.6s ease-in-out infinite",
  borderRadius: 14,
};

export function ProtectedRoute({ children }) {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <>
        <style>{`
          @keyframes dashboard-shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          @keyframes dashboard-pulse {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
          }
        `}</style>

        <div
          style={{
            minHeight: "100vh",
            background:
              "radial-gradient(circle at top left, rgba(34,197,94,0.18), transparent 30%), linear-gradient(135deg, #06160f 0%, #0a1f18 42%, #0d261d 100%)",
            color: "#ecfdf5",
            fontFamily: "Inter, Segoe UI, sans-serif",
            padding: "28px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              maxWidth: 1440,
              margin: "0 auto",
              borderRadius: 28,
              background: "rgba(10, 18, 16, 0.72)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
              overflow: "hidden",
              backdropFilter: "blur(12px)",
            }}
          >
            <div style={{ display: "flex", minHeight: "100vh" }}>
              <aside
                style={{
                  width: 280,
                  background: "rgba(10, 14, 12, 0.9)",
                  borderRight: "1px solid rgba(255,255,255,0.06)",
                  padding: "24px 18px",
                  boxSizing: "border-box",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
                  <div style={{ ...skeletonStyle, width: 42, height: 42, borderRadius: 14 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ ...skeletonStyle, width: "70%", height: 14, marginBottom: 10 }} />
                    <div style={{ ...skeletonStyle, width: "45%", height: 10 }} />
                  </div>
                </div>

                <div style={{ display: "grid", gap: 12 }}>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 12px",
                        borderRadius: 14,
                        background: index === 0 ? "rgba(22,163,74,0.12)" : "rgba(255,255,255,0.02)",
                        border: index === 0 ? "1px solid rgba(74,222,128,0.18)" : "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      <div style={{ ...skeletonStyle, width: 18, height: 18, borderRadius: 8 }} />
                      <div style={{ ...skeletonStyle, width: "70%", height: 12 }} />
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 34, padding: "16px 14px", borderRadius: 18, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ ...skeletonStyle, width: "72%", height: 12, marginBottom: 16 }} />
                  <div style={{ ...skeletonStyle, width: "100%", height: 58, borderRadius: 14 }} />
                </div>
              </aside>

              <main style={{ flex: 1, padding: "26px 28px 32px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ ...skeletonStyle, width: "26%", height: 18, marginBottom: 12 }} />
                    <div style={{ ...skeletonStyle, width: "18%", height: 12 }} />
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ ...skeletonStyle, width: 120, height: 38, borderRadius: 12 }} />
                    <div style={{ ...skeletonStyle, width: 110, height: 38, borderRadius: 12 }} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 18, marginBottom: 28 }}>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      style={{
                        padding: 18,
                        borderRadius: 20,
                        background: "rgba(255,255,255,0.025)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        minHeight: 132,
                      }}
                    >
                      <div style={{ ...skeletonStyle, width: "42%", height: 12, marginBottom: 18 }} />
                      <div style={{ ...skeletonStyle, width: "58%", height: 30, marginBottom: 18 }} />
                      <div style={{ ...skeletonStyle, width: "52%", height: 10 }} />
                    </div>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 18 }}>
                  <div style={{ padding: 22, borderRadius: 22, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ ...skeletonStyle, width: "28%", height: 16, marginBottom: 18 }} />
                    <div style={{ height: 220, borderRadius: 18, ...skeletonStyle, marginBottom: 16 }} />
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12 }}>
                      {[1, 2, 3].map((item) => (
                        <div key={item} style={{ ...skeletonStyle, height: 70, borderRadius: 14 }} />
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "grid", gap: 18 }}>
                    {[1, 2].map((item) => (
                      <div key={item} style={{ padding: 18, borderRadius: 20, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <div style={{ ...skeletonStyle, width: "40%", height: 12, marginBottom: 16 }} />
                        <div style={{ ...skeletonStyle, width: "100%", height: 14, marginBottom: 10 }} />
                        <div style={{ ...skeletonStyle, width: "90%", height: 14, marginBottom: 10 }} />
                        <div style={{ ...skeletonStyle, width: "80%", height: 14 }} />
                      </div>
                    ))}
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!isAdmin) return <Navigate to="/admin-login" replace />;

  return children;
}
