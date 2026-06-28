import { useState, useEffect } from "react";
import { toast } from "sonner";
import { domainsService } from "../../../api/services";
import {
  Badge,
  Button,
  Input,
  Textarea,
  Modal,
  ConfirmDialog,
  PageHeader,
  Card,
  TogglePublished,
} from "../ui";
import { DashboardLayout } from "../../layouts/DashboardLayout";

const ICON_OPTIONS = [
  { value: "leaf", label: "leaf — 🌿 Environnement" },
  { value: "users", label: "users — 👥 Genre / Communauté" },
  { value: "heart", label: "heart — ❤️ Santé" },
  { value: "book", label: "book — 📚 Formation / Recherche" },
  { value: "globe", label: "globe — 🌍 International" },
  { value: "star", label: "star — ⭐ Excellence" },
  { value: "flag", label: "flag — 🚩 Gouvernance" },
  { value: "plant", label: "plant — 🌱 Reboisement" },
  { value: "chart-bar", label: "chart-bar — 📊 Statistiques" },
];

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
    setLoading(true);
    try {
      const res = await domainsService.getAllAdmin();
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
      const payload = {
        ...form,
        activities: form.activities
          .split("\n")
          .map((a) => a.trim())
          .filter(Boolean),
      };
      if (editItem) {
        await domainsService.update(editItem._id, payload);
        toast.success("Domaine mis à jour ✅");
      } else {
        await domainsService.create(payload);
        toast.success("Domaine créé ✅");
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
      await domainsService.remove(deleteItem._id);
      toast.success("Domaine supprimé");
      setDeleteItem(null);
      load();
    } catch {
      toast.error("Erreur suppression");
    } finally {
      setDeleting(false);
    }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

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
              <i className="ti ti-plant" aria-hidden="true" /> Domaines
            </span>
          }
          subtitle={`${items.length} domaine(s) d'intervention`}
          action={
            <Button onClick={openCreate}>
              <i
                className="ti ti-plus"
                style={{ marginRight: "4px" }}
                aria-hidden="true"
              />
              Nouveau domaine
            </Button>
          }
        />

        {loading ? (
          <p>Chargement...</p>
        ) : (
          <Card>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #E5E7EB" }}>
                  {[
                    "Icône",
                    "Titre",
                    "Activités",
                    "Ordre",
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
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 10,
                          background: item.bgColor || "#F0FDF4",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: `1px solid ${item.color}30`,
                        }}
                      >
                        <i
                          className={`ti ti-${item.icon || "leaf"}`}
                          style={{ color: item.color, fontSize: 20 }}
                        />
                      </div>
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
                        {item.title}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#6B7280",
                          marginTop: "2px",
                        }}
                      >
                        {item.shortTitle}
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <Badge color="blue">
                        {(item.activities || []).length} activité(s)
                      </Badge>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: "13px", color: "#6B7280" }}>
                        #{item.order ?? 0}
                      </span>
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
                          onClick={() => setDeleteItem(item)}
                        >
                          <i className="ti ti-trash" aria-hidden="true" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        padding: "32px",
                        textAlign: "center",
                        color: "#6B7280",
                      }}
                    >
                      Aucun domaine configuré. Créez votre premier domaine
                      d'intervention.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        )}

        {/* ── MODAL ── */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={
            editItem ? "Modifier le domaine" : "Nouveau domaine d'intervention"
          }
          size="lg"
        >
          <TogglePublished
            value={form.isPublished}
            onChange={(v) => setForm({ ...form, isPublished: v })}
          />

          {/* Titres */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <Input
              label="Titre complet *"
              value={form.title}
              onChange={set("title")}
              placeholder="Ex: Environnement et Développement Durable"
            />
            <Input
              label="Titre court"
              value={form.shortTitle}
              onChange={set("shortTitle")}
              placeholder="Ex: Environnement & Durable (affiché sur les cartes)"
            />
          </div>

          {/* Icône + couleurs */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  marginBottom: "6px",
                  color: "#374151",
                }}
              >
                Icône Tabler
              </label>
              <select
                value={form.icon}
                onChange={set("icon")}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                }}
              >
                {ICON_OPTIONS.map((ico) => (
                  <option key={ico.value} value={ico.value}>
                    {ico.label}
                  </option>
                ))}
              </select>
              <p
                style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "4px" }}
              >
                Icône affichée sur les cartes et sections
              </p>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  marginBottom: "6px",
                  color: "#374151",
                }}
              >
                Couleur principale
              </label>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <input
                  type="color"
                  value={form.color}
                  onChange={set("color")}
                  style={{
                    width: "48px",
                    height: "42px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    cursor: "pointer",
                    padding: "2px 4px",
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: "11px", color: "#6B7280" }}>
                  {form.color}
                  <br />
                  texte & icônes
                </span>
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  marginBottom: "6px",
                  color: "#374151",
                }}
              >
                Couleur de fond
              </label>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <input
                  type="color"
                  value={form.bgColor}
                  onChange={set("bgColor")}
                  style={{
                    width: "48px",
                    height: "42px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    cursor: "pointer",
                    padding: "2px 4px",
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: "11px", color: "#6B7280" }}>
                  {form.bgColor}
                  <br />
                  fond des cartes
                </span>
              </div>
            </div>
          </div>

          {/* Prévisualisation couleurs */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "10px",
              marginBottom: "16px",
              background: form.bgColor,
              border: `1px solid ${form.color}30`,
            }}
          >
            <i
              className={`ti ti-${form.icon}`}
              style={{ color: form.color, fontSize: 24 }}
            />
            <div>
              <div
                style={{
                  fontWeight: "600",
                  fontSize: "14px",
                  color: form.color,
                }}
              >
                {form.title || "Aperçu du domaine"}
              </div>
              <div style={{ fontSize: "12px", color: "#6B7280" }}>
                {form.shortTitle || "Titre court"}
              </div>
            </div>
          </div>

          <Textarea
            label="Description"
            value={form.description}
            onChange={set("description")}
            rows={3}
            placeholder="Décrivez le domaine en 2-3 phrases. Ex: Promotion de la conservation des écosystèmes, gestion durable des ressources naturelles, lutte contre la déforestation..."
          />

          <Textarea
            label="Activités principales (une activité par ligne)"
            value={form.activities}
            onChange={set("activities")}
            rows={6}
            placeholder={
              "Reboisement et restauration des forêts\nGestion durable des terres agricoles\nProtection des zones humides\nSensibilisation aux changements climatiques\nPromotion des énergies renouvelables"
            }
          />

          <Input
            label="Impact mesuré"
            value={form.impact}
            onChange={set("impact")}
            placeholder="Ex: Des milliers d'hectares de forêts protégées et restaurées depuis 2016"
          />

          <Input
            label="Ordre d'affichage"
            type="number"
            value={form.order}
            onChange={(e) =>
              setForm({ ...form, order: Number(e.target.value) })
            }
            placeholder="1 = premier affiché, 2 = deuxième... (ordre croissant)"
          />

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
              paddingTop: "16px",
              borderTop: "1px solid #E5E7EB",
              marginTop: "16px",
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
              />
              Sauvegarder
            </Button>
          </div>
        </Modal>

        <ConfirmDialog
          isOpen={!!deleteItem}
          onClose={() => setDeleteItem(null)}
          onConfirm={handleDelete}
          loading={deleting}
          title="Supprimer le domaine"
          message={`Supprimer définitivement "${deleteItem?.title}" ? Cette action est irréversible.`}
        />
      </div>
    </DashboardLayout>
  );
}
