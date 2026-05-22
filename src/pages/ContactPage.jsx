import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import { SEO } from "../seo/SEO";
import { MainLayout } from "../layouts/MainLayout";
import { PageHero } from "../components/common/PageHero";
import { ContactForm } from "../components/forms/ContactForm";
import { organization } from "../data/organization";
import { fadeLeft, fadeRight, viewportConfig } from "../animations/variants";

const socialLinks = [
  {
    href: organization.socialLinks.facebookPage,
    icon: FaFacebook,
    label: "Facebook Page",
    color: "bg-blue-50 text-blue-600 hover:bg-blue-100",
  },
  {
    href: organization.socialLinks.instagram,
    icon: FaInstagram,
    label: "Instagram",
    color: "bg-pink-50 text-pink-600 hover:bg-pink-100",
  },
  {
    href: organization.socialLinks.youtube,
    icon: FaYoutube,
    label: "YouTube",
    color: "bg-red-50 text-red-600 hover:bg-red-100",
  },
  {
    href: organization.socialLinks.tiktok,
    icon: FaTiktok,
    label: "TikTok",
    color: "bg-gray-50 text-gray-700 hover:bg-gray-100",
  },
];

function MapEmbed() {
  return (
    <div
      className="
        relative w-full
        rounded-3xl
        border border-gray-100
        shadow-lg
        bg-gradient-to-br from-green-50 to-emerald-50
        min-w-0
      "
      style={{ minHeight: "320px" }} // ← hauteur minimum, le contenu l'étend si besoin
    >
      {/* CONTENT */}
      <div className="flex flex-col items-center justify-center gap-3 px-4 py-6 text-center min-w-0">
        {/* PIN */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-600 rounded-full flex items-center justify-center shadow-lg animate-pulse shrink-0">
          <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>

        {/* TEXT BLOCK */}
        <div className="max-w-full min-w-0">
          <p className="font-poppins font-bold text-gray-800 text-sm sm:text-base break-words">
            Siège Social C.E.G
          </p>
          <p className="text-gray-500 text-xs sm:text-sm mt-1 break-words">
            Km 66 / Maléah Centre I
          </p>
          <p className="text-gray-500 text-xs sm:text-sm break-words">
            Préfecture de Forécariah, Guinée
          </p>
        </div>

        {/* BUTTON */}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${organization.coordinates.lat},${organization.coordinates.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="
            mt-2 inline-flex items-center gap-2
            bg-green-600 hover:bg-green-700
            text-white px-4 sm:px-5 py-2.5
            rounded-xl text-xs sm:text-sm font-semibold
            transition-colors shadow-md
            max-w-full
            truncate
          "
        >
          <MapPin className="w-4 h-4 shrink-0" />
          Ouvrir dans Google Maps
        </a>
      </div>

      {/* GRID BACKGROUND */}
      <div
        className="
          absolute inset-0 opacity-10 pointer-events-none rounded-3xl
        "
        style={{
          backgroundImage:
            "linear-gradient(#15803D 1px, transparent 1px), linear-gradient(90deg, #15803D 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      <SEO
        title="Contact"
        description="Contactez l'ONG Club Environnemental de Guinée (C.E.G) : partenariat, financement, bénévolat, presse. Siège à Forécariah, Guinée."
        keywords="contact CEG Guinée, contacter ONG environnement Guinée, partenariat CEG"
      />
      <MainLayout>
        <PageHero
          badge="Entrons en contact"
          title="Contactez C.E.G"
          subtitle="Partenariat, financement, bénévolat ou simple question — l'équipe C.E.G est à votre écoute."
          breadcrumb={["Accueil", "Contact"]}
        />

        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Gap réduite sur mobile */}
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-16">
              <motion.div
                variants={fadeLeft}
                initial="hidden"
                whileInView="visible"
                viewport={viewportConfig}
              >
                <h2 className="font-poppins font-bold text-2xl text-gray-900 mb-2">
                  Envoyer un message
                </h2>
                <p className="text-gray-500 text-sm mb-8">
                  Réponse garantie sous 48 heures ouvrables.
                </p>
                <ContactForm />
              </motion.div>

              <motion.div
                variants={fadeRight}
                initial="hidden"
                whileInView="visible"
                viewport={viewportConfig}
                className="space-y-8"
              >
                <div className="space-y-4">
                  {[
                    {
                      icon: MapPin,
                      color: "text-green-600",
                      bg: "bg-green-50",
                      label: "Adresse",
                      value: organization.headquarters,
                    },
                    {
                      icon: Phone,
                      color: "text-blue-600",
                      bg: "bg-blue-50",
                      label: "Téléphones",
                      value: organization.phones.join(" / "),
                    },
                    {
                      icon: Mail,
                      color: "text-amber-600",
                      bg: "bg-amber-50",
                      label: "Email officiel",
                      value: organization.email,
                    },
                    {
                      icon: Clock,
                      color: "text-purple-600",
                      bg: "bg-purple-50",
                      label: "Disponibilité",
                      value: "Lundi – Vendredi, 8h00 – 17h00",
                    },
                  ].map(({ icon: Icon, color, bg, label, value }) => (
                    <div
                      key={label}
                      className="flex items-start gap-4 bg-gray-50 rounded-2xl p-5 border border-gray-100"
                    >
                      <div
                        className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center shrink-0`}
                      >
                        <Icon className={`w-5 h-5 ${color}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                          {label}
                        </p>
                        {/* Gestion des longs textes (ex: adresse) */}
                        <p className="text-gray-800 text-sm font-medium break-words">
                          {value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <MapEmbed />

                <div>
                  <h3 className="font-poppins font-semibold text-gray-900 mb-4">
                    Suivez nos actions
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {socialLinks.map(({ href, icon: Icon, label, color }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-colors ${color} text-xs sm:text-sm font-medium min-w-0`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-green-50 border-t border-green-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-green-700 font-semibold text-sm break-words">
              ONG légalement reconnue — Agrément {organization.agreement}
            </p>
            <p className="text-green-600 text-xs mt-1 break-words">
              Créée le {organization.created} · Siège social à{" "}
              {organization.headquarters}
            </p>
          </div>
        </section>
      </MainLayout>
    </>
  );
}
