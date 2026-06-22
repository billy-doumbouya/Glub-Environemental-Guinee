// src/pages/TestimonialsPage.jsx
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  ImagePreview,
  Input,
  Modal,
  PageHeader,
  Textarea,
  TogglePublished,
} from "../ui";
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
  useEffect(() => {
    load();
  }, []);

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
      <div style={{ padding: "32px" }}>
        <PageHeader
          title="💬 Témoignages"
          subtitle={`${items.length} témoignage(s)`}
          action={<Button onClick={openCreate}>+ Nouveau témoignage</Button>}
        />
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "16px",
            }}
          >
            {items.map((item) => (
              <Card key={item._id}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "12px",
                  }}
                >
                  <ImagePreview src={item.avatar?.url} size={48} />
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "14px" }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: "12px", color: "#6B7280" }}>
                      {item.role}
                    </div>
                    <div style={{ fontSize: "12px", color: "#F59E0B" }}>
                      {"⭐".repeat(item.rating)}
                    </div>
                  </div>
                </div>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#374151",
                    margin: "0 0 12px",
                    lineHeight: 1.5,
                  }}
                >
                  {item.content}
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Badge color={item.isPublished ? "green" : "gray"}>
                    {item.isPublished ? "Publié" : "Masqué"}
                  </Badge>
                  <div style={{ display: "flex", gap: "6px" }}>
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
                </div>
              </Card>
            ))}
          </div>
        )}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editItem ? "Modifier le témoignage" : "Nouveau témoignage"}
          size="md"
        >
          <TogglePublished
            value={form.isPublished}
            onChange={(v) => setForm({ ...form, isPublished: v })}
          />
          <Input
            label="Nom *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Rôle / Fonction"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            placeholder="Agricultrice, Préfecture de Dabola"
          />
          <Textarea
            label="Témoignage *"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={4}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  marginBottom: "6px",
                }}
              >
                Note
              </label>
              <select
                value={form.rating}
                onChange={(e) =>
                  setForm({ ...form, rating: Number(e.target.value) })
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                }}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {"⭐".repeat(n)} ({n}/5)
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Ordre"
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: e.target.value })}
            />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Photo (optionnel)
            </label>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="preview"
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginBottom: "8px",
                }}
              />
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files[0];
                if (f) {
                  setImageFile(f);
                  setImagePreview(URL.createObjectURL(f));
                }
              }}
              style={{ display: "none" }}
            />
            <Button
              size="sm"
              variant="secondary"
              onClick={() => fileRef.current?.click()}
            >
              📷 Choisir une photo
            </Button>
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
          title="Supprimer le témoignage"
          message={`Supprimer le témoignage de "${deleteItem?.name}" ?`}
        />
      </div>
    </DashboardLayout>
  );
}
