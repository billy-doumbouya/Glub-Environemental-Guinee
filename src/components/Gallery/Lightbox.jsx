import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { X, ImageOff } from "lucide-react";

export function Lightbox({ item, onClose }) {
  const [imgError, setImgError] = useState(false);
  const [fullLoaded, setFullLoaded] = useState(false);

  useEffect(() => {
    setImgError(false);
    setFullLoaded(false);
  }, [item?.id]);

  useEffect(() => {
    if (!item) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [item, onClose]);

  if (!item) return null;

  /*
    Aligné sur useGallery : full (1200px) en priorité,
    thumb (300px) comme blur-up + fallback en cas d'erreur
  */
  const fullSrc = item.full || item.thumb;
  const thumbSrc = item.thumb || item.full;
  const hasImage = Boolean(fullSrc || thumbSrc);

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.92)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl"
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative bg-gray-900 flex items-center justify-center min-h-48 overflow-hidden">
          {imgError || !hasImage ? (
            <div className="flex flex-col items-center gap-3 py-20 text-gray-400">
              <ImageOff className="w-12 h-12" />
              <p className="text-sm">Image non disponible</p>
            </div>
          ) : (
            <>
              {/* Thumb en blur, visible tant que le full n'est pas chargé */}
              {thumbSrc && (
                <img
                  src={thumbSrc}
                  alt=""
                  loading="lazy"
                  aria-hidden="true"
                  className={`absolute inset-0 w-full h-full object-contain blur-md scale-105 transition-opacity duration-300 ${
                    fullLoaded ? "opacity-0" : "opacity-100"
                  }`}
                />
              )}

              {/* Image full, fade-in une fois chargée */}
              <img
                key={fullSrc}
                src={fullSrc}
                loading="lazy"
                alt={item.alt || item.title || "Photo ONG C.E.G"}
                className={`relative w-full max-h-[75vh] object-contain transition-opacity duration-300 ${
                  fullLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setFullLoaded(true)}
                onError={() => setImgError(true)}
              />
            </>
          )}
        </div>

        {/* Infos */}
        <div className="px-6 py-5">
          <h3 className="font-poppins font-bold text-xl text-gray-900">
            {item.title}
          </h3>
          <p className="text-sm text-green-600 font-medium mt-1">
            {item.category}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            ONG Club Environnemental de Guinée — ONG C.E.G
          </p>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-xl text-white flex items-center justify-center transition-colors"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.65)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.45)")
          }
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>
      </motion.div>
    </motion.div>,
    document.body,
  );
}