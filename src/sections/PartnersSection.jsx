import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { partnersService } from "../../api/services"; // ← adapte le chemin
import { SectionTitle } from "../components/common/SectionTitle";
import { staggerContainer, fadeUp, viewportConfig } from "../animations/variants";

function PartnerCard({ partner }) {
  const logoUrl = partner.logo?.url ?? partner.logo ?? null;

  return (
    <motion.div
      variants={fadeUp}
      className="group bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col"
    >
      <div className="h-20 flex items-center justify-center mb-6">
        <div
          className="h-16 w-32 overflow-hidden rounded-2xl flex items-center justify-center text-3xl font-black font-poppins shadow-inner"
          style={{ backgroundColor: `${partner.logoColor}15`, color: partner.logoColor }}
        >
          {logoUrl && (
            <img src={logoUrl} alt={`${partner.name} logo`} className="w-full max-w-full object-contain" />
          )}
        </div>
      </div>

      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 text-center block">
        {partner.category}
      </span>
      <h3 className="font-poppins font-bold text-gray-900 text-lg mb-1 text-center">{partner.name}</h3>
      <p className="text-gray-500 text-xs text-center mb-4">{partner.fullName}</p>
      <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-6 text-center">{partner.description}</p>

      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {(partner.domains || []).map((domain) => (
          <span key={domain} className="text-xs px-3 py-1 rounded-full"
            style={{ backgroundColor: `${partner.logoColor}10`, color: partner.logoColor }}>
            {domain}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <span className="text-xs text-gray-400">
          Partenaire depuis <strong className="text-gray-600">{partner.since}</strong>
        </span>
        {partner.website && (
          <a href={partner.website} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold transition-colors"
            style={{ color: partner.logoColor }}>
            Site web <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </motion.div>
  );
}

export function PartnersSection() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    partnersService.getAll()
      .then((res) => setPartners(res.data.data || []))
      .catch((err) => console.error("Erreur chargement partenaires :", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Nos partenaires de confiance"
          title="Partenaires Financiers"
          subtitle="L'ONG C.E.G bénéficie du soutien de partenaires financiers internationaux, gage de sérieux et de crédibilité de nos actions sur le terrain."
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {partners.map((partner) => (
              <PartnerCard key={partner._id} partner={partner} />
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportConfig}
          className="mt-16 bg-green-50 rounded-3xl p-8 border border-green-100 text-center"
        >
          <p className="font-poppins font-bold text-gray-900 text-xl mb-3">
            Vous souhaitez devenir partenaire ?
          </p>
          <p className="text-gray-500 mb-6 max-w-xl mx-auto text-sm">
            Rejoignez notre réseau de partenaires engagés pour la protection de l'environnement et le développement durable en Guinée.
          </p>
          <a href="/contact"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg">
            Discutons d'un partenariat
          </a>
        </motion.div>
      </div>
    </section>
  );
}