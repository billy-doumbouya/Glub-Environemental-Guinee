// src/pages/TestimonialsPage.jsx
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { testimonialsService } from "../../../api/services";
import { DashboardLayout } from "../../layouts/DashboardLayout";

const EMPTY = {
  name: "",
  role: "",
  content: "",
  rating: 5,
  order: 0,
  isPublished: true,
};

// ── Sous-composants d'interface ────────────────────────────────────

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

function GlassTextarea({ label, value, onChange, placeholder, rows = 3 }) {
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
      <textarea
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "10px 12px",
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 10, color: "#f0fdf4",
          fontSize: 13, fontFamily: "inherit",
          outline: "none", resize: "vertical",
          boxSizing: "border-box",
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
        Publié sur le site
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

function Avatar({ src, name, size = 44 }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{
          width: size, height: size, borderRadius: "50%",
          objectFit: "cover", border: "1px solid rgba(0,0,0,0.08)",
          background: "#f3f4f6", flexShrink: 0,
        }}
      />
    );
  }
  const initials = name ? name.substring(0, 2).toUpperCase() : "?";
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
      color: "#166534", fontSize: size * 0.35, fontWeight: 700,
      display: "flex", alignItems: "center", justifyContent: "center",
      border: "1px solid rgba(22,101,52,0.1)", flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

