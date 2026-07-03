// src/hooks/usePageBackgrounds.js
// Charge une seule fois toutes les images de fond (public) et les expose
// sous forme de map { pageKey: url }, consommée par PageHero et HeroBackground.

import { useEffect, useState } from "react";
import { backgroundsService } from "../../api/services";

export function usePageBackgrounds() {
  const [backgrounds, setBackgrounds] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    backgroundsService
      .getAll()
      .then(({ data }) => {
        if (!mounted) return;
        const map = {};
        (data.data || []).forEach((bg) => {
          map[bg.pageKey] = bg.image?.url || null;
        });
        setBackgrounds(map);
      })
      .catch(() => {
        // silencieux : en cas d'échec, les pages retombent sur leurs fallbacks
        // (dégradé pour PageHero, /ceg-bg.jpg pour HeroBackground)
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { backgrounds, loading };
}
