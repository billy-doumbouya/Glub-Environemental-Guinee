// src/pages/DomainsPage.jsx
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { domainsService } from "../../../api/services";
import { DashboardLayout } from "../../layouts/DashboardLayout";

// ── Design tokens ─────────────────────────────────────────────────
const glass = {
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.12)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
};

const EMPTY = {
  title: "",
  shortTitle: "",
  icon: "leaf",
  color: "#16a34a",
  bgColor: "#F0FDF4",
  description: "",
  activities: "",
  impact: "",
  order: 0,
  isPublished: true,
};

// ── Sub-components ────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "rgba(240,253,244,0.38)",
        marginBottom: 10,
      }}
    >
      {children}
    </div>
  );
}

function GlassInput({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && (
        <label
          style={{
            display: "block",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "rgba(240,253,244,0.38)",
            marginBottom: 5,
          }}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "10px 12px",
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 10,
          color: "#f0fdf4",
          fontSize: 13,
          fontFamily: "inherit",
          outline: "none",
          boxSizing: "border-box",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "rgba(74,222,128,0.4)";
          e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.08)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "rgba(255,255,255,0.1)";
          e.target.style.boxShadow = "none";
        }}
      />
    </div>
  );
}

function GlassTextarea({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && (
        <label
          style={{
            display: "block",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "rgba(240,253,244,0.38)",
            marginBottom: 5,
          }}
        >
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "10px 12px",
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 10,
          color: "#f0fdf4",
          fontSize: 13,
          fontFamily: "inherit",
          outline: "none",
          resize: "vertical",
          boxSizing: "border-box",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "rgba(74,222,128,0.4)";
          e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.08)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "rgba(255,255,255,0.1)";
          e.target.style.boxShadow = "none";
        }}
      />
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 12px",
        borderRadius: 10,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.09)",
        marginBottom: 14,
      }}
    >
      <span
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: "rgba(240,253,244,0.62)",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <i className="ti ti-eye" style={{ fontSize: 13 }} aria-hidden="true" />
        Publié sur le site
      </span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        style={{
          width: 40,
          height: 22,
          borderRadius: 11,
          border: "none",
          background: value ? "#16a34a" : "rgba(255,255,255,0.15)",
          cursor: "pointer",
          position: "relative",
          transition: "background 0.2s",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 3,
            left: value ? 21 : 3,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#fff",
            transition: "left 0.2s",
          }}
        />
      </button>
    </div>
  );
}

