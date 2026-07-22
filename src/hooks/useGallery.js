import { useEffect, useState } from "react";
import { galleryService } from "../../api/services";
import { optimizeCloudinaryUrl } from "../utils/optimizeCloudinaryUrl";

export function useGallery(page = 1, categoryId = null) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Charger une seule page (24 images)
    const params = { limit: 24, page };
    if (categoryId) params.category = categoryId;
    
    galleryService
      .getImages(params)
      .then((res) => {
        const raw = res.data.data || [];
        const pagination = res.data.pagination || {};
        
        const normalized = raw.map((item) => {
          const baseUrl = item.image?.url || item.url || null;
          return {
            id: item._id,
            title: item.title || item.alt || item.caption || "",
            category: item.category?.name || item.category || "Galerie",
            categoryId: item.category?._id,
            thumb: optimizeCloudinaryUrl(baseUrl, { width: 300 }),
            full: optimizeCloudinaryUrl(baseUrl, { width: 1200 }),
            aspect: "normal",
          };
        });
        setImages(normalized);
        setTotalPages(pagination.pages || 1);
        setTotal(pagination.total || 0);
      })
      .catch((err) => {
        console.error("Erreur chargement galerie :", err);
        setError("Erreur chargement galerie, vérifiez votre connexion");
        setImages([]);
        setTotalPages(1);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [page, categoryId]);

  return { images, loading, error, totalPages, total };
}