// ── Carte de témoignage ─────────────────────────────────────────────
function TestimonialCard({ item, onEdit, onDelete }) {
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
      <div style={{ padding: 16 }}>
        {/* Profile Info */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <Avatar src={item.avatar?.url} name={item.name} size={44} />
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {item.name}
            </div>
            <div style={{ fontSize: 12, color: "#6b7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {item.role || "Donateur / Partenaire"}
            </div>
            <div style={{ fontSize: 11, color: "#f59e0b", marginTop: 1, letterSpacing: -1 }}>
              {"★".repeat(item.rating || 5)}
              <span style={{ color: "#e5e7eb" }}>{"★".repeat(5 - (item.rating || 5))}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <p style={{
          fontSize: 13, color: "#4b5563", lineHeight: 1.55, margin: 0,
          fontStyle: "italic", position: "relative",
        }}>
          "{item.content}"
        </p>
      </div>

      {/* Footer controls */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 16px 12px", borderTop: "1px solid #f9fafb", background: "#fbfbfe",
      }}>
        <span style={{
          fontSize: 10, padding: "3px 8px", borderRadius: 20, fontWeight: 600,
          background: item.isPublished ? "#dcfce7" : "#f3f4f6",
          color:      item.isPublished ? "#15803d" : "#6b7280",
        }}>
          {item.isPublished ? "Publié" : "Masqué"}
        </span>

        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => onEdit(item)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              padding: "5px 10px", borderRadius: 8,
              background: "#fff", border: "1px solid #e5e7eb",
              color: "#374151", fontSize: 12, fontWeight: 500, cursor: "pointer",
            }}
          >
            <i className="ti ti-edit" aria-hidden="true" />
          </button>
          <button
            onClick={() => onDelete(item)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              padding: "5px 9px", borderRadius: 8,
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
function TestimonialModal({ isOpen, onClose, onSave, editItem, saving, form, setForm, imagePreview, setImagePreview, setImageFile, fileRef }) {
  useEffect(() => {
    if (!isOpen && !editItem) {
      setForm(EMPTY);
      setImagePreview(null);
      setImageFile(null);
    }
  }, [isOpen, editItem]);

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
          width: "100%", maxWidth: 480,
          background: "linear-gradient(165deg, #0d3d22 0%, #0f4c2a 100%)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "22px 22px 0 0",
          padding: "16px 20px 32px",
          maxHeight: "90vh", overflowY: "auto",
          boxShadow: "0 -8px 48px rgba(0,0,0,0.4)",
        }}
      >
        {/* Handle mobile */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)", margin: "0 auto 16px" }} />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#f0fdf4" }}>
            {editItem ? "Modifier le témoignage" : "Nouveau témoignage"}
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

        {/* Avatar Upload Preview Section */}
        <div style={{
          display: "flex", alignItems: "center", gap: 14,
          padding: 12, borderRadius: 12, background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)", marginBottom: 16,
        }}>
          <div style={{ position: "relative" }}>
            <Avatar src={imagePreview} name={form.name} size={54} />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              style={{
                position: "absolute", bottom: -2, right: -2,
                width: 22, height: 22, borderRadius: "50%",
                background: "#16a34a", border: "2px solid #0d3d22",
                color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", fontSize: 11,
              }}
            >
              <i className="ti ti-camera" aria-hidden="true" />
            </button>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#f0fdf4", marginBottom: 2 }}>Photo de profil</div>
            <div style={{ fontSize: 11, color: "rgba(240,253,244,0.38)" }}>Format carré recommandé (JPG, PNG)</div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const f = e.target.files[0];
                if (f) {
                  setImageFile(f);
                  setImagePreview(URL.createObjectURL(f));
                }
              }}
            />
          </div>
        </div>

        <GlassInput label="Nom complet *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: Fatoumata Camara" />
        <GlassInput label="Rôle / Fonction" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Ex: Bénéficiaire, Cooperative de Kankan" />
        <GlassTextarea label="Témoignage *" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Saisir l'avis ou l'impact partagé..." rows={4} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ marginBottom: 12 }}>
            <label style={{
              display: "block", fontSize: 11, fontWeight: 600,
              letterSpacing: "0.06em", textTransform: "uppercase",
              color: "rgba(240,253,244,0.38)", marginBottom: 5,
            }}>
              Note / Évaluation
            </label>
            <select
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
              style={{
                width: "100%", padding: "10px 12px",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10, color: "#f0fdf4",
                fontSize: 13, fontFamily: "inherit", outline: "none",
              }}
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n} style={{ background: "#0f4c2a", color: "#f0fdf4" }}>
                  {"★".repeat(n)} ({n}/5)
                </option>
              ))}
            </select>
          </div>
          <GlassInput label="Ordre d'affichage" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: 4 }}>
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
            {saving ? (
              <>
                <span style={{
                  width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "#fff", borderRadius: "50%", display: "inline-block",
                  animation: "spin 0.7s linear infinite",
                }} />
                Enregistrement…
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
          Supprimer le témoignage
        </div>
        <div style={{ fontSize: 12, color: "rgba(240,253,244,0.38)", marginBottom: 18, lineHeight: 1.5 }}>
          Supprimer définitivement l'avis de <strong style={{ color: "#f0fdf4" }}>{item.name}</strong> ?
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
export default function TestimonialsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileRef = useRef();

  const load = async () => {
    try {
      const res = await testimonialsService.getAll();
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
    setImageFile(null);
    setImagePreview(null);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      name: item.name || "",
      role: item.role || "",
      content: item.content || "",
      rating: item.rating || 5,
      order: item.order || 0,
      isPublished: item.isPublished !== false,
    });
    setImagePreview(item.avatar?.url || null);
    setImageFile(null);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.content.trim())
      return toast.error("Nom et témoignage requis");
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append("avatar", imageFile);

      if (editItem) {
        await testimonialsService.update(editItem._id, fd);
        toast.success("Témoignage mis à jour ✅");
      } else {
        await testimonialsService.create(fd);
        toast.success("Témoignage créé ✅");
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
      await testimonialsService.remove(deleteItem._id);
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
      <div style={{
        minHeight: "100%",
        background: "linear-gradient(145deg, #0a2e1a 0%, #0d3d22 55%, #0f4c2a 100%)",
        padding: "20px 16px 32px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        position: "relative",
      }}>
        
        {/* Lueur ambiante */}
        <div style={{
          position: "absolute", top: -80, right: -40, width: 250, height: 250,
          borderRadius: "50%", pointerEvents: "none",
          background: "radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 72%)",
        }} />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#4ade80", marginBottom: 4, display: "flex", alignItems: "center", gap: 5 }}>
              <i className="ti ti-messages" aria-hidden="true" /> Retours & Avis
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#f0fdf4", lineHeight: 1.2 }}>
              Témoignages
            </div>
            <div style={{ fontSize: 12, color: "rgba(240,253,244,0.38)", marginTop: 3 }}>
              {loading ? "Chargement…" : `${items.length} témoignage(s) enregistré(s)`}
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
            Nouveau témoignage
          </button>
        </div>

        {/* Loader */}
        {loading && (
          <div style={{ textAlign: "center", padding: "48px 0", color: "rgba(240,253,244,0.38)", fontSize: 13 }}>
            <i className="ti ti-loader-2" style={{ fontSize: 26, display: "block", marginBottom: 10, animation: "spin 1s linear infinite" }} aria-hidden="true" />
            Chargement des retours…
          </div>
        )}

        {/* Empty state */}
        {!loading && items.length === 0 && (
          <div style={{ padding: "48px 20px", textAlign: "center", border: "1.5px dashed rgba(74,222,128,0.18)", borderRadius: 14, background: "rgba(34,197,94,0.03)" }}>
            <i className="ti ti-message-dots" style={{ fontSize: 30, color: "rgba(74,222,128,0.35)", display: "block", marginBottom: 8 }} aria-hidden="true" />
            <p style={{ fontSize: 13, color: "rgba(240,253,244,0.38)", margin: 0 }}>Aucun témoignage disponible pour le moment.</p>
            <button
              onClick={openCreate}
              style={{ marginTop: 12, padding: "7px 16px", borderRadius: 10, background: "rgba(34,197,94,0.15)", border: "1px solid rgba(74,222,128,0.2)", color: "#4ade80", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
            >
              Ajouter un témoignage
            </button>
          </div>
        )}

        {/* Grid Render */}
        {!loading && items.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
            gap: "16px",
          }}>
            {items.map((item) => (
              <TestimonialCard
                key={item._id}
                item={item}
                onEdit={openEdit}
                onDelete={setDeleteItem}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modale d'ajout/modification */}
      <TestimonialModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        editItem={editItem}
        saving={saving}
        form={form}
        setForm={setForm}
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        setImageFile={setImageFile}
        fileRef={fileRef}
      />

      {/* Alerte Confirmation */}
      <ConfirmDelete
        item={deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        deleting={deleting}
      />
    </DashboardLayout>
  );
}