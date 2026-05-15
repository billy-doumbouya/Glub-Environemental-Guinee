// src/components/Gallery/GalleryItem.jsx

import { useState } from "react";
import { motion } from "framer-motion";
import { ZoomIn, ImageOff } from "lucide-react";
import { fadeUp } from "../../animations/variants";

/**
 * Placeholder propre (fallback final)
 */
function ImagePlaceholder({ title, category }) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-green-900 to-green-950 flex flex-col items-center justify-center gap-2 p-4">
      <ImageOff className="w-10 h-10 text-green-400 opacity-60" />
      <p className="text-green-200 text-xs text-center opacity-70">
        {title || category || "Image indisponible"}
      </p>
    </div>
  );
}

export function GalleryItem({ item, onOpen }) {
  /**
   * FIX IMPORTANT :
   * ton service utilise `src` + `thumb`, PAS `url`
   */
  const primarySrc = item.thumb || item.src;
  const fallbackSrc = item.thumbnailFallback || null;

  const [src, setSrc] = useState(primarySrc);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    // 1er fallback → Drive thumbnailLink si dispo
    if (src !== fallbackSrc && fallbackSrc) {
      setSrc(fallbackSrc);
      return;
    }

    // 2e fallback → placeholder
    setHasError(true);
  };

  const height = item.span?.includes("row-span-2") ? "24rem" : "12rem";

  return (
    <motion.div
      variants={fadeUp}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer ${item.span || ""}`}
      onClick={() => onOpen(item)}
    >
      <div
        className="w-full relative overflow-hidden bg-gray-100"
        style={{ height }}
      >
        {/* IMAGE / PLACEHOLDER */}
        {!hasError && src ? (
          <img
            src={src}
            alt={item.alt || item.title || "Photo C.E.G"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={handleError}
          />
        ) : (
          <ImagePlaceholder title={item.title} category={item.category} />
        )}

        {/* OVERLAY GRADIENT */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* HOVER ICON */}
        <div className="absolute inset-0 flex items-center justify-center bg-green-600/0 group-hover:bg-green-600/20 transition-all duration-300">
          <ZoomIn className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition" />
        </div>

        {/* CAPTION */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <span className="text-xs bg-white/20 text-white px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/20">
            {item.category}
          </span>

          <p className="text-white font-semibold text-sm mt-2 leading-tight">
            {item.title}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
