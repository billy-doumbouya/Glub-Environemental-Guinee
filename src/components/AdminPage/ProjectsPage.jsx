// src/pages/ProjectsPage.jsx
// Gestion complète des projets — liste, création, édition, suppression

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { projectsService } from "../../../api/services";
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  ImagePreview,
  Input,
  Modal,
  PageHeader,
  Select,
  Textarea,
  TogglePublished,
} from "../ui";
import { DashboardLayout } from "../../layouts/DashboardLayout";

const STATUS_OPTIONS = [
  { value: "ongoing", label: "En cours" },
  { value: "completed", label: "Terminé" },
  { value: "planned", label: "Planifié" },
];

const STATUS_COLORS = {
  ongoing: "blue",
  completed: "green",
  planned: "yellow",
};
const STATUS_LABELS = {
  ongoing: "En cours",
  completed: "Terminé",
  planned: "Planifié",
};

const EMPTY_FORM = {
  title: "",
  description: "",
  date: "",
  location: "",
  category: "",
  status: "ongoing",
  funder: "",
  budget: "",
  objectives: "",
  results: "",
  tags: "",
  order: 0,
  isPublished: true,
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileRef = useRef();

  const load = async () => {
    try {
      const res = await projectsService.getAll();
      setProjects(res.data.data || []);
    } catch {
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview(null);
    setModalOpen(true);
  };

  const openEdit = (project) => {
    setEditItem(project);
    setForm({
      title: project.title || "",
      description: project.description || "",
      date: project.date || "",
      location: project.location || "",
      category: project.category || "",
      status: project.status || "ongoing",
      funder: project.funder || "",
      budget: project.budget || "",
      objectives: Array.isArray(project.objectives)
        ? project.objectives.join("\n")
        : "",
      results: Array.isArray(project.results) ? project.results.join("\n") : "",
      tags: Array.isArray(project.tags) ? project.tags.join(", ") : "",
      order: project.order || 0,
      isPublished: project.isPublished !== false,
    });
    setImagePreview(project.image?.url || null);
    setImageFile(null);
    setModalOpen(true);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!form.title.trim()) return toast.error("Le titre est requis");
    if (!form.description.trim())
      return toast.error("La description est requise");

    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "objectives" || k === "results") {
          const arr = v
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean);
          fd.append(k, JSON.stringify(arr));
        } else if (k === "tags") {
          const arr = v
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
          fd.append(k, JSON.stringify(arr));
        } else {
          fd.append(k, v);
        }
      });
      if (imageFile) fd.append("image", imageFile);

      if (editItem) {
        await projectsService.update(editItem._id, fd);
        toast.success("Projet mis à jour ✅");
      } else {
        await projectsService.create(fd);
        toast.success("Projet créé ✅");
      }

      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Erreur lors de la sauvegarde",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await projectsService.remove(deleteItem._id);
      toast.success("Projet supprimé");
      setDeleteItem(null);
      load();
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ padding: "32px" }}>
        <PageHeader
          title="📋 Projets"
          subtitle={` ${projects.length ?? 0} projet(s) au total`}
          action={<Button onClick={openCreate}>+ Nouveau projet</Button>}
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
                    "Statut",
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
                {(projects || []).map((p) => (
                  <tr key={p._id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <ImagePreview src={p.image?.url} size={48} />
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div
                        style={{
                          fontWeight: "600",
                          fontSize: "14px",
                          color: "#111827",
                          maxWidth: "280px",
                        }}
                      >
                        {p.title}
                      </div>
                      <div style={{ fontSize: "12px", color: "#6B7280" }}>
                        {p.location}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: "13px",
                        color: "#374151",
                      }}
                    >
                      {p.category || "—"}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <Badge color={STATUS_COLORS[p.status]}>
                        {STATUS_LABELS[p.status]}
                      </Badge>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <Badge color={p.isPublished ? "green" : "gray"}>
                        {p.isPublished ? "Oui" : "Non"}
                      </Badge>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEdit(p)}
                        >
                          ✏️ Éditer
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => setDeleteItem(p)}
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

        {/* Modal création/édition */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editItem ? "Modifier le projet" : "Nouveau projet"}
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
            placeholder="Titre du projet"
          />
          <Textarea
            label="Description *"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <Input
              label="Date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              placeholder="Ex: Du 15 Juin 2021 au 30 Nov 2022"
            />
            <Input
              label="Lieu"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Préfecture de..."
            />
            <Input
              label="Catégorie"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <Select
              label="Statut"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              options={STATUS_OPTIONS}
            />
            <Input
              label="Bailleur"
              value={form.funder}
              onChange={(e) => setForm({ ...form, funder: e.target.value })}
              placeholder="SGP/FEM/PNUD..."
            />
            <Input
              label="Budget"
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
              placeholder="Ex: 30 000 USD"
            />
          </div>
          <Textarea
            label="Objectifs (un par ligne)"
            value={form.objectives}
            onChange={(e) => setForm({ ...form, objectives: e.target.value })}
            rows={4}
            placeholder="Objectif 1&#10;Objectif 2"
          />
          <Textarea
            label="Résultats (un par ligne)"
            value={form.results}
            onChange={(e) => setForm({ ...form, results: e.target.value })}
            rows={4}
            placeholder="Résultat 1&#10;Résultat 2"
          />
          <Input
            label="Tags (séparés par virgule)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder="Reboisement, Forêt, Communauté"
          />
          <Input
            label="Ordre d'affichage"
            type="number"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: e.target.value })}
          />

          {/* Upload image */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                marginBottom: "8px",
                color: "#374151",
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
              onChange={handleImage}
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

        {/* Confirm delete */}
        <ConfirmDialog
          isOpen={!!deleteItem}
          onClose={() => setDeleteItem(null)}
          onConfirm={handleDelete}
          loading={deleting}
          title="Supprimer le projet"
          message={`Êtes-vous sûr de vouloir supprimer "${deleteItem?.title}" ? Cette action est irréversible.`}
        />
      </div>
    </DashboardLayout>
  );
}
