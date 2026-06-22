// src/pages/StatisticsPage.jsx
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Button,
  Card,
  ConfirmDialog,
  Input,
  Modal,
  PageHeader,
  Select,
  TogglePublished,
} from "../ui";
import { statisticsService } from "../../../api/services";
import { DashboardLayout } from "../../layouts/DashboardLayout";

const ICON_OPTIONS = [
  "calendar",
  "folder",
  "users",
  "map",
  "globe",
  "heart",
  "chart",
  "star",
  "flag",
].map((v) => ({ value: v, label: v }));
const EMPTY = {
  label: "",
  value: 0,
  suffix: "",
  icon: "chart",
  order: 0,
  isPublished: true,
};

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
      const res = await statisticsService.getAll();
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
      label: item.label,
      value: item.value,
      suffix: item.suffix || "",
      icon: item.icon || "chart",
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
      <div style={{ padding: "32px" }}>
        <PageHeader
          title="📊 Statistiques"
          subtitle="Chiffres clés affichés sur le site"
          action={<Button onClick={openCreate}>+ Nouvelle statistique</Button>}
        />
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "16px",
            }}
          >
            {items.map((item) => (
              <Card
                key={item._id}
                style={{ textAlign: "center", position: "relative" }}
              >
                <div style={{ fontSize: "32px", marginBottom: "6px" }}>
                  {item.icon}
                </div>
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    color: "#15803D",
                  }}
                >
                  {item.value}
                  {item.suffix}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#6B7280",
                    marginBottom: "12px",
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEdit(item)}
                  >
                    ✏️
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
          title={editItem ? "Modifier la statistique" : "Nouvelle statistique"}
          size="sm"
        >
          <TogglePublished
            value={form.isPublished}
            onChange={(v) => setForm({ ...form, isPublished: v })}
          />
          <Input
            label="Label *"
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            placeholder="Bénéficiaires"
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <Input
              label="Valeur *"
              type="number"
              value={form.value}
              onChange={(e) =>
                setForm({ ...form, value: Number(e.target.value) })
              }
            />
            <Input
              label="Suffixe"
              value={form.suffix}
              onChange={(e) => setForm({ ...form, suffix: e.target.value })}
              placeholder="+ ou %"
            />
            <Select
              label="Icône"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              options={ICON_OPTIONS}
            />
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
          title="Supprimer la statistique"
          message={`Supprimer "${deleteItem?.label}" ?`}
        />
      </div>
    </DashboardLayout>
  );
}
