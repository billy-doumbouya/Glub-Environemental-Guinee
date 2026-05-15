// src/components/Gallery/GalleryItem.jsx
//
// Gère la chaîne de fallback d'image :
// 1. url (thumbnail Drive /thumbnail?id=)
// 2. thumbnailFallback (thumbnailLink de l'API Drive)
// 3. Placeholder visuel si tout échoue

import { useState } from "react";
import { motion } from "framer-motion";
import { ZoomIn, ImageOff } from "lucide-react";
import { fadeUp } from "../../animations/variants";

function ImagePlaceholder({ title, category }) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-green-800 to-green-950 flex flex-col items-center justify-center gap-2 p-4">
      <ImageOff className="w-8 h-8 text-green-400 opacity-60" />
      <p className="text-green-300 text-xs text-center leading-tight opacity-70">
        {title || category}
      </p>
    </div>
  );
}

export function GalleryItem({ item, onOpen }) {
  // 3 états : "thumbnail" → "fallback" → "error"
  const [imgState, setImgState] = useState("thumbnail");

  const currentSrc =
    imgState === "thumbnail"
      ? item.url
      : imgState === "fallback" && item.thumbnailFallback
        ? item.thumbnailFallback
        : null;

  const handleError = () => {
    if (imgState === "thumbnail" && item.thumbnailFallback) {
      setImgState("fallback");
    } else {
      setImgState("error");
    }
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
        {/* Image avec chaîne de fallback */}
        {currentSrc ? (
          <img
            src={currentSrc}
            alt={item.alt || item.title || "Photo C.E.G"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={handleError}
            // Permet les cookies cross-origin nécessaires à Drive
            crossOrigin="anonymous"
          />
        ) : (
          <ImagePlaceholder title={item.title} category={item.category} />
        )}

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center bg-green-600/0 group-hover:bg-green-600/20 transition-all duration-300">
          <ZoomIn className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-75 group-hover:scale-100" />
        </div>

        {/* Infos bas */}
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
