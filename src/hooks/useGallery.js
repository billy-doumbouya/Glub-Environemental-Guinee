import { useEffect, useState } from "react";
import { galleryService } from "../../api/services";

export function useGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    galleryService
      .getImages()
      .then((res) => {
        const raw = res.data.data || [];
        const normalized = raw.map((item) => ({
          id: item._id,
          title: item.title || item.alt || item.caption || "",
          category: item.category?.name || item.category || "Galerie",
          src: item.image?.url || item.url || null, // ← fix
          thumb: item.image?.url || item.url || null,
          fullImage: item.image?.url || item.url || null,
          full: item.image?.url || item.url || null,
          aspect: "normal",
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
