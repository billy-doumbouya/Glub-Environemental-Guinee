import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import { SEO } from "../seo/SEO";
import { MainLayout } from "../layouts/MainLayout";
import { PageHero } from "../components/common/PageHero";
import { ContactForm } from "../components/forms/ContactForm";
import { organization } from "../data/organization";
import { fadeLeft, fadeRight, viewportConfig } from "../animations/variants";

// ─── Animation variants ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const contactItems = [
  {
    icon: MapPin,
    accent: "#16a34a",
    label: "Adresse",
    getValue: () => organization.headquarters,
  },
  {
    icon: Phone,
    accent: "#2563eb",
    label: "Téléphones",
    getValue: () => organization.phones.join(" · "),
  },
  {
    icon: Mail,
    accent: "#d97706",
    label: "Email officiel",
    getValue: () => organization.email,
  },
  {
    icon: Clock,
    accent: "#7c3aed",
    label: "Disponibilité",
    getValue: () => "Lun – Ven, 8h00 – 17h00",
  },
];

const socialLinks = [
  {
    href: organization.socialLinks.facebookPage,
    icon: FaFacebook,
    label: "Facebook",
    bg: "rgba(37,99,235,0.08)",
    border: "rgba(37,99,235,0.18)",
    color: "#2563eb",
  },
  {
    href: organization.socialLinks.instagram,
    icon: FaInstagram,
    label: "Instagram",
    bg: "rgba(219,39,119,0.08)",
    border: "rgba(219,39,119,0.18)",
    color: "#db2777",
  },
  {
    href: organization.socialLinks.youtube,
    icon: FaYoutube,
    label: "YouTube",
    bg: "rgba(220,38,38,0.08)",
    border: "rgba(220,38,38,0.18)",
    color: "#dc2626",
  },
  {
    href: organization.socialLinks.tiktok,
    icon: FaTiktok,
    label: "TikTok",
    bg: "rgba(0,0,0,0.06)",
    border: "rgba(0,0,0,0.10)",
    color: "#111827",
  },
];

// ─── Map placeholder ──────────────────────────────────────────────────────────
function MapEmbed() {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-green-100 bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#15803D 1px, transparent 1px), linear-gradient(90deg, #15803D 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative flex flex-col items-center justify-center gap-4 px-6 py-10 text-center">
        {/* Animated pin */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-green-400/30 animate-ping" />
          <div className="relative w-14 h-14 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
            <MapPin className="w-7 h-7 text-white" />
          </div>
        </div>

        <div>
          <p className="font-poppins font-bold text-gray-800 text-base">
            Siège Social C.E.G
          </p>
          <p className="text-gray-500 text-sm mt-1">Km 66 / Maléah Centre I</p>
          <p className="text-gray-500 text-sm">
            Préfecture de Forécariah, Guinée
          </p>
        </div>

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${organization.coordinates.lat},${organization.coordinates.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md"
        >
          <MapPin className="w-4 h-4 shrink-0" />
          Ouvrir dans Google Maps
          <ArrowRight className="w-4 h-4 shrink-0 opacity-70" />
        </a>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
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
          bgImage="/ceg-bg-contact.jpg"
          title="Contactez C.E.G"
          subtitle="Partenariat, financement, bénévolat ou simple question — l'équipe C.E.G est à votre écoute."
          breadcrumb={["Accueil", "Contact"]}
        />

        {/* ── MAIN SECTION ── */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-20">
              {/* ── LEFT : form ── */}
              <motion.div
                variants={fadeLeft}
                initial="hidden"
                whileInView="visible"
                viewport={viewportConfig}
              >
                {/* Section header */}
                <div className="mb-8">
                  <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-green-700 mb-3">
                    <span className="w-4 h-px bg-green-500 inline-block" />
                    Message direct
                  </span>
                  <h2 className="font-poppins font-bold text-2xl sm:text-3xl text-gray-900 mb-2 leading-tight">
                    Écrivez-nous
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Réponse garantie sous{" "}
                    <span className="font-semibold text-gray-600">
                      48 heures ouvrables.
                    </span>
                  </p>
                </div>

                {/* Form wrapper with subtle card */}
                <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-5 sm:p-7">
                  <ContactForm />
                </div>
              </motion.div>

              {/* ── RIGHT : infos + map + social ── */}
              <motion.div
                variants={fadeRight}
                initial="hidden"
                whileInView="visible"
                viewport={viewportConfig}
              >
                {/* Section header */}
                <div className="mb-8">
                  <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-green-700 mb-3">
                    <span className="w-4 h-px bg-green-500 inline-block" />
                    Coordonnées
                  </span>
                  <h2 className="font-poppins font-bold text-2xl sm:text-3xl text-gray-900 leading-tight">
                    Nous trouver
                  </h2>
                </div>

                {/* Contact items */}
                <motion.div
                  variants={stagger}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportConfig}
                  className="grid sm:grid-cols-2 gap-3 mb-6"
                >
                  {contactItems.map(
                    ({ icon: Icon, accent, label, getValue }) => (
                      <motion.div
                        key={label}
                        variants={fadeUp}
                        className="flex items-start gap-3 rounded-2xl border bg-white p-4"
                        style={{ borderColor: "rgba(0,0,0,0.07)" }}
                      >
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: `${accent}14` }}
                        >
                          <Icon className="w-4 h-4" style={{ color: accent }} />
                        </div>
                        <div className="min-w-0">
                          <p
                            className="text-[10px] font-bold uppercase tracking-widest mb-1"
                            style={{ color: accent }}
                          >
                            {label}
                          </p>
                          <p className="text-gray-700 text-xs sm:text-sm font-medium leading-snug break-words">
                            {getValue()}
                          </p>
                        </div>
                      </motion.div>
                    ),
                  )}
                </motion.div>

                {/* Map */}
                <div className="mb-6">
                  <MapEmbed />
                </div>

                {/* Social links */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                    Suivez nos actions
                  </p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {socialLinks.map(
                      ({ href, icon: Icon, label, bg, border, color }) => (
                        <a
                          key={label}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
                          style={{ background: bg, borderColor: border, color }}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          <span>{label}</span>
                        </a>
                      ),
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── FOOTER STRIP ── */}
        <section className="py-10 border-t border-green-100 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <p className="text-green-800 font-semibold text-sm">
                ONG légalement reconnue — Agrément {organization.agreement}
              </p>
            </div>
            <p className="text-green-600 text-xs">
              Créée le {organization.created} · Siège social à{" "}
              {organization.headquarters}
            </p>
          </div>
        </section>
      </MainLayout>
    </>
  );
}
