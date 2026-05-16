// src/components/Gallery/Lightbox.jsx

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ImageOff } from "lucide-react";

export function Lightbox({ item, onClose }) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
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

  // fullImage = thumbnail?id=...&sz=w2400 — fonctionne directement en <img src>
  // fallback sur url (thumbnail sz=w800) si erreur
  const imageSrc = imgError ? item.url : item.fullImage || item.url;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image */}
          <div className="bg-gray-900 flex items-center justify-center min-h-48">
            {imgError && !item.url ? (
              <div className="flex flex-col items-center gap-3 py-20 text-gray-400">
                <ImageOff className="w-12 h-12" />
                <p className="text-sm">Image non disponible</p>
              </div>
            ) : (
              <img
                src={imageSrc}
                alt={item.alt || item.title}
                className="w-full max-h-[75vh] object-contain"
                onError={() => {
                  if (!imgError) setImgError(true);
                }}
              />
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

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
