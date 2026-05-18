import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { organization } from "../data/organization";
import { SectionTitle } from "../components/common/SectionTitle";
import { fadeLeft, fadeRight, viewportConfig } from "../animations/variants";

const highlights = [
  "Agrément officiel du Ministère de l'Administration",
  "Partenaire reconnu du GEF, PNUD et SGP",
  "Interventions dans 8 préfectures guinéennes",
  "Plus de 12 000 bénéficiaires directs depuis 2016",
];

export function AboutPreviewSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left visual */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-br from-green-700 to-green-950 h-96 flex items-center justify-center relative">
                <div className="absolute inset-0 flex items-center justify-center opacity-10 text-9xl">
                  🌍
                </div>
                <div className="relative text-center text-white p-8">
                  <p className="font-poppins font-bold text-5xl mb-2">
                    ONG C.E.G
                  </p>
                  <p className="text-green-200 text-sm uppercase tracking-widest">
                    Club Environnemental de Guinée
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <p className="font-bold text-2xl">2016</p>
                      <p className="text-green-200 text-xs">
                        Année de création
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <p className="font-bold text-2xl">Forécariah</p>
                      <p className="text-green-200 text-xs">Siège social</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Floating agrément card */}
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-4 right-4 md:-bottom-6 md:-right-6 bg-white rounded-2xl shadow-xl p-5 border border-green-50"
            >
              <p className="text-xs text-gray-500 mb-1">Agrément officiel</p>
              <p className="font-bold text-green-700 text-sm">
                {organization.agreement}
              </p>
            </motion.div>
          </motion.div>

          {/* Right content */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-green-100">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />À propos
              de l'ONG C.E.G
            </span>
            <h2 className="font-poppins font-bold text-4xl text-gray-900 mb-6 leading-tight">
              Une ONG engagée pour{" "}
              <span className="text-gradient">l'environnement guinéen</span>
            </h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              {organization.mission}
            </p>
            <p className="text-gray-500 leading-relaxed mb-8">
              Créée le {organization.created}, l'ONG C.E.G intervient dans 4
              domaines stratégiques pour réconcilier la protection de
              l'environnement avec le développement humain durable en Guinée.
            </p>
            <ul className="space-y-3 mb-8">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-gray-600 text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/a-propos"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-green-200"
            >
              En savoir plus sur ONG C.E.G
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
