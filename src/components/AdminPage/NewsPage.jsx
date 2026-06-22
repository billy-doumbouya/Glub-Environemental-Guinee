// src/pages/NewsPage.jsx
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

import { DashboardLayout } from "../../layouts/DashboardLayout";
import { newsService } from "../../../api/services";
import {
  PageHeader,
  Button,
  Input,
  Textarea,
  Select,
  Modal,
  ConfirmDialog,
  Card,
  Badge,
  ImagePreview,
  TogglePublished,
} from "../ui";

const CAT_OPTIONS = [
  { value: "Événement", label: "Événement" },
  { value: "Formation", label: "Formation" },
  { value: "Partenariat", label: "Partenariat" },
  { value: "Publication", label: "Publication" },
  { value: "Autre", label: "Autre" },
];

const EMPTY = {
  title: "",
  excerpt: "",
  content: "",
  date: "",
  category: "Événement",
  author: "Équipe Technique ONG C.E.G",
  tags: "",
  featured: false,
  isPublished: true,
};

export default function NewsPage() {
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
      const res = await newsService.getAll();
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
      title: item.title || "",
      excerpt: item.excerpt || "",
      content: item.content || "",
      date: item.date || "",
      category: item.category || "Autre",
      author: item.author || "",
      tags: Array.isArray(item.tags) ? item.tags.join(", ") : "",
      featured: item.featured || false,
      isPublished: item.isPublished !== false,
    });
    setImagePreview(item.image?.url || null);
    setImageFile(null);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return toast.error("Titre requis");
    if (!form.content.trim()) return toast.error("Contenu requis");
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "tags")
          fd.append(
            k,
            JSON.stringify(
              v
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            ),
          );
        else fd.append(k, v);
      });
      if (imageFile) fd.append("image", imageFile);
      if (editItem) {
        await newsService.update(editItem._id, fd);
        toast.success("Article mis à jour ✅");
      } else {
        await newsService.create(fd);
        toast.success("Article créé ✅");
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
      await newsService.remove(deleteItem._id);
      toast.success("Article supprimé");
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
          title="📰 Actualités"
          subtitle={`${items.length} article(s)`}
          action={<Button onClick={openCreate}>+ Nouvel article</Button>}
        />
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <Card>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #E5E7EB" }}>
                  {[
                    "Image",
                    "Titre",
                    "Catégorie",
                    "Mis en avant",
                    "Publié",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: "13px",
                        color: "#6B7280",
                        fontWeight: "600",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item._id}
                    style={{ borderBottom: "1px solid #F3F4F6" }}
                  >
                    <td style={{ padding: "12px 16px" }}>
                      <ImagePreview src={item.image?.url} size={48} />
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div
                        style={{
                          fontWeight: "600",
                          fontSize: "14px",
                          maxWidth: "250px",
                        }}
                      >
                        {item.title}
                      </div>
                      <div style={{ fontSize: "12px", color: "#6B7280" }}>
                        {item.displayDate || item.date}
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <Badge color="blue">{item.category}</Badge>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <Badge color={item.featured ? "yellow" : "gray"}>
                        {item.featured ? "⭐ Oui" : "Non"}
                      </Badge>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <Badge color={item.isPublished ? "green" : "gray"}>
                        {item.isPublished ? "Oui" : "Non"}
                      </Badge>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}

        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editItem ? "Modifier l'article" : "Nouvel article"}
          size="lg"
        >
          <TogglePublished
            value={form.isPublished}
            onChange={(v) => setForm({ ...form, isPublished: v })}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              id="featured"
            />
            <label
              htmlFor="featured"
              style={{ fontSize: "13px", fontWeight: "600" }}
            >
              ⭐ Mettre en avant sur l'accueil
            </label>
          </div>
          <Input
            label="Titre *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <Textarea
            label="Extrait"
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            rows={2}
          />
          <Textarea
            label="Contenu *"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={6}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <Input
              label="Date (laisser vide = date actuelle)"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              placeholder="Ex: 20 Juillet 2023"
            />
            <Select
              label="Catégorie"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              options={CAT_OPTIONS}
            />
            <Input
              label="Auteur"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
            />
            <Input
              label="Tags (séparés par virgule)"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
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
              Image
            </label>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="preview"
                style={{
                  width: "120px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "8px",
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
              📷 Choisir une image
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
          title="Supprimer l'article"
          message={`Supprimer "${deleteItem?.title}" ?`}
        />
      </div>
    </DashboardLayout>
  );
}
