// src/components/AdminPage/PartnersPage.jsx
// Gestion complète des partenaires — liste, création, édition, suppression

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { partnersService } from "../../../api/services";
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  DashboardLoadingScreen,
  ImagePreview,
  Input,
  Modal,
  PageHeader,
  Textarea,
  TogglePublished,
} from "../ui";
import { DashboardLayout } from "../../layouts/DashboardLayout";

const EMPTY_FORM = {
  name: "",
  fullName: "",
  logoText: "",
  logoColor: "#15803D",
  category: "",
  description: "",
  website: "",
  partnership: "",
  domains: "",
  since: "",
  order: 0,
  isPublished: true,
};

export default function PartnersPage() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const fileRef = useRef();

  const load = async () => {
    try {
      const res = await partnersService.getAllAdmin();
      setPartners(res.data.data || []);
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
    setLogoFile(null);
    setLogoPreview(null);
    setModalOpen(true);
  };

  const openEdit = (partner) => {
    setEditItem(partner);
    setForm({
      name: partner.name || "",
      fullName: partner.fullName || "",
      logoText: partner.logoText || "",
      logoColor: partner.logoColor || "#15803D",
      category: partner.category || "",
      description: partner.description || "",
      website: partner.website || "",
      partnership: partner.partnership || "",
      domains: Array.isArray(partner.domains) ? partner.domains.join(", ") : "",
      since: partner.since || "",
      order: partner.order || 0,
      isPublished: partner.isPublished !== false,
    });
    setLogoPreview(partner.logo?.url || null);
    setLogoFile(null);
    setModalOpen(true);
  };

  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error("Le nom est requis");

    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "domains") {
          const arr = v
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
          fd.append(k, JSON.stringify(arr));
        } else {
          fd.append(k, v);
        }
      });
      if (logoFile) fd.append("logo", logoFile);

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
      await partnersService.remove(deleteItem._id);
      toast.success("Partenaire supprimé");
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
          title={
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <i className="ti ti-handshake" aria-hidden="true" /> Partenaires
            </span>
          }
          subtitle={`${partners.length ?? 0} partenaire(s) au total`}
          action={
            <Button onClick={openCreate}>
              <i
                className="ti ti-plus"
                style={{ marginRight: "4px" }}
                aria-hidden="true"
              />{" "}
              Nouveau partenaire
            </Button>
          }
        />

        {loading ? (
          <DashboardLoadingScreen />
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
                {(partners || []).map((p) => (
                  <tr key={p._id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <ImagePreview src={p.logo?.url} size={48} />
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
                        {p.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "#6B7280" }}>
                        {p.fullName}
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
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: "13px",
                        color: "#374151",
                      }}
                    >
                      {p.since || "—"}
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
                          <i
                            className="ti ti-edit"
                            style={{ marginRight: "4px" }}
                            aria-hidden="true"
                          />{" "}
                          Éditer
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => setDeleteItem(p)}
                        >
                          <i className="ti ti-trash" aria-hidden="true" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {partners.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        padding: "24px 16px",
                        textAlign: "center",
                        color: "#6B7280",
                      }}
                    >
                      Aucun partenaire pour le moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        )}

        {/* Modal création/édition */}
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
          <Input
            label="Nom *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ex: PNUD"
          />
          <Input
            label="Nom complet"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            placeholder="Ex: Programme des Nations Unies pour le Développement"
          />
          <Textarea
            label="Description"
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
              label="Catégorie"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Ex: Bailleur international"
            />
            <Input
              label="Type de partenariat"
              value={form.partnership}
              onChange={(e) =>
                setForm({ ...form, partnership: e.target.value })
              }
              placeholder="Ex: Financier et technique"
            />
            <Input
              label="Partenaire depuis"
              value={form.since}
              onChange={(e) => setForm({ ...form, since: e.target.value })}
              placeholder="Ex: 2019"
            />
            <Input
              label="Site web"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              placeholder="https://..."
            />
            <Input
              label="Texte logo (si pas d'image)"
              value={form.logoText}
              onChange={(e) => setForm({ ...form, logoText: e.target.value })}
              placeholder="Ex: PNUD"
            />
            <Input
              label="Couleur"
              type="color"
              value={form.logoColor}
              onChange={(e) => setForm({ ...form, logoColor: e.target.value })}
            />
          </div>
          <Input
            label="Domaines d'intervention (séparés par virgule)"
            value={form.domains}
            onChange={(e) => setForm({ ...form, domains: e.target.value })}
            placeholder="Environnement, Gouvernance, Développement"
          />
          <Input
            label="Ordre d'affichage"
            type="number"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: e.target.value })}
          />

          {/* Upload logo */}
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
              Logo
            </label>
            {logoPreview && (
              <img
                src={logoPreview}
                alt="preview"
                style={{
                  width: "100px",
                  height: "70px",
                  objectFit: "contain",
                  borderRadius: "8px",
                  marginBottom: "8px",
                  border: "1px solid #E5E7EB",
                  background: "#F9FAFB",
                }}
              />
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleLogo}
              style={{ display: "none" }}
            />
            <Button
              size="sm"
              variant="secondary"
              onClick={() => fileRef.current?.click()}
            >
              <i
                className="ti ti-camera"
                style={{ marginRight: "4px" }}
                aria-hidden="true"
              />{" "}
              Choisir un logo
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
              <i
                className="ti ti-device-floppy"
                style={{ marginRight: "4px" }}
                aria-hidden="true"
              />{" "}
              Sauvegarder
            </Button>
          </div>
        </Modal>

        {/* Confirm delete */}
        <ConfirmDialog
          isOpen={!!deleteItem}
          onClose={() => setDeleteItem(null)}
          onConfirm={handleDelete}
          loading={deleting}
          title="Supprimer le partenaire"
          message={`Êtes-vous sûr de vouloir supprimer "${deleteItem?.name}" ? Cette action est irréversible.`}
        />
      </div>
    </DashboardLayout>
  );
}
