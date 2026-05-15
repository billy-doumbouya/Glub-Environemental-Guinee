// src/pages/GalleryPage.jsx
import { useMemo, useState } from "react";
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

function GalleryError({ message }) {
  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-10">
          <div className="text-red-500 mb-4 text-lg">⚠️ {message}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    </MainLayout>
  );
}

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState("Toutes");
  const [selectedItem, setSelectedItem] = useState(null);
  const { images, loading, error } = useGallery();

  const categories = useMemo(() => {
    if (!images?.length) return ["Toutes"];
    const unique = [...new Set(images.map((i) => i.category))];
    return ["Toutes", ...unique];
  }, [images]);

  const filtered = useMemo(() => {
    if (activeFilter === "Toutes") return images || [];
    return (images || []).filter((img) => img.category === activeFilter);
  }, [images, activeFilter]);

  if (loading) return <GallerySkeleton />;
  if (error) return <GalleryError message={error} />;

  return (
    <>
      <SEO
        title="Galerie photos"
        description="Galerie photos de l'ONG C.E.G : actions de reboisement, formations, sensibilisation et projets communautaires en Guinée."
        keywords="galerie photos CEG Guinée, images reboisement, photos ONG environnement"
      />
      <MainLayout>
        <PageHero
          badge="Nos actions en images"
          title="Galerie Photos"
          subtitle="Découvrez en images les actions et projets de l'ONG C.E.G sur le terrain en République de Guinée."
          breadcrumb={["Accueil", "Galerie"]}
        />

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Stats bar */}
            <div className="flex items-center justify-between mb-10 bg-gray-50 rounded-2xl px-6 py-4 border border-gray-100">
              <div className="flex items-center gap-2 text-gray-600">
                <Images className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-sm">
                  {images?.length || 0} photos
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Cliquer sur une image pour agrandir
              </p>
            </div>

            {/* Filtres */}
            <div className="flex flex-wrap gap-3 justify-center mb-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeFilter === cat
                      ? "bg-green-600 text-white shadow-md shadow-green-200"
                      : "bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grille */}
            {filtered.length === 0 ? (
              <div className="text-center text-gray-400 py-20">
                <p className="text-lg">Aucune photo dans cette catégorie.</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFilter}
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[12rem]"
                >
                  {filtered.map((item) => (
                    <GalleryItem
                      key={item.id}
                      item={item}
                      onOpen={setSelectedItem}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </section>

        <Lightbox item={selectedItem} onClose={() => setSelectedItem(null)} />
      </MainLayout>
    </>
  );
}
