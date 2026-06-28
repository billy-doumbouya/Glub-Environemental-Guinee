// src/pages/StatisticsPage.jsx
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { statisticsService } from "../../../api/services";
import { DashboardLayout } from "../../layouts/DashboardLayout";

const ICON_OPTIONS = [
  "calendar",
  "folder",
  "users",
  "map",
  "globe",
  "heart",
  "chart-bar",
  "star",
  "flag",
];

const EMPTY = {
  label: "",
  value: 0,
  suffix: "",
  icon: "chart-bar",
  order: 0,
  isPublished: true,
};

// ── Sous-composants d'interface Glassmorphic ─────────────────────────

function GlassInput({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && (
        <label style={{
          display: "block", fontSize: 11, fontWeight: 600,
          letterSpacing: "0.06em", textTransform: "uppercase",
          color: "rgba(240,253,244,0.38)", marginBottom: 5,
        }}>
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "10px 12px",
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 10, color: "#f0fdf4",
          fontSize: 13, fontFamily: "inherit",
          outline: "none", boxSizing: "border-box",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "rgba(74,222,128,0.4)";
          e.target.style.boxShadow   = "0 0 0 3px rgba(34,197,94,0.08)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "rgba(255,255,255,0.1)";
          e.target.style.boxShadow   = "none";
        }}
      />
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "10px 12px", borderRadius: 10,
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.09)",
      marginBottom: 14,
    }}>
      <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(240,253,244,0.62)", display: "flex", alignItems: "center", gap: 6 }}>
        <i className="ti ti-eye" style={{ fontSize: 13 }} aria-hidden="true" />
        Visible publiquement
      </span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        style={{
          width: 40, height: 22, borderRadius: 11, border: "none",
          background: value ? "#16a34a" : "rgba(255,255,255,0.15)",
          cursor: "pointer", position: "relative",
          transition: "background 0.2s",
        }}
      >
        <div style={{
          position: "absolute", top: 3,
          left: value ? 21 : 3,
          width: 16, height: 16, borderRadius: "50%",
          background: "#fff", transition: "left 0.2s",
        }} />
      </button>
    </div>
  );
}

// ── Carte de Statistique ─────────────────────────────────────────────
function StatCard({ item, onEdit, onDelete }) {
  return (
    <div style={{
      background: "#fff",
      border: "1px solid rgba(0,0,0,0.07)",
      borderRadius: 14, overflow: "hidden",
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      transition: "transform 0.2s, box-shadow 0.2s",
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform  = "translateY(-2px)";
        e.currentTarget.style.boxShadow  = "0 8px 24px rgba(0,0,0,0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform  = "";
        e.currentTarget.style.boxShadow  = "";
      }}
    >
      <div style={{ padding: "20px 16px", textAlign: "center" }}>
        {/* Icon Badge */}
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: "rgba(34,197,94,0.08)", color: "#16a34a",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 12px", fontSize: 20,
        }}>
          <i className={`ti ti-${item.icon || "chart-bar"}`} aria-hidden="true" />
        </div>

        {/* Counter Value */}
        <div style={{
          fontSize: 26, fontWeight: 800, color: "#111827",
          lineHeight: 1.1, marginBottom: 4, letterSpacing: "-0.02em",
        }}>
          {item.value}
          {item.suffix && <span style={{ color: "#16a34a", marginLeft: 1 }}>{item.suffix}</span>}
        </div>

        {/* Label description */}
        <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 500, margin: 0 }}>
          {item.label}
        </div>
      </div>

      {/* Control panel */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 14px", borderTop: "1px solid #f9fafb", background: "#fbfbfe",
      }}>
        <span style={{
          fontSize: 10, padding: "2px 7px", borderRadius: 20, fontWeight: 600,
          background: item.isPublished ? "#dcfce7" : "#f3f4f6",
          color:      item.isPublished ? "#15803d" : "#6b7280",
        }}>
          {item.isPublished ? "Actif" : "Masqué"}
        </span>

        <div style={{ display: "flex", gap: 4 }}>
          <button
            onClick={() => onEdit(item)}
            style={{
              padding: "5px 8px", borderRadius: 8,
              background: "#fff", border: "1px solid #e5e7eb",
              color: "#374151", fontSize: 12, cursor: "pointer",
            }}
          >
            <i className="ti ti-edit" aria-hidden="true" />
          </button>
          <button
            onClick={() => onDelete(item)}
            style={{
              padding: "5px 8px", borderRadius: 8,
              background: "#fff5f5", border: "1px solid #fecaca",
              color: "#dc2626", fontSize: 12, cursor: "pointer",
            }}
          >
            <i className="ti ti-trash" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modale d'Édition / Création ──────────────────────────────────────
