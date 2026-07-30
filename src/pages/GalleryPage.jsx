import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Images, ChevronLeft, ChevronRight } from "lucide-react";

import { SEO } from "../seo/SEO";
import { MainLayout } from "../layouts/MainLayout";
import { PageHero } from "../components/common/PageHero";
import { staggerContainer } from "../animations/variants";
import { GallerySkeleton } from "../components/Gallery/imageSkeleton";
import { GalleryItem } from "../components/Gallery/GalleryItem";
import { Lightbox } from "../components/Gallery/Lightbox";
import { useGallery } from "../hooks/useGallery";
import { usePageBackgrounds } from "../hooks/usePageBackgrounds ";
import { galleryService } from "../../api/services";
import { extractArray } from "../helpers/Apihelpers";

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
  const { backgrounds } = usePageBackgrounds();
  const [activeFilter, setActiveFilter] = useState("Toutes");
  const [selectedItem, setSelectedItem] = useState(null);
  const [page, setPage] = useState(1);
  const [allCategories, setAllCategories] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});

  // Charger les catégories une seule fois
  useEffect(() => {
    let isMounted = true;

    galleryService
      .getCategories()
      .then((res) => {
        if (!isMounted) return;

        const cats = extractArray(res);

        if (!Array.isArray(cats) || cats.length === 0) {
          if (!Array.isArray(cats)) {
            console.error(
              "Format de réponse inattendu pour getCategories():",
              res,
            );
          }
          setAllCategories([]);
          setCategoryMap({});
          return;
        }

        setAllCategories(cats);

        const map = {};
        cats.forEach((cat) => {
          if (cat?.name) map[cat.name] = cat._id;
        });
        setCategoryMap(map);
      })
      .catch((err) => {
        console.error("Erreur chargement catégories:", err);
        if (isMounted) {
          setAllCategories([]);
          setCategoryMap({});
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Obtenir l'ID de la catégorie active
  const activeCategoryId =
    activeFilter === "Toutes" ? null : categoryMap[activeFilter];

  const { images, loading, error, totalPages, total } = useGallery(
    page,
    activeCategoryId,
  );

  const safeImages = Array.isArray(images) ? images : [];

  const categories = useMemo(() => {
    const safeCategories = Array.isArray(allCategories) ? allCategories : [];
    return ["Toutes", ...safeCategories.map((c) => c.name)];
  }, [allCategories]);

  const handleCategoryChange = (category) => {
    setActiveFilter(category);
    setPage(1); // Retour à la première page
  };

  const nextPage = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const goToPage = (p) => {
    const pageNum = Math.max(1, Math.min(p, totalPages));
    setPage(pageNum);
  };

  // N.B. L'early-return du skeleton a été supprimé d'ici !
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
          bgImage={backgrounds["gallery-hero"] || "/ceg-bg-gallery.jpg"}
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
                    {loading ? "..." : (total ?? safeImages.length)}
                  </span>{" "}
                  {(total ?? safeImages.length) > 1 ? "photos" : "photo"}
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
                      onClick={() => handleCategoryChange(cat)}
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

            {/* ── GRID / SKELETON / EMPTY STATE ── */}
            {loading ? (
              /* Affichage du Skeleton à l'intérieur du layout */
              <GallerySkeleton />
            ) : safeImages.length === 0 ? (
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
                  {safeImages.map((item) => (
                    <GalleryItem
                      key={item.id}
                      item={item}
                      onOpen={setSelectedItem}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}

            {/* ── PAGINATION (Masquée pendant le chargement) ── */}
            {!loading && totalPages > 1 && (
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
                          onClick={() => goToPage(p)}
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

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <Lightbox item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
