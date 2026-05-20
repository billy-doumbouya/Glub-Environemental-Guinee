import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Tag, Filter, CheckCircle } from "lucide-react";
import { SEO } from "../seo/SEO";
import { MainLayout } from "../layouts/MainLayout";
import { PageHero } from "../components/common/PageHero";
import { projects } from "../data/projects";
import { staggerContainer, fadeUp } from "../animations/variants";

const categories = [
  "Tous",
  ...new Set(projects.map((p) => p.category).filter(Boolean)),
];

const statuses = {
  completed: {
    label: "Terminé",
    class: "bg-green-50 text-green-700 border-green-100",
  },
};

function ProjectCard({ project }) {
  const status = statuses[project.status] || {
    label: "Inconnu",
    class: "bg-gray-50 text-gray-600 border-gray-100",
  };
  return (
    <motion.article
      layout
      variants={fadeUp}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group"
    >
      {/* Image */}
      <div className="h-56 bg-gradient-to-br from-green-700 to-green-950 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-20">
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-5xl">
              🌿
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute top-4 left-4 flex gap-2">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full border ${status.class}`}
          >
            {status.label}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-white/30 font-medium">
            {project.funder}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="font-poppins font-bold text-white text-lg leading-tight">
            {project.title}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex flex-wrap gap-3 mb-4">
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <Calendar className="w-3 h-3" />
            {project.date}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <MapPin className="w-3 h-3" />
            {project.location}
          </span>
        </div>

        <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-3">
          {project.description}
        </p>

        {/* Results */}
        <div className="space-y-2 mb-5">
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Résultats clés
          </p>
          {project.results.slice(0, 2).map((r) => (
            <div key={r} className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
              <p className="text-gray-600 text-xs leading-relaxed">{r}</p>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-50">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-50 text-gray-500 px-3 py-1 rounded-full flex items-center gap-1"
            >
              <Tag className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}
        </div>

        {/* Budget */}
        <div className="mt-4 bg-green-50 rounded-xl px-4 py-2.5 flex items-center justify-between border border-green-100">
          <span className="text-xs text-gray-500">Budget du projet</span>
          <span className="text-sm font-bold text-green-700">
            {project.budget ? project.budget : "Non renseigné"}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState("Tous");

  const filtered =
    activeFilter === "Tous"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <>
      <SEO
        title="Projets réalisés"
        description="Découvrez les projets de l'ONG C.E.G en Guinée : reboisement, agriculture résiliente, leadership féminin, santé communautaire. Résultats concrets et mesurables."
        keywords="projets ONG Guinée, reboisement Forécariah, agriculture résiliente Guinée, leadership féminin Guinée, projets environnement CEG"
      />
      <MainLayout>
        <PageHero
          badge={`${projects.length} projets réalisés`}
          title="Nos Projets"
          subtitle="Des actions concrètes, mesurables et documentées pour l'environnement et les communautés de Guinée."
          breadcrumb={["Accueil", "Projets"]}
        />

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filters */}
            <div className="flex flex-wrap gap-3 justify-center mb-12">
              <Filter className="w-5 h-5 text-gray-400 self-center" />
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

            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8"
              >
                {filtered.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </motion.div>
            </AnimatePresence>

            {filtered.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                <p className="text-lg">Aucun projet dans cette catégorie.</p>
              </div>
            )}
          </div>
        </section>
      </MainLayout>
    </>
  );
}