function StatModal({ isOpen, onClose, onSave, editItem, saving, form, setForm }) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.55)",
        display: "flex", alignItems: "flex-end", justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 440,
          background: "linear-gradient(165deg, #0d3d22 0%, #0f4c2a 100%)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "22px 22px 0 0",
          padding: "16px 20px 32px",
          maxHeight: "92vh", overflowY: "auto",
          boxShadow: "0 -8px 48px rgba(0,0,0,0.4)",
        }}
      >
        {/* Handle bar mobile style */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)", margin: "0 auto 16px" }} />

        {/* Title row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#f0fdf4" }}>
            {editItem ? "Modifier la statistique" : "Nouvelle statistique"}
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 9,
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "rgba(240,253,244,0.6)", fontSize: 16,
            }}
          >
            <i className="ti ti-x" aria-hidden="true" />
          </button>
        </div>

        <Toggle value={form.isPublished} onChange={(v) => setForm({ ...form, isPublished: v })} />

        <GlassInput label="Label / Libellé *" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Ex: Forages construits, Bénéficiaires..." />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <GlassInput label="Valeur *" type="number" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} />
          <GlassInput label="Suffixe" value={form.suffix} onChange={(e) => setForm({ ...form, suffix: e.target.value })} placeholder="Ex: +, %, Km" />
        </div>

        {/* Visual Selector for Icons */}
        <div style={{ marginBottom: 16 }}>
          <label style={{
            display: "block", fontSize: 11, fontWeight: 600,
            letterSpacing: "0.06em", textTransform: "uppercase",
            color: "rgba(240,253,244,0.38)", marginBottom: 8,
          }}>
            Sélectionner une icône
          </label>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8,
            padding: 10, background: "rgba(255,255,255,0.04)", borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            {ICON_OPTIONS.map((ico) => {
              const active = form.icon === ico;
              return (
                <button
                  key={ico}
                  type="button"
                  onClick={() => setForm({ ...form, icon: ico })}
                  style={{
                    height: 38, borderRadius: 8, cursor: "pointer",
                    background: active ? "#16a34a" : "transparent",
                    border: active ? "1px solid #4ade80" : "1px solid rgba(255,255,255,0.06)",
                    color: active ? "#fff" : "rgba(240,253,244,0.7)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                    transition: "all 0.15s",
                  }}
                  title={ico}
                >
                  <i className={`ti ti-${ico}`} aria-hidden="true" />
                </button>
              );
            })}
          </div>
        </div>

        <GlassInput label="Ordre de tri" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />

        {/* Actions panel */}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: 16 }}>
          <button
            onClick={onClose}
            style={{
              padding: "9px 16px", borderRadius: 10, cursor: "pointer",
              background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(240,253,244,0.62)", fontSize: 13, fontWeight: 500,
            }}
          >
            Annuler
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            style={{
              padding: "9px 18px", borderRadius: 10, cursor: saving ? "not-allowed" : "pointer",
              background: "linear-gradient(135deg, #16a34a, #15803d)",
              border: "1px solid rgba(74,222,128,0.3)",
              color: "#fff", fontSize: 13, fontWeight: 600,
              display: "flex", alignItems: "center", gap: 6, opacity: saving ? 0.7 : 1,
              boxShadow: "0 3px 12px rgba(22,163,74,0.25)",
            }}
          >
            {saving ? "Enregistrement…" : "Sauvegarder"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Dialogue de Confirmation de Suppression ──────────────────────────
function ConfirmDelete({ item, onClose, onConfirm, deleting }) {
  if (!item) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1100,
        background: "rgba(0,0,0,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "88%", maxWidth: 320,
          background: "linear-gradient(145deg, #0d3d22, #0f4c2a)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 18, padding: "24px 20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)", textAlign: "center",
        }}
      >
        <div style={{
          width: 46, height: 46, borderRadius: 13, margin: "0 auto 12px",
          background: "rgba(220,38,38,0.15)", border: "1px solid rgba(248,113,113,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
        }}>
          <i className="ti ti-trash" style={{ color: "#f87171" }} aria-hidden="true" />
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#f0fdf4", marginBottom: 6 }}>
          Supprimer l'élément
        </div>
        <div style={{ fontSize: 12, color: "rgba(240,253,244,0.38)", marginBottom: 18, lineHeight: 1.5 }}>
          Supprimer définitivement l'indicateur <strong style={{ color: "#f0fdf4" }}>{item.label}</strong> ?
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: 9, borderRadius: 10, cursor: "pointer",
              background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(240,253,244,0.62)", fontSize: 13, fontWeight: 500,
            }}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            style={{
              flex: 1, padding: 9, borderRadius: 10, cursor: deleting ? "not-allowed" : "pointer",
              background: "rgba(220,38,38,0.2)", border: "1px solid rgba(248,113,113,0.25)",
              color: "#fca5a5", fontSize: 13, fontWeight: 600, opacity: deleting ? 0.7 : 1,
            }}
          >
            {deleting ? "…" : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Composant Principal de la Page ───────────────────────────────────
export default function StatisticsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      const res = await statisticsService.getAllAdmin();
      setItems(res.data.data);
    } catch {
      toast.error("Erreur chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditItem(null);
    setForm(EMPTY);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      label: item.label,
      value: item.value,
      suffix: item.suffix || "",
      icon: item.icon || "chart-bar",
      order: item.order || 0,
      isPublished: item.isPublished !== false,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.label.trim()) return toast.error("Label requis");
    setSaving(true);
    try {
      if (editItem) {
        await statisticsService.update(editItem._id, form);
        toast.success("Statistique mise à jour ✅");
      } else {
        await statisticsService.create(form);
        toast.success("Statistique créée ✅");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await statisticsService.remove(deleteItem._id);
      toast.success("Supprimée");
      setDeleteItem(null);
      load();
    } catch {
      toast.error("Erreur");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={{
        minHeight: "100%",
        background: "linear-gradient(145deg, #0a2e1a 0%, #0d3d22 55%, #0f4c2a 100%)",
        padding: "20px 16px 32px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        position: "relative",
      }}>
        
        {/* Glow Effects */}
        <div style={{
          position: "absolute", top: -60, right: -40, width: 220, height: 220,
          borderRadius: "50%", pointerEvents: "none",
          background: "radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 70%)",
        }} />

        {/* Top Header Section */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#4ade80", marginBottom: 4, display: "flex", alignItems: "center", gap: 5 }}>
              <i className="ti ti-activity" aria-hidden="true" /> Métriques d'impact
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#f0fdf4", lineHeight: 1.2 }}>
              Statistiques Clés
            </div>
            <div style={{ fontSize: 12, color: "rgba(240,253,244,0.38)", marginTop: 3 }}>
              Données chiffrées affichées dynamiquement sur la page d'accueil
            </div>
          </div>
          <button
            onClick={openCreate}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "9px 16px", borderRadius: 10,
              background: "linear-gradient(135deg, #16a34a, #15803d)",
              border: "1px solid rgba(74,222,128,0.3)",
              color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
              boxShadow: "0 3px 12px rgba(22,163,74,0.25)", whiteSpace: "nowrap",
            }}
          >
            <i className="ti ti-plus" aria-hidden="true" />
            Nouvelle métrique
          </button>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div style={{ textAlign: "center", padding: "48px 0", color: "rgba(240,253,244,0.38)", fontSize: 13 }}>
            <span style={{
              width: 22, height: 22, border: "2px solid rgba(255,255,255,0.15)",
              borderTopColor: "#4ade80", borderRadius: "50%", display: "block",
              margin: "0 auto 12px", animation: "spin 0.8s linear infinite"
            }} />
            Chargement des chiffres clés…
          </div>
        )}

        {/* Empty layout state */}
        {!loading && items.length === 0 && (
          <div style={{ padding: "44px 20px", textAlign: "center", border: "1.5px dashed rgba(74,222,128,0.18)", borderRadius: 14, background: "rgba(34,197,94,0.02)" }}>
            <i className="ti ti-chart-bar" style={{ fontSize: 28, color: "rgba(74,222,128,0.3)", display: "block", marginBottom: 8 }} aria-hidden="true" />
            <p style={{ fontSize: 13, color: "rgba(240,253,244,0.38)", margin: 0 }}>Aucune statistique configurée.</p>
          </div>
        )}

        {/* List Layout */}
        {!loading && items.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
            gap: "14px",
          }}>
            {items.map((item) => (
              <StatCard
                key={item._id}
                item={item}
                onEdit={openEdit}
                onDelete={setDeleteItem}
              />
            ))}
          </div>
        )}
      </div>

      {/* Form Action Sheet & Drawer */}
      <StatModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        editItem={editItem}
        saving={saving}
        form={form}
        setForm={setForm}
      />

      {/* Confirmation Dialog Box */}
      <ConfirmDelete
        item={deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        deleting={deleting}
      />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </DashboardLayout>
  );
}