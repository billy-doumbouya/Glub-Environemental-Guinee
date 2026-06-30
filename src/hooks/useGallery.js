import { useEffect, useState } from "react";
import { galleryService } from "../../api/services";
import { optimizeCloudinaryUrl } from "../utils/optimizeCloudinaryUrl";

export function useGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    galleryService
      .getImages()
      .then((res) => {
        const raw = res.data.data || [];
        const normalized = raw.map((item) => {
          const baseUrl = item.image?.url || item.url || null;
          return {
            id: item._id,
            title: item.title || item.alt || item.caption || "",
            category: item.category?.name || item.category || "Galerie",
            thumb: optimizeCloudinaryUrl(baseUrl, { width: 300 }),
            full: optimizeCloudinaryUrl(baseUrl, { width: 1200 }),
            aspect: "normal",
          };
        });
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