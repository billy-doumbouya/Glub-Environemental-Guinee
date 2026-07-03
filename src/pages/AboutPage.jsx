import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Target, Eye, Heart, CheckCircle, Flag, Award } from "lucide-react";
import { SEO } from "../seo/SEO";
import { MainLayout } from "../layouts/MainLayout";
import { PageHero } from "../components/common/PageHero";
import { SectionTitle } from "../components/common/SectionTitle";
import { organization } from "../data/organization"; // ← conservé (données statiques fixes)
import { timelineService } from "../../api/services"; // ← adapte le chemin
import { staggerContainer, fadeUp, fadeLeft, fadeRight, viewportConfig } from "../animations/variants";
import { usePageBackgrounds } from "../hooks/usePageBackgrounds ";

const iconMap = {
  flag: Flag, check: CheckCircle, handshake: Heart,
  expand: Target, award: Award, rocket: Target,
};

function TimelineItem({ item, index }) {
  const Icon = iconMap[item.icon] || Flag;
  const isLeft = index % 2 === 0;

  return (
    <div className={`flex items-center gap-8 ${isLeft ? "flex-row" : "flex-row-reverse"} mb-12`}>
      <motion.div variants={fadeUp} className={`flex-1 ${isLeft ? "text-right" : "text-left"}`}>
        <div className={`inline-block bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 max-w-sm ${isLeft ? "ml-auto" : "mr-auto"}`}>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{item.year}</span>
          <h3 className="font-poppins font-bold text-gray-900 text-lg mt-1 mb-2">{item.title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
        </div>
      </motion.div>
      <div className="shrink-0 flex flex-col items-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: item.color }}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="font-poppins font-black text-2xl mt-2" style={{ color: item.color }}>{item.year}</div>
      </div>
      <div className="flex-1" />
    </div>
  );
}

export default function AboutPage() {
  const { backgrounds } = usePageBackgrounds();
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    timelineService.getAll()
      .then((res) => setTimeline(res.data.data || []))
      .catch((err) => console.error("Erreur chargement timeline :", err));
  }, []);

  return (
    <>
      <SEO
        title="À Propos"
        description="Découvrez l'histoire, la vision, la mission et les objectifs de l'ONG Club Environnemental de Guinée (C.E.G), fondée en 2016 à Forécariah."
        keywords="à propos CEG, histoire ONG Guinée, vision mission développement durable, Club Environnemental Guinée fondation"
      />
      <MainLayout>
        <PageHero
          badge="Notre histoire depuis 2016"
          bgImage={backgrounds["about-hero"] || "/ceg-bg-about.jpg"}
          title="À Propos de C.E.G"
          subtitle="Découvrez l'organisation, ses valeurs et son engagement pour l'environnement et le développement durable en Guinée."
          breadcrumb={["Accueil", "À Propos"]}
        />

        {/* Vision Mission Objectif */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle
              badge="Notre identité"
              title="Vision, Mission & Objectifs"
              subtitle="Les piliers fondateurs qui guident chaque action de l'ONG C.E.G sur le terrain."
            />
            <motion.div
              variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportConfig}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                { icon: Eye,    color: "#15803D", bg: "#F0FDF4", title: "Notre Vision",   content: organization.vision },
                { icon: Target, color: "#2563EB", bg: "#EFF6FF", title: "Notre Mission",  content: organization.mission },
                { icon: Heart,  color: "#F59E0B", bg: "#FFFBEB", title: "Notre Objectif", content: organization.objective },
              ].map(({ icon: Icon, color, bg, title, content }) => (
                <motion.div key={title} variants={fadeUp}
                  className="rounded-3xl p-8 border transition-all duration-300 hover:shadow-lg"
                  style={{ backgroundColor: bg, borderColor: `${color}20` }}
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: `${color}20` }}>
                    <Icon className="w-7 h-7" style={{ color }} />
                  </div>
                  <h3 className="font-poppins font-bold text-xl text-gray-900 mb-4">{title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{content}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Infos institutionnelles */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80')" }} aria-hidden="true" />
          <div className="absolute inset-0 bg-white/88" aria-hidden="true" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div variants={fadeLeft} initial="hidden" whileInView="visible" viewport={viewportConfig}>
                <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-green-100">
                  Informations institutionnelles
                </span>
                <h2 className="font-poppins font-bold text-4xl text-gray-900 mb-8 leading-tight">
                  Une organisation <span className="text-gradient">légitime et reconnue</span>
                </h2>
                <div className="space-y-5">
                  {[
                    { label: "Nom complet",       value: organization.fullName },
                    { label: "Date de création",  value: organization.created },
                    { label: "Numéro d'agrément", value: organization.agreement },
                    { label: "Siège social",      value: organization.headquarters },
                    { label: "Contact principal", value: organization.phones[0] },
                    { label: "Email officiel",    value: organization.email },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex gap-4 items-start bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-100">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">{label}</p>
                        <p className="text-gray-800 font-semibold text-sm">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={fadeRight} initial="hidden" whileInView="visible" viewport={viewportConfig}
                className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[520px]"
              >
                <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/ceg-bg-about.jpg')" }} aria-hidden="true" />
                <div className="absolute inset-0 bg-gradient-to-t from-green-950/95 via-green-900/70 to-green-800/30" aria-hidden="true" />
                <div className="relative z-10 p-10 flex flex-col justify-end h-full min-h-[520px]">
                  <h3 className="font-poppins font-bold text-2xl text-white mb-6">Zones d'intervention</h3>
                  <div className="space-y-3">
                    {["Préfecture de Forécariah","Préfecture de Dabola","Préfecture de Boké","Préfecture de Conakry","Préfecture de Kouroussa","Préfecture de Boffa","Région de Kankan"].map((zone) => (
                      <div key={zone} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-300 shrink-0" />
                        <span className="text-green-100 text-sm">{zone}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                    <p className="text-green-200 text-xs uppercase tracking-wider mb-1">Impact total</p>
                    <p className="font-poppins font-bold text-3xl text-white">7 Préfectures</p>
                    <p className="text-green-300 text-sm mt-1">couverts en République de Guinée</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle
              badge="Notre parcours"
              title="Historique de l'ONG C.E.G"
              subtitle="De la création en 2016 à aujourd'hui, retracez les étapes clées de l'ONG Club Environnemental de Guinée."
            />
            <motion.div
              variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportConfig}
              className="relative"
            >
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-100 -translate-x-1/2 hidden md:block" />
              {timeline.map((item, i) => (
                <TimelineItem key={item._id} item={item} index={i} />
              ))}
            </motion.div>
          </div>
        </section>
      </MainLayout>
    </>
  );
}