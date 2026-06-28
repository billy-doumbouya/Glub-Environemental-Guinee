import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, User, Tag, ArrowRight, X } from "lucide-react";
import { SEO } from "../seo/SEO";
import { MainLayout } from "../layouts/MainLayout";
import { PageHero } from "../components/common/PageHero";
import { newsService } from "../../api/services"; // ← adapte si besoin
import { staggerContainer, fadeUp } from "../animations/variants";

const categoryColors = {
  Événement: {
    bg: "bg-green-500/10",
    text: "text-green-300",
    border: "border-green-500/30",
  },
  Formation: {
    bg: "bg-blue-500/10",
    text: "text-blue-300",
    border: "border-blue-500/30",
  },
  Partenariat: {
    bg: "bg-amber-500/10",
    text: "text-amber-300",
    border: "border-amber-500/30",
  },
  Publication: {
    bg: "bg-purple-500/10",
    text: "text-purple-300",
    border: "border-purple-500/30",
  },
  Default: {
    bg: "bg-white/10",
    text: "text-gray-300",
    border: "border-white/20",
  },
};

function NewsCard({ article, featured = false, onReadMore }) {
  const catColor = categoryColors[article.category] || categoryColors.Default;
  // image peut être { url, publicId } (MongoDB) ou une string (ancien data)
  const imageUrl = article.image?.url ?? article.image ?? null;

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className={`group relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between ${
        featured ? "md:flex-row lg:col-span-3 min-h-[320px]" : "h-full"
      }`}
      style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.04)" }}
    >
      <div
        className={`bg-gradient-to-br from-green-800/80 to-slate-900 relative overflow-hidden flex-stretch min-h-[200px] ${featured ? "md:w-96 shrink-0" : "w-full"}`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-7xl opacity-10 select-none pointer-events-none">
            🌿
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
        <div className="absolute top-4 left-4 z-10">
          <span
            className={`text-xs font-semibold px-3 py-1.5 rounded-xl border backdrop-blur-md ${catColor.bg} ${catColor.text} ${catColor.border}`}
          >
            {article.category}
          </span>
        </div>
        {article.featured && (
          <div className="absolute bottom-4 left-4 z-10">
            <span className="bg-amber-500/90 text-slate-950 text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-lg backdrop-blur-sm">
              À la une
            </span>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-4 mb-4 text-xs text-gray-400">
            <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
              <Calendar className="w-3.5 h-3.5 text-green-400" />
              {article.displayDate || article.date}
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
              <User className="w-3.5 h-3.5 text-green-400" />
              {article.author}
            </span>
          </div>
          <h3 className="font-poppins font-bold text-slate-800 text-xl leading-snug mb-3 group-hover:text-green-600 transition-colors duration-300">
            {article.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-3">
            {article.excerpt}
          </p>
        </div>

        <div>
          <div className="flex flex-wrap gap-1.5 mb-5">
            {(article.tags || []).map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 text-[11px] bg-slate-50 text-slate-600 border border-slate-100 px-2.5 py-1 rounded-lg"
              >
                <Tag className="w-2.5 h-2.5 opacity-60" />
                {tag}
              </span>
            ))}
          </div>
          <button
            onClick={() => onReadMore(article)}
            className="inline-flex items-center gap-2 text-green-600 text-sm font-bold bg-green-50 hover:bg-green-100 px-4 py-2 rounded-xl transition-all duration-200 group/btn"
          >
            Lire la suite
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("Toutes");
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    newsService
      .getAll()
      .then((res) => setNews(res.data.data || []))
      .catch((err) => console.error("Erreur chargement actualités :", err))
      .finally(() => setLoading(false));
  }, []);

  const computedCategories = useMemo(() => {
    if (!news.length) return ["Toutes"];
    return ["Toutes", ...Array.from(new Set(news.map((n) => n.category)))];
  }, [news]);

  const filteredNews = useMemo(
    () =>
      activeFilter === "Toutes"
        ? news
        : news.filter((n) => n.category === activeFilter),
    [news, activeFilter],
  );

  const featuredArticle = useMemo(
    () => filteredNews.find((n) => n.featured),
    [filteredNews],
  );
  const secondaryArticles = useMemo(
    () =>
      filteredNews.filter((n) => !n.featured || filteredNews.indexOf(n) > 0),
    [filteredNews],
  );

  const selectedImageUrl =
    selectedArticle?.image?.url ?? selectedArticle?.image ?? null;

  return (
    <>
      <SEO
        title="Actualités"
        description="Suivez les dernières actualités de l'ONG Club Environnemental de Guinée (C.E.G)."
        keywords="actualités CEG Guinée, événements ONG environnement"
      />
      <MainLayout>
        <PageHero
          badge="Restez informé"
          bgImage="/ceg-bg-news.jpg"
          title="Actualités"
          subtitle="Découvrez les dernières nouvelles, événements et publications de l'ONG C.E.G."
          breadcrumb={["Accueil", "Actualités"]}
        />

        <section className="py-20 bg-gradient-to-tr from-slate-50 via-slate-100 to-green-50/40 min-h-screen relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* SKELETON */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-80 bg-white/40 animate-pulse rounded-3xl"
                  />
                ))}
              </div>
            )}

            {!loading && (
              <>
                {/* FILTRES */}
                <div className="flex flex-wrap gap-2.5 justify-center mb-16 p-3 bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl shadow-sm max-w-3xl mx-auto">
                  {computedCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveFilter(cat)}
                      className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        activeFilter === cat
                          ? "bg-green-600 text-white shadow-lg shadow-green-600/30 scale-105"
                          : "bg-white/50 hover:bg-white/90 text-slate-700 border border-white/20 backdrop-blur-sm"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {featuredArticle && (
                  <div className="mb-12">
                    <NewsCard
                      article={featuredArticle}
                      featured
                      onReadMore={setSelectedArticle}
                    />
                  </div>
                )}

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFilter}
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  >
                    {secondaryArticles.map((article) => (
                      <NewsCard
                        key={article._id}
                        article={article}
                        onReadMore={setSelectedArticle}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>

                {filteredNews.length === 0 && (
                  <div className="text-center py-20 text-gray-400 bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl">
                    <p className="text-lg font-medium">
                      Aucune actualité disponible dans cette catégorie.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* MODAL */}
        <AnimatePresence>
          {selectedArticle && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 20, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white/80 backdrop-blur-2xl border border-white/50 max-w-2xl w-full rounded-3xl p-6 md:p-8 shadow-2xl relative my-auto"
              >
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-5 right-5 p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                {selectedImageUrl && (
                  <img
                    src={selectedImageUrl}
                    alt={selectedArticle.title}
                    className="w-full h-48 object-cover rounded-2xl mb-4"
                  />
                )}
                <div className="space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wide text-green-600 bg-green-50 px-3 py-1 rounded-lg inline-block">
                    {selectedArticle.category}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-poppins font-black text-slate-900 leading-tight">
                    {selectedArticle.title}
                  </h2>
                  <div className="flex items-center gap-4 text-xs text-slate-500 py-2 border-y border-slate-100">
                    <span>
                      📅 {selectedArticle.displayDate || selectedArticle.date}
                    </span>
                    <span>✍️ {selectedArticle.author}</span>
                  </div>
                  <div className="text-slate-700 text-sm md:text-base leading-relaxed space-y-4 pt-2">
                    <p className="font-medium text-slate-900">
                      {selectedArticle.excerpt}
                    </p>
                    <p>{selectedArticle.content}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </MainLayout>
    </>
  );
}
