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

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            {/* Stats */}
            <div className="flex justify-between mb-10 bg-gray-50 p-4 rounded-2xl">
              <div className="flex items-center gap-2">
                <Images className="text-green-600" />
                <span>{images?.length || 0} photos</span>
              </div>
            </div>

            {/* FILTERS */}
            <div className="flex flex-wrap gap-3 justify-center mb-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-4 py-2 rounded-xl ${
                    activeFilter === cat
                      ? "bg-green-600 text-white"
                      : "bg-gray-100"
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

            {/* PAGINATION UI */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-4 mt-10">
                <button
                  onClick={prevPage}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-100 rounded-xl disabled:opacity-40"
                >
                  Prev
                </button>

                <span className="px-4 py-2 text-sm">
                  {page} / {totalPages}
                </span>

                <button
                  onClick={nextPage}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-gray-100 rounded-xl disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </section>

        <Lightbox item={selectedItem} onClose={() => setSelectedItem(null)} />
      </MainLayout>
    </>
  );
}
