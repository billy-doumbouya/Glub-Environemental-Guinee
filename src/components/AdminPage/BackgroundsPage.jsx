// src/components/AdminPage/BackgroundsPage.jsx
// Gestion des images de fond par page — upload, réinitialisation

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { backgroundsService } from "../../../api/services";
import {
  Button,
  Card,
  ConfirmDialog,
  DashboardLoadingScreen,
  ImagePreview,
  PageHeader,
} from "../ui";
import { DashboardLayout } from "../../layouts/DashboardLayout";

const PAGE_SLOTS = [
  { pageKey: "home-hero", label: "Accueil — Hero" },
  { pageKey: "about-hero", label: "À propos — Hero" },
  { pageKey: "contact-hero", label: "Contact — Hero" },
  { pageKey: "domains-hero", label: "Domaines d'action — Hero" },
  { pageKey: "donate-hero", label: "Faire un don — Hero" },
  { pageKey: "gallery-hero", label: "Galerie — Hero" },
  { pageKey: "news-hero", label: "Actualités — Hero" },
  { pageKey: "partners-hero", label: "Partenaires — Hero" },
  { pageKey: "projects-hero", label: "Projets — Hero" },
  { pageKey: "global-cta", label: "Section Appel à l'action (CTA)" },
];

function BackgroundSlotCard({ slot, current, onUploaded, onReset }) {
  const [uploading, setUploading] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [pendingPreview, setPendingPreview] = useState(null);
  const fileRef = useRef();

  const handlePick = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPendingFile(file);
    setPendingPreview(URL.createObjectURL(file));
  };

  const cancelPending = () => {
    if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    setPendingFile(null);
    setPendingPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const confirmUpload = async () => {
    if (!pendingFile) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("label", slot.label);
      fd.append("image", pendingFile);
      const res = await backgroundsService.update(slot.pageKey, fd);
      onUploaded(slot.pageKey, res.data.data);
      toast.success("Image mise à jour ✅");
      cancelPending();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const handleReset = async () => {
    setResetting(true);
    try {
      const res = await backgroundsService.reset(slot.pageKey);
      onReset(slot.pageKey, res.data.data);
      toast.success("Image réinitialisée");
      setResetConfirm(false);
    } catch {
      toast.error("Erreur lors de la réinitialisation");
    } finally {
      setResetting(false);
    }
  };

  const displaySrc = pendingPreview || current?.url;

  return (
    <Card>
      <div className="p-4 flex flex-col gap-3">
        <div>
          <div className="text-sm font-semibold text-gray-900">
            {slot.label}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">{slot.pageKey}</div>
        </div>

        <div className="relative w-full h-32 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
          {displaySrc ? (
            <img
              src={displaySrc}
              alt={slot.label}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs text-gray-400">
              Aucune image — dégradé par défaut utilisé
            </span>
          )}
          {pendingPreview && (
            <span className="absolute top-2 left-2 text-[10px] font-semibold bg-amber-500 text-white px-2 py-0.5 rounded-md">
              Aperçu — non enregistré
            </span>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handlePick}
          className="hidden"
        />

        {!pendingFile ? (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => fileRef.current?.click()}
            >
              <i className="ti ti-upload mr-1" aria-hidden="true" />
              {current?.url ? "Changer" : "Ajouter"}
            </Button>
            {current?.url && (
              <Button
                size="sm"
                variant="danger"
                onClick={() => setResetConfirm(true)}
              >
                <i className="ti ti-refresh mr-1" aria-hidden="true" />
                Retirer
              </Button>
            )}
          </div>
        ) : (
          <div className="flex gap-2">
            <Button size="sm" loading={uploading} onClick={confirmUpload}>
              <i className="ti ti-check mr-1" aria-hidden="true" />
              Confirmer
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={cancelPending}
              disabled={uploading}
            >
              Annuler
            </Button>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={resetConfirm}
        onClose={() => setResetConfirm(false)}
        onConfirm={handleReset}
        loading={resetting}
        title="Retirer l'image de fond"
        message={`Retirer l'image de fond de "${slot.label}" ? La page utilisera le dégradé par défaut.`}
      />
    </Card>
  );
}

export default function BackgroundsPage() {
  const [backgrounds, setBackgrounds] = useState({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await backgroundsService.getAll();
      const map = {};
      (res.data.data || []).forEach((bg) => {
        map[bg.pageKey] = bg.image;
      });
      setBackgrounds(map);
    } catch {
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleUploaded = (pageKey, data) => {
    setBackgrounds((prev) => ({ ...prev, [pageKey]: data.image }));
  };

  const handleReset = (pageKey, data) => {
    setBackgrounds((prev) => ({ ...prev, [pageKey]: data.image }));
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <PageHeader
          title={
            <span className="inline-flex items-center gap-2">
              <i className="ti ti-photo-edit" aria-hidden="true" /> Images de
              fond
            </span>
          }
          subtitle="Gérez les images de fond affichées sur chaque page du site"
        />

        {loading ? (
          <DashboardLoadingScreen />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
            {PAGE_SLOTS.map((slot) => (
              <BackgroundSlotCard
                key={slot.pageKey}
                slot={slot}
                current={backgrounds[slot.pageKey]}
                onUploaded={handleUploaded}
                onReset={handleReset}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
