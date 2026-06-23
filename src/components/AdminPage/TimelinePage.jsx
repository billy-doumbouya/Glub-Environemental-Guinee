// src/pages/TimelinePage.jsx
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import {
  Button,
  Input,
  Textarea,
  Modal,
  ConfirmDialog,
  PageHeader,
  Card,
  Badge,
  TogglePublished,
} from "../components/ui/index";
import { timelineService } from "../api/services";

const EMPTY = {
  year: "",
  title: "",
  description: "",
  icon: "calendar",
  color: "#15803D",
  order: 0,
  isPublished: true,
};

export default function TimelinePage() {
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
      const res = await timelineService.getAll();
      setItems(res.data.data || []);
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
    setForm(EMPTY);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      year: item.year || "",
      title: item.title || "",
      description: item.description || "",
      icon: item.icon || "calendar",
      color: item.color || "#15803D",
      order: item.order || 0,
      isPublished: item.isPublished !== false,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.year.trim() || !form.title.trim())
      return toast.error("Année et titre requis");
    setSaving(true);
    try {
      if (editItem) {
        await timelineService.update(editItem._id, form);
        toast.success("Événement mis à jour ✅");
      } else {
        await timelineService.create(form);
        toast.success("Événement créé ✅");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await timelineService.remove(deleteItem._id);
      toast.success("Événement supprimé");
      setDeleteItem(null);
      load();
    } catch {
      toast.error("Erreur suppression");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ padding: "32px" }}>
        <PageHeader
          title={
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <i className="ti ti-calendar" aria-hidden="true" /> Timeline
            </span>
          }
          subtitle="Historique de l'ONG C.E.G"
          action={
            <Button onClick={openCreate}>
              <i className="ti ti-plus" style={{ marginRight: "4px" }} aria-hidden="true" /> Nouvel événement
            </Button>
          }
        />

        {loading ? (
          <p>Chargement...</p>
        ) : (
          <div style={{ position: "relative", marginTop: "24px" }}>
            {/* Ligne centrale */}
            <div
              style={{
                position: "absolute",
                left: "28px",
                top: 0,
                bottom: 0,
                width: "2px",
                background: "#E5E7EB",
              }}
            />
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {items.map((item) => (
                <div
                  key={item._id}
                  style={{
                    display: "flex",
                    gap: "20px",
                    alignItems: "flex-start",
                  }}
                >
                  {/* Dot container */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                      zIndex: 1,
                    }}
                  >
                    <div
                      style={{
                        width: "58px",
                        height: "58px",
                        borderRadius: "50%",
                        background: item.color,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        color: "white",
                        fontWeight: "700",
                        fontSize: "13px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      {item.icon && (
                        <i 
                          className={`ti ti-${item.icon}`} 
                          style={{ fontSize: "14px", marginBottom: "2px" }} 
                          aria-hidden="true" 
                        />
                      )}
                      <span>{item.year}</span>
                    </div>
                  </div>

                  <Card style={{ flex: 1, padding: "16px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "16px",
                        marginBottom: "6px",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "700",
                          fontSize: "15px",
                          color: "#111827",
                        }}
                      >
                        {item.title}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          alignItems: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Badge color={item.isPublished ? "green" : "gray"}>
                          {item.isPublished ? "Publié" : "Masqué"}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEdit(item)}
                          title="Modifier"
                        >
                          <i className="ti ti-edit" aria-hidden="true" />
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => setDeleteItem(item)}
                          title="Supprimer"
                        >
                          <i className="ti ti-trash" aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#6B7280",
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      {item.description}
                    </p>
                  </Card>
                </div>
              ))}
              {items.length === 0 && (
                <p style={{ color: "#6B7280", marginLeft: "80px" }}>
                  Aucun événement dans la timeline pour le moment.
                </p>
              )}
            </div>
          </div>
        )}

        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editItem ? "Modifier l'événement" : "Nouvel événement"}
          size="md"
        >
          <div style={{ marginBottom: "16px" }}>
            <TogglePublished
              value={form.isPublished}
              onChange={(v) => setForm({ ...form, isPublished: v })}
            />
          </div>
          
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <Input
              label="Année *"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              placeholder="Ex: 2016"
            />
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  marginBottom: "6px",
                  color: "#374151",
                }}
              >
                Couleur
              </label>
              <input
                type="color"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                style={{
                  width: "100%",
                  height: "40px",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  cursor: "pointer",
                  padding: "2px 4px",
                  background: "white"
                }}
              />
            </div>
          </div>

          <Input
            label="Titre *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Ex: Création de l'association"
          />

          <Textarea
            label="Description *"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            placeholder="Détails de l'événement marquant..."
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "16px"
            }}
          >
            <Input
              label="Icône (Tabler name)"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              placeholder="Ex: flag, award, star, user..."
            />
            <Input
              label="Ordre d'affichage"
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
              paddingTop: "16px",
              borderTop: "1px solid #E5E7EB",
              marginTop: "24px"
            }}
          >
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave} loading={saving}>
              <i className="ti ti-device-floppy" style={{ marginRight: "4px" }} aria-hidden="true" /> Sauvegarder
            </Button>
          </div>
        </Modal>

        <ConfirmDialog
          isOpen={!!deleteItem}
          onClose={() => setDeleteItem(null)}
          onConfirm={handleDelete}
          loading={deleting}
          title="Supprimer l'événement"
          message={`Supprimer définitivement l'événement "${deleteItem?.title}" (${deleteItem?.year}) ? Cette action est irréversible.`}
        />
      </div>
    </DashboardLayout>
  );
}