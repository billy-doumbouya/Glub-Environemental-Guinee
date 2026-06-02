import { useEffect, useState } from "react";
import { fetchGalleryImages } from "../services/googleDriveService";
import {
  GOOGLE_MAPS_DRIVE_API_KEY,
  GOOGLE_MAPS_DRIVE_FOLDER_ID,
} from "../constants";

export function useGallery(options = {}) {
  const { folderId, apiKey } = options;

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchGalleryImages({
          folderId: GOOGLE_MAPS_DRIVE_FOLDER_ID,
          apiKey: GOOGLE_MAPS_DRIVE_API_KEY,
          signal: controller.signal,
        });

        if (!alive) return;

        setImages(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!alive) return;

        setError(
          err?.message
            ? `${err.message}\nvous devez avoir une connexion internet pour afficher les images`
            : "Erreur chargement galerie, \nverifiez votre connexion",
        );
        setImages([]);
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();

    return () => {
      alive = false;
      controller.abort();
    };
  }, [folderId, apiKey]);

  return { images, loading, error };
}
