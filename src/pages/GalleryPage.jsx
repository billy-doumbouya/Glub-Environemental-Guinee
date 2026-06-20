import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Images, ChevronLeft, ChevronRight } from "lucide-react";

import { SEO } from "../seo/SEO";
import { MainLayout } from "../layouts/MainLayout";
import { PageHero } from "../components/common/PageHero";
import { staggerContainer } from "../animations/variants";
import { useGallery } from "../hooks/useGallery";
import { GallerySkeleton } from "../components/Gallery/imageSkeleton";
import { GalleryItem } from "../components/Gallery/GalleryItem";
import { Lightbox } from "../components/Gallery/Lightbox";
import { useGalleryPagination } from "./usePagination";

// ─── Error state ──────────────────────────────────────────────────────────────
function GalleryError({ message }) {
  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center p-10 rounded-2xl bg-red-50 border border-red-100 text-red-500 text-sm">
          ⚠️ {message}
        </div>
      </div>
    </MainLayout>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ filter }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: "rgba(22,163,74,0.08)" }}
      >
        <Images className="w-7 h-7 text-green-500" />
      </div>
      <p className="font-poppins font-semibold text-gray-700 text-base mb-1">
        Aucune photo
      </p>
      <p className="text-gray-400 text-sm">
        Aucun résultat pour la catégorie{" "}
        <span className="font-medium text-gray-600">« {filter} »</span>
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
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

  const { page, totalPages, paginatedImages, nextPage, prevPage, resetPage } =
    useGalleryPagination(filtered, 24);

  useEffect(() => {
    resetPage();
  }, [activeFilter]);

  if (loading) return <GallerySkeleton />;
  if (error) return <GalleryError message={error} />;

  return (
    <>
      <SEO
        title="Galerie photos"
        description="Galerie photos des actions terrain de l'ONG Club Environnemental de Guinée."
      />

      <MainLayout>
        <PageHero
          badge="Nos actions en images"
          bgImage="/ceg-bg-gallery.jpg"
          title="Galerie Photos"
          subtitle="Découvrez nos actions terrain à travers ces moments capturés."
          breadcrumb={["Accueil", "Galerie"]}
        />

        <section className="py-12 sm:py-16 bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* ── TOP BAR : count + filtre actif ── */}
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(22,163,74,0.10)" }}
                >
                  <Images className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm font-semibold text-gray-600">
                  <span className="text-gray-900 font-bold">
                    {filtered.length}
                  </span>{" "}
                  {filtered.length > 1 ? "photos" : "photo"}
                  {activeFilter !== "Toutes" && (
                    <span className="text-gray-400 font-normal">
                      {" "}
                      · {activeFilter}
                    </span>
                  )}
                </span>
              </div>

              {/* Reset filter pill */}
              {activeFilter !== "Toutes" && (
                <button
                  onClick={() => setActiveFilter("Toutes")}
                  className="text-[11px] font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full hover:bg-green-100 transition-colors"
                >
                  Tout afficher ×
                </button>
              )}
            </div>

            {/* ── FILTER TABS — scroll horizontal ── */}
            <div className="mb-8 sm:mb-10">
              <div
                className="flex gap-2 overflow-x-auto pb-2"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {categories.map((cat) => {
                  const isActive = activeFilter === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveFilter(cat)}
                      className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap border transition-all duration-200"
                      style={
                        isActive
                          ? {
                              background:
                                "linear-gradient(135deg,#16a34a,#059669)",
                              color: "#fff",
                              borderColor: "transparent",
                              boxShadow: "0 4px 12px rgba(5,150,105,0.25)",
                            }
                          : {
                              background: "#fff",
                              color: "#374151",
                              borderColor: "rgba(0,0,0,0.08)",
                            }
                      }
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── GRID ── */}
            {paginatedImages.length === 0 ? (
              <EmptyState filter={activeFilter} />
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFilter + page}
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 auto-rows-[11rem] sm:auto-rows-[13rem]"
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

            {/* ── PAGINATION ── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12">
                <button
                  onClick={prevPage}
                  disabled={page === 1}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border bg-white text-gray-700 border-gray-200 disabled:opacity-30 transition-all hover:-translate-y-0.5 hover:shadow-sm disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Préc.
                </button>

                {/* Page pills */}
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => {
                      // Show: first, last, current ±1
                      return (
                        p === 1 || p === totalPages || Math.abs(p - page) <= 1
                      );
                    })
                    .reduce((acc, p, idx, arr) => {
                      if (idx > 0 && p - arr[idx - 1] > 1) {
                        acc.push("…");
                      }
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, idx) =>
                      p === "…" ? (
                        <span
                          key={`ellipsis-${idx}`}
                          className="w-8 text-center text-gray-300 text-sm"
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => {
                            // navigate to page p via nextPage/prevPage cascade or expose setPage from hook
                            const diff = p - page;
                            if (diff > 0)
                              for (let i = 0; i < diff; i++) nextPage();
                            else
                              for (let i = 0; i < Math.abs(diff); i++)
                                prevPage();
                          }}
                          className="w-9 h-9 rounded-xl text-sm font-semibold border transition-all duration-150"
                          style={
                            p === page
                              ? {
                                  background:
                                    "linear-gradient(135deg,#16a34a,#059669)",
                                  color: "#fff",
                                  borderColor: "transparent",
                                  boxShadow: "0 4px 10px rgba(5,150,105,0.22)",
                                }
                              : {
                                  background: "#fff",
                                  color: "#374151",
                                  borderColor: "rgba(0,0,0,0.08)",
                                }
                          }
                        >
                          {p}
                        </button>
                      ),
                    )}
                </div>

                <button
                  onClick={nextPage}
                  disabled={page === totalPages}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border bg-white text-gray-700 border-gray-200 disabled:opacity-30 transition-all hover:-translate-y-0.5 hover:shadow-sm disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  Suiv.
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </section>
      </MainLayout>

      {/* Lightbox — hors layout, portal vers body */}
      <AnimatePresence>
        {selectedItem && (
          <Lightbox item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
