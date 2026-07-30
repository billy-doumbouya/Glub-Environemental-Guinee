import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Leaf, Users, Heart, BookOpen, ArrowRight, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionTitle } from "../components/common/SectionTitle";
import {
  staggerContainer,
  fadeUp,
  viewportConfig,
} from "../animations/variants";
import { domainsService } from "../../api/services";

// Mapping des icônes avec fallbacks
const iconMap = {
  leaf: Leaf,
  users: Users,
  heart: Heart,
  book: BookOpen,
  bookopen: BookOpen,
  shield: Shield,
};

function DomainCard({ domain, index }) {
  // Sécurisation de la clé d'icône (ex: "Leaf" -> "leaf")
  const iconKey = domain.icon ? String(domain.icon).toLowerCase() : "leaf";
  const Icon = iconMap[iconKey] || Leaf;

  // Couleurs fallback au cas où l'API ne renvoie pas de couleur
  const mainColor = domain.color || "#16A34A";
  const bgColor = domain.bgColor || "#F0FDF4";

  return (
    <motion.div
      variants={fadeUp}
      className="group relative bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-transparent transition-all duration-300 overflow-hidden flex flex-col justify-between h-full"
    >
      {/* Background Hover Gradient */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${bgColor}, #FFFFFF)`,
        }}
      />

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Conteneur de l'icône */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300 shrink-0"
          style={{ backgroundColor: bgColor }}
        >
          <Icon className="w-7 h-7" style={{ color: mainColor }} />
        </div>

        {/* Index du domaine */}
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 block">
          Domaine {String(index + 1).padStart(2, "0")}
        </span>

        {/* Titre */}
        <h3 className="font-poppins font-bold text-xl text-gray-900 mb-3 leading-tight">
          {domain.title}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
          {domain.description}
        </p>

        {/* Tags d'activités */}
        {domain.activities && domain.activities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 mt-auto">
            {domain.activities.slice(0, 2).map((activity, actIdx) => (
              <span
                key={`${domain._id}-act-${actIdx}`}
                className="text-xs px-3 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-100 font-medium"
              >
                {activity}
              </span>
            ))}
          </div>
        )}

        {/* Lien En savoir plus */}
        <Link
          to={`/domaines#${domain._id || index}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200 mt-auto pt-2"
          style={{ color: mainColor }}
        >
          Voir plus
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}

export function DomainsSection() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    domainsService
      .getAll()
      .then((res) => {
        if (isMounted) {
          setDomains(res.data?.data || res.data || []);
        }
      })
      .catch((err) => {
        console.error("Erreur chargement domaines :", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Nos 4 piliers d'action"
          title="Domaines d'intervention"
          subtitle="ONG C.E.G agit sur quatre axes stratégiques complémentaires pour un impact durable sur les communautés et l'environnement guinéen."
        />

        {/* Skeleton Loader */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-80 bg-gray-200/60 animate-pulse rounded-3xl"
              />
            ))}
          </div>
        ) : domains.length === 0 ? (
          /* State si aucun domaine dans la BDD */
          <div className="text-center py-12 text-gray-500 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-base font-medium">
              Aucun domaine d'intervention à afficher pour le moment.
            </p>
          </div>
        ) : (
          <>
            {/* Grille des Domaines */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {domains.map((domain, i) => (
                <DomainCard
                  key={domain._id || `domain-${i}`}
                  domain={domain}
                  index={i}
                />
              ))}
            </motion.div>

            {/* Bouton vers la page détaillée */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportConfig}
              className="text-center mt-12"
            >
              <Link
                to="/domaines"
                className="inline-flex items-center gap-2 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
              >
                Explorer tous nos domaines
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
