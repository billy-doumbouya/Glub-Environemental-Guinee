// src/pages/DomainsPage.jsx
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  Input,
  Modal,
  PageHeader,
  Textarea,
  TogglePublished,
} from "../ui";
import { domainsService } from "../../../api/services";
import { DashboardLayout } from "../../layouts/DashboardLayout";

const EMPTY = {
  title: "",
  shortTitle: "",
  icon: "leaf",
  color: "#15803D",
  bgColor: "#F0FDF4",
  description: "",
  activities: "",
  impact: "",
  order: 0,
  isPublished: true,
};

export default function DomainsPage() {
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
    setForm(EMPTY);
    setModalOpen(true);
  };
  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      title: item.title || "",
      shortTitle: item.shortTitle || "",
      icon: item.icon || "leaf",
      color: item.color || "#15803D",
      bgColor: item.bgColor || "#F0FDF4",
      description: item.description || "",
      activities: Array.isArray(item.activities)
        ? item.activities.join("\n")
        : "",
      impact: item.impact || "",
      order: item.order || 0,
      isPublished: item.isPublished !== false,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
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
      <div style={{ padding: "32px" }}>
        <PageHeader
          title="🌿 Domaines d'intervention"
          subtitle={`${items.length} domaine(s)`}
          action={<Button onClick={openCreate}>+ Nouveau domaine</Button>}
        />
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "16px",
            }}
          >
            {items.map((item) => (
              <Card
                key={item._id}
                style={{ borderLeft: `4px solid ${item.color}` }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "8px",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "700",
                      fontSize: "15px",
                      color: item.color,
                    }}
                  >
                    {item.title}
                  </div>
                  <Badge color={item.isPublished ? "green" : "gray"}>
                    {item.isPublished ? "Publié" : "Masqué"}
                  </Badge>
                </div>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#6B7280",
                    margin: "0 0 12px",
                    lineHeight: 1.5,
                  }}
                >
                  {item.description?.substring(0, 100)}...
                </p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEdit(item)}
                  >
                    ✏️ Éditer
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => setDeleteItem(item)}
                  >
                    🗑️
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editItem ? "Modifier le domaine" : "Nouveau domaine"}
          size="lg"
        >
          <TogglePublished
            value={form.isPublished}
            onChange={(v) => setForm({ ...form, isPublished: v })}
          />
          <Input
            label="Titre *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <Input
            label="Titre court"
            value={form.shortTitle}
            onChange={(e) => setForm({ ...form, shortTitle: e.target.value })}
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
          />
          <Textarea
            label="Activités (une par ligne)"
            value={form.activities}
            onChange={(e) => setForm({ ...form, activities: e.target.value })}
            rows={5}
          />
          <Input
            label="Impact"
            value={form.impact}
            onChange={(e) => setForm({ ...form, impact: e.target.value })}
            placeholder="Des milliers d'hectares protégés..."
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "16px",
            }}
          >
            <Input
              label="Icône"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              placeholder="leaf"
            />
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  marginBottom: "6px",
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
                  height: "42px",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              />
            </div>
            <Input
              label="Ordre"
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: e.target.value })}
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
              paddingTop: "16px",
              borderTop: "1px solid #E5E7EB",
            }}
          >
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave} loading={saving}>
              💾 Sauvegarder
            </Button>
          </div>
        </Modal>
        <ConfirmDialog
          isOpen={!!deleteItem}
          onClose={() => setDeleteItem(null)}
          onConfirm={handleDelete}
          loading={deleting}
          title="Supprimer le domaine"
          message={`Supprimer "${deleteItem?.title}" ?`}
        />
      </div>
    </DashboardLayout>
  );
}
