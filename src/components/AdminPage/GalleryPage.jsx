// src/pages/GalleryPage.jsx
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button, Card, ConfirmDialog, Input, Modal, PageHeader } from "../ui";
import { galleryService } from "../../../api/services";
import { DashboardLayout } from "../../layouts/DashboardLayout";

export default function GalleryPage() {
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [catModal, setCatModal] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [deleteCat, setDeleteCat] = useState(null);
  const [deleteImg, setDeleteImg] = useState(null);
  const [catForm, setCatForm] = useState({
    name: "",
    description: "",
    order: 0,
  });
  const [uploadForm, setUploadForm] = useState({
    category: "",
    caption: "",
    takenAt: "",
  });
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileRef = useRef();

  const loadCategories = async () => {
    try {
      const res = await galleryService.getCategories();
      setCategories(res.data.data || []);
    } catch {
      toast.error("Erreur chargement catégories");
    } finally {
      setLoading(false);
    }
  };

  const loadImages = async (catId) => {
    try {
      const res = await galleryService.getImagesAdmin({ category: catId });
      setImages(res.data.data || []);
    } catch {
      toast.error("Erreur chargement images");
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (activeCategory) loadImages(activeCategory);
    else setImages([]);
  }, [activeCategory]);

  const openCreateCat = () => {
    setEditCat(null);
    setCatForm({ name: "", description: "", order: 0 });
    setCatModal(true);
  };
  
  const openEditCat = (cat) => {
    setEditCat(cat);
    setCatForm({
      name: cat.name,
      description: cat.description || "",
      order: cat.order || 0,
    });
    setCatModal(true);
  };

  const saveCat = async () => {
    if (!catForm.name.trim()) return toast.error("Le nom est requis");
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(catForm).forEach(([k, v]) => fd.append(k, v));
      if (editCat) {
        await galleryService.updateCategory(editCat._id, fd);
        toast.success("Catégorie mise à jour ✅");
      } else {
        await galleryService.createCategory(fd);
        toast.success("Catégorie créée ✅");
      }
      setCatModal(false);
      loadCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCat = async () => {
    setDeleting(true);
    try {
      await galleryService.deleteCategory(deleteCat._id);
      toast.success("Catégorie supprimée");
      setDeleteCat(null);
      loadCategories();
      if (activeCategory === deleteCat._id) setActiveCategory(null);
    } catch {
      toast.error("Erreur suppression");
    } finally {
      setDeleting(false);
    }
  };

  const openUpload = () => {
    setUploadForm({
      category: activeCategory || categories[0]?._id || "",
      caption: "",
      takenAt: "",
    });
    setFiles([]);
    setUploadModal(true);
  };

  const handleUpload = async () => {
    if (!uploadForm.category) return toast.error("Choisissez une catégorie");
    if (files.length === 0) return toast.error("Choisissez au moins une image");
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("category", uploadForm.category);
      fd.append("caption", uploadForm.caption);
      fd.append("takenAt", uploadForm.takenAt);
      files.forEach((f) => fd.append("images", f));
      await galleryService.uploadImages(fd);
      toast.success(`${files.length} image(s) uploadée(s) ✅`);
      setUploadModal(false);
      if (activeCategory === uploadForm.category) loadImages(activeCategory);
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur upload");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteImg = async () => {
    setDeleting(true);
    try {
      await galleryService.deleteImage(deleteImg._id);
      toast.success("Image supprimée");
      setDeleteImg(null);
      if (activeCategory) loadImages(activeCategory);
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
              <i className="ti ti-photo" aria-hidden="true" /> Galerie Photo
            </span>
          }
          subtitle={`${categories.length} catégorie(s)`}
          action={
            <div style={{ display: "flex", gap: "10px" }}>
              <Button variant="secondary" onClick={openCreateCat}>
                <i className="ti ti-plus" style={{ marginRight: "4px" }} aria-hidden="true" /> Catégorie
              </Button>
              <Button onClick={openUpload} disabled={!activeCategory}>
                <i className="ti ti-upload" style={{ marginRight: "4px" }} aria-hidden="true" /> Upload photos
              </Button>
            </div>
          }
        />

        {/* Catégories */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "24px",
          }}
        >
          <button
            onClick={() => setActiveCategory(null)}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              background: !activeCategory ? "#15803D" : "#E5E7EB",
              color: !activeCategory ? "white" : "#374151",
              fontWeight: "600",
              fontSize: "13px",
              transition: "background 0.2s",
            }}
          >
            Toutes
          </button>
          {categories.map((cat) => (
            <div
              key={cat._id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: activeCategory === cat._id ? "#15803D" : "#E5E7EB",
                padding: "4px 12px 4px 4px",
                borderRadius: "20px",
              }}
            >
              <button
                onClick={() => setActiveCategory(cat._id)}
                style={{
                  padding: "4px 6px 4px 12px",
                  border: "none",
                  cursor: "pointer",
                  background: "transparent",
                  color: activeCategory === cat._id ? "white" : "#374151",
                  fontWeight: "600",
                  fontSize: "13px",
                }}
              >
                {cat.name} ({cat.imageCount || 0})
              </button>
              <button
                onClick={() => openEditCat(cat)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: activeCategory === cat._id ? "white" : "#4B5563",
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "2px",
                }}
                title="Modifier"
              >
                <i className="ti ti-edit" aria-hidden="true" />
              </button>
              <button
                onClick={() => setDeleteCat(cat)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: activeCategory === cat._id ? "white" : "#DC2626",
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "2px",
                }}
                title="Supprimer"
              >
                <i className="ti ti-trash" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>

        {/* Grille d'images */}
        {loading ? (
          <p>Chargement...</p>
        ) : activeCategory ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "12px",
            }}
          >
            {images.map((img) => (
              <div
                key={img._id}
                style={{
                  position: "relative",
                  borderRadius: "10px",
                  overflow: "hidden",
                  background: "#F3F4F6",
                  border: "1px solid #E5E7EB",
                }}
              >
                <img
                  src={img.image?.url}
                  alt={img.caption || ""}
                  style={{
                    width: "100%",
                    height: "140px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                {img.caption && (
                  <div
                    style={{
                      padding: "6px 8px",
                      fontSize: "11px",
                      color: "#374151",
                      background: "white",
                    }}
                  >
                    {img.caption}
                  </div>
                )}
                <button
                  onClick={() => setDeleteImg(img)}
                  style={{
                    position: "absolute",
                    top: "6px",
                    right: "6px",
                    background: "rgba(220,38,38,0.9)",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: "4px 6px",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                  title="Supprimer l'image"
                >
                  <i className="ti ti-trash" aria-hidden="true" />
                </button>
              </div>
            ))}
            {images.length === 0 && (
              <p style={{ color: "#6B7280", gridColumn: "1/-1" }}>
                Aucune image dans cette catégorie. Uploadez des photos !
              </p>
            )}
          </div>
        ) : (
          <Card>
            <p style={{ color: "#6B7280", textAlign: "center", margin: "16px 0" }}>
              Sélectionnez une catégorie pour voir ses images
            </p>
          </Card>
        )}

        {/* Modal catégorie */}
        <Modal
          isOpen={catModal}
          onClose={() => setCatModal(false)}
          title={editCat ? "Modifier la catégorie" : "Nouvelle catégorie"}
          size="sm"
        >
          <Input
            label="Nom *"
            value={catForm.name}
            onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
            placeholder="Ex: Projet-Kakossa"
          />
          <Input
            label="Description"
            value={catForm.description}
            onChange={(e) =>
              setCatForm({ ...catForm, description: e.target.value })
            }
          />
          <Input
            label="Ordre"
            type="number"
            value={catForm.order}
            onChange={(e) => setCatForm({ ...catForm, order: e.target.value })}
          />
          <div
            style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "20px" }}
          >
            <Button variant="secondary" onClick={() => setCatModal(false)}>
              Annuler
            </Button>
            <Button onClick={saveCat} loading={saving}>
              <i className="ti ti-device-floppy" style={{ marginRight: "4px" }} aria-hidden="true" /> Sauvegarder
            </Button>
          </div>
        </Modal>

        {/* Modal upload */}
        <Modal
          isOpen={uploadModal}
          onClose={() => setUploadModal(false)}
          title="Uploader des photos"
          size="sm"
        >
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
              Catégorie *
            </label>
            <select
              value={uploadForm.category}
              onChange={(e) =>
                setUploadForm({ ...uploadForm, category: e.target.value })
              }
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #D1D5DB",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
              }}
            >
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Légende (optionnel)"
            value={uploadForm.caption}
            onChange={(e) =>
              setUploadForm({ ...uploadForm, caption: e.target.value })
            }
          />
          <Input
            label="Date de la photo"
            value={uploadForm.takenAt}
            onChange={(e) =>
              setUploadForm({ ...uploadForm, takenAt: e.target.value })
            }
            placeholder="Ex: Juillet 2023"
          />
          <div style={{ marginBottom: "20px" }}>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files))}
              style={{ display: "none" }}
            />
            <Button
              variant="secondary"
              onClick={() => fileRef.current?.click()}
            >
              <i className="ti ti-camera" style={{ marginRight: "4px" }} aria-hidden="true" /> Choisir des images ({files.length} sélectionnée(s))
            </Button>
            {files.length > 0 && (
              <p
                style={{ fontSize: "12px", color: "#15803D", marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}
              >
                <i className="ti ti-check" aria-hidden="true" /> {files.length} image(s) prête(s) à l'upload
              </p>
            )}
          </div>
          <div
            style={{ display: "flex", gap: "12px", justifyContent: "flex-end", borderTop: "1px solid #E5E7EB", paddingTop: "16px" }}
          >
            <Button variant="secondary" onClick={() => setUploadModal(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpload} loading={saving}>
              <i className="ti ti-upload" style={{ marginRight: "4px" }} aria-hidden="true" /> Uploader
            </Button>
          </div>
        </Modal>

        <ConfirmDialog
          isOpen={!!deleteCat}
          onClose={() => setDeleteCat(null)}
          onConfirm={handleDeleteCat}
          loading={deleting}
          title="Supprimer la catégorie"
          message={`Supprimer "${deleteCat?.name}" et toutes ses images ? Action irréversible.`}
        />
        <ConfirmDialog
          isOpen={!!deleteImg}
          onClose={() => setDeleteImg(null)}
          onConfirm={handleDeleteImg}
          loading={deleting}
          title="Supprimer l'image"
          message="Supprimer cette image ? Action irréversible."
        />
      </div>
    </DashboardLayout>
  );
}