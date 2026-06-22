// src/pages/PartnersPage.jsx
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
import { partnersService } from "../../../api/services";
import { DashboardLayout } from "../../layouts/DashboardLayout";

const EMPTY = {
  name: "",
  fullName: "",
  logoText: "",
  logoColor: "#000000",
  category: "",
  description: "",
  website: "",
  partnership: "",
  since: "",
  domains: "",
  order: 0,
  isPublished: true,
};

export default function PartnersPage() {
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
      const res = await partnersService.getAll();
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
      fullName: item.fullName || "",
      logoText: item.logoText || "",
      logoColor: item.logoColor || "#000000",
      category: item.category || "",
      description: item.description || "",
      website: item.website || "",
      partnership: item.partnership || "",
      since: item.since || "",
      domains: Array.isArray(item.domains) ? item.domains.join(", ") : "",
      order: item.order || 0,
      isPublished: item.isPublished !== false,
    });
    setImagePreview(item.logo?.url || null);
    setImageFile(null);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error("Nom requis");
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "domains")
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
      if (imageFile) fd.append("logo", imageFile);
      if (editItem) {
        await partnersService.update(editItem._id, fd);
        toast.success("Partenaire mis à jour ✅");
      } else {
        await partnersService.create(fd);
        toast.success("Partenaire créé ✅");
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
      await partnersService.remove(deleteItem._id);
      toast.success("Partenaire supprimé");
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
          title="🤝 Partenaires"
          subtitle={`${items.length} partenaire(s)`}
          action={<Button onClick={openCreate}>+ Nouveau partenaire</Button>}
        />
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <Card>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #E5E7EB" }}>
                  {[
                    "Logo",
                    "Nom",
                    "Catégorie",
                    "Depuis",
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
                      <ImagePreview src={item.logo?.url} size={48} />
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ fontWeight: "600", fontSize: "14px" }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "#6B7280" }}>
                        {item.fullName}
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "13px" }}>
                      {item.category || "—"}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "13px" }}>
                      {item.since || "—"}
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
          title={editItem ? "Modifier le partenaire" : "Nouveau partenaire"}
          size="lg"
        >
          <TogglePublished
            value={form.isPublished}
            onChange={(v) => setForm({ ...form, isPublished: v })}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <Input
              label="Nom court *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="GEF"
            />
            <Input
              label="Nom complet"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
            <Input
              label="Catégorie"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <Input
              label="Partenariat depuis"
              value={form.since}
              onChange={(e) => setForm({ ...form, since: e.target.value })}
              placeholder="2019"
            />
            <Input
              label="Site web"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              placeholder="https://..."
            />
            <Input
              label="Type de partenariat"
              value={form.partnership}
              onChange={(e) =>
                setForm({ ...form, partnership: e.target.value })
              }
            />
          </div>
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
          />
          <Input
            label="Domaines (séparés par virgule)"
            value={form.domains}
            onChange={(e) => setForm({ ...form, domains: e.target.value })}
          />
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Logo
            </label>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="preview"
                style={{
                  height: "60px",
                  objectFit: "contain",
                  marginBottom: "8px",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  padding: "4px",
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
              📷 Choisir un logo
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
          title="Supprimer le partenaire"
          message={`Supprimer "${deleteItem?.name}" ?`}
        />
      </div>
    </DashboardLayout>
  );
}