// ── Domain Card ───────────────────────────────────────────────────
function DomainCard({ item, onEdit, onDelete }) {
  const activities = Array.isArray(item.activities)
    ? item.activities
    : String(item.activities || "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.07)",
        borderRadius: 14,
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      {/* Accent bar */}
      <div style={{ height: 4, background: item.color }} />

      <div style={{ padding: "14px 14px 12px" }}>
        {/* Top row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              flexShrink: 0,
              background: item.bgColor || "#f0fdf4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            🌿
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: item.color,
                lineHeight: 1.3,
              }}
            >
              {item.title}
            </div>
            {item.shortTitle && (
              <div style={{ fontSize: 11, color: "#6b7280", marginTop: 1 }}>
                {item.shortTitle}
              </div>
            )}
          </div>
          <span
            style={{
              fontSize: 10,
              padding: "3px 8px",
              borderRadius: 20,
              fontWeight: 600,
              flexShrink: 0,
              background: item.isPublished ? "#dcfce7" : "#f3f4f6",
              color: item.isPublished ? "#15803d" : "#6b7280",
            }}
          >
            {item.isPublished ? "Publié" : "Masqué"}
          </span>
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: 12,
            color: "#6b7280",
            lineHeight: 1.55,
            marginBottom: 10,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.description}
        </p>

        {/* Activity tags */}
        {activities.length > 0 && (
          <div style={{ marginBottom: 10 }}>
            {activities.slice(0, 3).map((a, i) => (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  fontSize: 10,
                  padding: "3px 8px",
                  borderRadius: 6,
                  margin: "2px 2px 2px 0",
                  background: "#f0fdf4",
                  color: "#15803d",
                  border: "1px solid #bbf7d0",
                }}
              >
                {a}
              </span>
            ))}
          </div>
        )}

        {/* Impact */}
        {item.impact && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 11,
              color: "#6b7280",
              padding: "7px 10px",
              borderRadius: 8,
              background: "#f9fafb",
              border: "1px solid #f3f4f6",
              marginBottom: 12,
            }}
          >
            <i
              className="ti ti-sparkles"
              style={{ fontSize: 13, color: "#f59e0b" }}
              aria-hidden="true"
            />
            {item.impact}
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 10,
            borderTop: "1px solid #f3f4f6",
          }}
        >
          <span style={{ fontSize: 10, color: "#d1d5db" }}>
            <i className="ti ti-sort-ascending" aria-hidden="true" /> Ordre{" "}
            {item.order ?? 0}
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => onEdit(item)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "6px 11px",
                borderRadius: 8,
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                color: "#374151",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              <i className="ti ti-edit" aria-hidden="true" /> Éditer
            </button>
            <button
              onClick={() => onDelete(item)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "6px 10px",
                borderRadius: 8,
                background: "#fff5f5",
                border: "1px solid #fecaca",
                color: "#dc2626",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              <i className="ti ti-trash" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Modal form ────────────────────────────────────────────────────
function DomainModal({ isOpen, onClose, onSave, editItem, saving }) {
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (editItem) {
      setForm({
        title: editItem.title || "",
        shortTitle: editItem.shortTitle || "",
        icon: editItem.icon || "leaf",
        color: editItem.color || "#16a34a",
        bgColor: editItem.bgColor || "#F0FDF4",
        description: editItem.description || "",
        activities: Array.isArray(editItem.activities)
          ? editItem.activities.join("\n")
          : editItem.activities || "",
        impact: editItem.impact || "",
        order: editItem.order || 0,
        isPublished: editItem.isPublished !== false,
      });
    } else {
      setForm(EMPTY);
    }
  }, [editItem, isOpen]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 480,
          background: "linear-gradient(165deg, #0d3d22 0%, #0f4c2a 100%)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "22px 22px 0 0",
          padding: "16px 20px 32px",
          maxHeight: "88vh",
          overflowY: "auto",
          boxShadow: "0 -8px 48px rgba(0,0,0,0.4)",
        }}
      >
        {/* Handle */}
        <div
          style={{
            width: 36,
            height: 4,
            borderRadius: 2,
            background: "rgba(255,255,255,0.15)",
            margin: "0 auto 16px",
          }}
        />

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 18,
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 700, color: "#f0fdf4" }}>
            {editItem ? "Modifier le domaine" : "Nouveau domaine"}
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "rgba(240,253,244,0.6)",
              fontSize: 16,
            }}
          >
            <i className="ti ti-x" aria-hidden="true" />
          </button>
        </div>

        <Toggle
          value={form.isPublished}
          onChange={(v) => setForm((f) => ({ ...f, isPublished: v }))}
        />

        <GlassInput
          label="Titre *"
          value={form.title}
          onChange={set("title")}
          placeholder="Ex: Environnement"
        />
        <GlassInput
          label="Titre court"
          value={form.shortTitle}
          onChange={set("shortTitle")}
          placeholder="Ex: Protection écosystèmes"
        />
        <GlassTextarea
          label="Description"
          value={form.description}
          onChange={set("description")}
          placeholder="Description du domaine…"
          rows={3}
        />
        <GlassTextarea
          label="Activités (une par ligne)"
          value={form.activities}
          onChange={set("activities")}
          placeholder={"Reboisement\nSensibilisation\nBiodiversité"}
          rows={4}
        />
        <GlassInput
          label="Impact"
          value={form.impact}
          onChange={set("impact")}
          placeholder="Ex: 5 000 arbres plantés…"
        />

        {/* Row : icône / couleur / ordre */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 80px",
            gap: 10,
          }}
        >
          <GlassInput
            label="Icône"
            value={form.icon}
            onChange={set("icon")}
            placeholder="leaf"
          />
          <div style={{ marginBottom: 12 }}>
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "rgba(240,253,244,0.38)",
                marginBottom: 5,
              }}
            >
              Couleur
            </label>
            <input
              type="color"
              value={form.color}
              onChange={set("color")}
              style={{
                width: "100%",
                height: 40,
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
                cursor: "pointer",
                background: "none",
                padding: 2,
              }}
            />
          </div>
          <GlassInput
            label="Ordre"
            type="number"
            value={form.order}
            onChange={set("order")}
          />
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
            paddingTop: 14,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            marginTop: 4,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "9px 16px",
              borderRadius: 10,
              cursor: "pointer",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(240,253,244,0.62)",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            Annuler
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={saving}
            style={{
              padding: "9px 18px",
              borderRadius: 10,
              cursor: saving ? "not-allowed" : "pointer",
              background: "linear-gradient(135deg, #16a34a, #15803d)",
              border: "1px solid rgba(74,222,128,0.3)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
              opacity: saving ? 0.7 : 1,
              boxShadow: "0 3px 12px rgba(22,163,74,0.25)",
            }}
          >
            {saving ? (
              <>
                <span
                  style={{
                    width: 14,
                    height: 14,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
                Sauvegarde…
              </>
            ) : (
              <>
                <i className="ti ti-device-floppy" aria-hidden="true" />
                Sauvegarder
              </>
            )}
          </button>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Confirm dialog ────────────────────────────────────────────────
function ConfirmDelete({ item, onClose, onConfirm, deleting }) {
  if (!item) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1100,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "88%",
          maxWidth: 300,
          background: "linear-gradient(145deg, #0d3d22, #0f4c2a)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 18,
          padding: "24px 20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 13,
            margin: "0 auto 12px",
            background: "rgba(220,38,38,0.15)",
            border: "1px solid rgba(248,113,113,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
          }}
        >
          <i
            className="ti ti-trash"
            style={{ color: "#f87171" }}
            aria-hidden="true"
          />
        </div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#f0fdf4",
            marginBottom: 6,
          }}
        >
          Supprimer le domaine
        </div>
        <div
          style={{
            fontSize: 12,
            color: "rgba(240,253,244,0.38)",
            marginBottom: 18,
            lineHeight: 1.5,
          }}
        >
          Supprimer <strong style={{ color: "#f0fdf4" }}>{item.title}</strong> ?
          Cette action est irréversible.
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: 9,
              borderRadius: 10,
              cursor: "pointer",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(240,253,244,0.62)",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            style={{
              flex: 1,
              padding: 9,
              borderRadius: 10,
              cursor: deleting ? "not-allowed" : "pointer",
              background: "rgba(220,38,38,0.2)",
              border: "1px solid rgba(248,113,113,0.25)",
              color: "#fca5a5",
              fontSize: 13,
              fontWeight: 600,
              opacity: deleting ? 0.7 : 1,
            }}
          >
            {deleting ? "…" : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page principale ───────────────────────────────────────────────
export default function DomainsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      const res = await domainsService.getAll();
      setItems(res.data.data);
    } catch {
      toast.error("Erreur chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditItem(null);
    setModalOpen(true);
  };
  const openEdit = (item) => {
    setEditItem(item);
    setModalOpen(true);
  };

  const handleSave = async (form) => {
    if (!form.title.trim()) return toast.error("Titre requis");
    setSaving(true);
    try {
      const data = {
        ...form,
        activities: JSON.stringify(
          form.activities
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
        ),
      };
      if (editItem) {
        await domainsService.update(editItem._id, data);
        toast.success("Domaine mis à jour ✅");
      } else {
        await domainsService.create(data);
        toast.success("Domaine créé ✅");
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
      await domainsService.remove(deleteItem._id);
      toast.success("Supprimé");
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
      <div
        style={{
          minHeight: "100%",
          background:
            "linear-gradient(145deg, #0a2e1a 0%, #0d3d22 55%, #0f4c2a 100%)",
          padding: "20px 16px 32px",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          position: "relative",
        }}
      >
        {/* Ambient orb */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -60,
            width: 280,
            height: 280,
            borderRadius: "50%",
            pointerEvents: "none",
            background:
              "radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)",
          }}
        />

        {/* ── Page header ── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#4ade80",
                marginBottom: 4,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <i className="ti ti-plant" aria-hidden="true" /> Gestion du
              contenu
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#f0fdf4",
                lineHeight: 1.2,
              }}
            >
              Domaines d'intervention
            </div>
            <div
              style={{
                fontSize: 12,
                color: "rgba(240,253,244,0.38)",
                marginTop: 3,
              }}
            >
              {loading ? "Chargement…" : `${items.length} domaine(s)`}
            </div>
          </div>
          <button
            onClick={openCreate}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 16px",
              borderRadius: 10,
              background: "linear-gradient(135deg, #16a34a, #15803d)",
              border: "1px solid rgba(74,222,128,0.3)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 3px 12px rgba(22,163,74,0.25)",
              whiteSpace: "nowrap",
            }}
          >
            <i className="ti ti-plus" aria-hidden="true" />
            Nouveau domaine
          </button>
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: "48px 0",
              color: "rgba(240,253,244,0.38)",
              fontSize: 13,
            }}
          >
            <i
              className="ti ti-loader-2"
              style={{ fontSize: 28, display: "block", marginBottom: 10 }}
              aria-hidden="true"
            />
            Chargement des domaines…
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && items.length === 0 && (
          <div
            style={{
              padding: "48px 20px",
              textAlign: "center",
              border: "1.5px dashed rgba(74,222,128,0.2)",
              borderRadius: 14,
              background: "rgba(34,197,94,0.04)",
            }}
          >
            <i
              className="ti ti-plant"
              style={{
                fontSize: 32,
                color: "rgba(74,222,128,0.4)",
                display: "block",
                marginBottom: 10,
              }}
              aria-hidden="true"
            />
            <p style={{ fontSize: 13, color: "rgba(240,253,244,0.38)" }}>
              Aucun domaine pour l'instant.
            </p>
            <button
              onClick={openCreate}
              style={{
                marginTop: 14,
                padding: "8px 18px",
                borderRadius: 10,
                background: "rgba(34,197,94,0.15)",
                border: "1px solid rgba(74,222,128,0.2)",
                color: "#4ade80",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              + Créer le premier domaine
            </button>
          </div>
        )}

        {/* ── Grid ── */}
        {!loading && items.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 12,
            }}
          >
            {items.map((item) => (
              <DomainCard
                key={item._id}
                item={item}
                onEdit={openEdit}
                onDelete={setDeleteItem}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      <DomainModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        editItem={editItem}
        saving={saving}
      />

      {/* ── Confirm delete ── */}
      <ConfirmDelete
        item={deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        deleting={deleting}
      />
    </DashboardLayout>
  );
}
