import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Images } from "lucide-react";

import { SEO } from "../seo/SEO";
import { MainLayout } from "../layouts/MainLayout";
import { PageHero } from "../components/common/PageHero";
import { staggerContainer } from "../animations/variants";
import { useGallery } from "../hooks/useGallery";
import { GallerySkeleton } from "../components/Gallery/imageSkeleton";
import { GalleryItem } from "../components/Gallery/GalleryItem";
import { Lightbox } from "../components/Gallery/Lightbox";
import { useGalleryPagination } from "./usePagination";

function GalleryError({ message }) {
  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-10 text-red-500">⚠️ {message}</div>
      </div>
    </MainLayout>
  );
}

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState("Toutes");
  const [selectedItem, setSelectedItem] = useState(null);

  const { images, loading, error } = useGallery();

  /**
   * CATEGORIES
   */
  const categories = useMemo(() => {
    if (!images?.length) return ["Toutes"];
    const unique = [...new Set(images.map((i) => i.category))];
    return ["Toutes", ...unique];
  }, [images]);

  /**
   * FILTER
   */
  const filtered = useMemo(() => {
    if (activeFilter === "Toutes") return images || [];
    return (images || []).filter((img) => img.category === activeFilter);
  }, [images, activeFilter]);

  /**
   * RESET PAGE quand filtre change
   */
  const { page, totalPages, paginatedImages, nextPage, prevPage, resetPage } =
    useGalleryPagination(filtered, 24);

  useEffect(() => {
    resetPage();
  }, [activeFilter]);

  if (loading) return <GallerySkeleton />;
  if (error) return <GalleryError message={error} />;

  return (
    <>
      <SEO title="Galerie photos" description="Galerie photos ONG C.E.G" />

      <MainLayout>
        <PageHero
          badge="Nos actions en images"
          title="Galerie Photos"
          subtitle="Découvrez nos actions terrain"
          breadcrumb={["Accueil", "Galerie"]}
        />

        {/* Changement du fond de section pour faire ressortir le Glassmorphism */}
        <section className="py-16 bg-gradient-to-br from-gray-50 via-gray-100 to-green-50/30 min-h-screen">
          <div className="max-w-7xl mx-auto px-4">
            {/* Stats - Style Glassmorphism */}
            <div className="flex justify-between mb-10 bg-white/40 backdrop-blur-md border border-white/40 p-4 rounded-2xl shadow-sm max-w-xs backdrop-saturate-150">
              <div className="flex items-center gap-2">
                <Images className="text-green-600" />
                <span className="font-medium text-gray-700">
                  {images?.length || 0} photos
                </span>
              </div>
            </div>

            {/* FILTERS - Style Glassmorphism */}
            <div className="flex flex-wrap gap-3 justify-center mb-12 p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-sm max-w-5xl mx-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-5 py-2.5 rounded-xl transition-all duration-300 text-sm font-medium ${
                    activeFilter === cat
                      ? "bg-green-600 text-white shadow-md shadow-green-600/20 scale-105"
                      : "bg-white/40 hover:bg-white/70 text-gray-700 border border-white/20 backdrop-blur-sm"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* GRID */}
            {paginatedImages.length === 0 ? (
              <div className="text-center text-gray-400 py-20">
                Aucune photo
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFilter + page}
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[12rem]"
                >
                  {paginatedImages.map((item) => (
                    <GalleryItem
                      key={item.id}
                      item={item}
                      onOpen={setSelectedItem}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}

            {/* PAGINATION UI - Style Glassmorphism */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12 p-2 bg-white/30 backdrop-blur-md border border-white/30 rounded-2xl w-fit mx-auto shadow-sm">
                <button
                  onClick={prevPage}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white/60 hover:bg-white/90 text-gray-700 rounded-xl disabled:opacity-30 disabled:hover:bg-white/60 transition-all text-sm font-medium border border-white/20"
                >
                  Précédent
                </button>

                <span className="px-3 py-1 text-sm font-semibold text-gray-700 bg-white/40 rounded-lg">
                  {page} / {totalPages}
                </span>

                <button
                  onClick={nextPage}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-white/60 hover:bg-white/90 text-gray-700 rounded-xl disabled:opacity-30 disabled:hover:bg-white/60 transition-all text-sm font-medium border border-white/20"
                >
                  Suivant
                </button>
              </div>
            )}
          </div>
        </section>

        {/* CORRECTION ICI : Rendu conditionnel + passage des bonnes props de contrôle de la Lightbox */}
        <AnimatePresence>
          {selectedItem && (
            <Lightbox
              item={selectedItem}
              isOpen={!!selectedItem}
              onClose={() => setSelectedItem(null)}
            />
          )}
        </AnimatePresence>
      </MainLayout>
    </>
  );
}
