import { useEffect, useState } from "react";
import { galleryService } from "../../api/services";

export function useGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    galleryService.getImages()
      .then((res) => {
        const raw = res.data.data || [];
        // Normalisation : adapte la structure backend → structure attendue par GalleryItem
        const normalized = raw.map((item) => ({
          id:       item._id,
          title:    item.title || item.alt || "",
          category: item.category || "Galerie",
          src:      item.url,
          thumb:    item.url,
           fullImage: item.url,
          full:     item.url,
          aspect:   "normal",
        }));
        setImages(normalized);
      })
      .catch((err) => {
        console.error("Erreur chargement galerie :", err);
        setError("Erreur chargement galerie, vérifiez votre connexion");
        setImages([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return { images, loading, error };
}