import { motion } from "framer-motion";
import { ZoomIn } from "lucide-react";

export function GalleryImage({ item, onOpen }) {
  return (
    <motion.div
      layout
      className={`group relative overflow-hidden rounded-2xl cursor-pointer ${item.span}`}
      onClick={() => onOpen(item)}
    >
      <img
        src={item.imageUrl}
        alt={item.title}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <ZoomIn className="text-white w-10 h-10" />
      </div>

      <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
        <span className="text-xs text-white bg-white/20 px-2 py-1 rounded-full">
          {item.category}
        </span>

        <p className="text-white text-sm mt-2 font-medium line-clamp-1">
          {item.title}
        </p>
      </div>
    </motion.div>
  );
}
