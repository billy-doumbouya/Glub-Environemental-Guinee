import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import { testimonialsService } from "../../api/services"; // ← adapte le chemin
import { SectionTitle } from "../components/common/SectionTitle";
import {
  staggerContainer,
  fadeUp,
  viewportConfig,
} from "../animations/variants";

function TestimonialCard({ testimonial }) {
  const avatarUrl = testimonial.avatar?.url ?? testimonial.avatar ?? null;

  return (
    <motion.div
      variants={fadeUp}
      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 flex flex-col"
    >
      <Quote className="w-8 h-8 text-green-300 mb-6" />
      <p className="text-gray-200 leading-relaxed flex-1 mb-8 italic">
        "{testimonial.content}"
      </p>
      <div className="flex items-center gap-4">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={testimonial.name}
            className="w-12 h-12 rounded-2xl object-cover"
          />
        ) : (
          <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center text-white font-bold font-poppins text-lg">
            {testimonial.name?.charAt(0)}
          </div>
        )}
        <div className="flex-1">
          <p className="font-semibold text-white">{testimonial.name}</p>
          <p className="text-green-300 text-sm">{testimonial.role}</p>
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
            <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testimonialsService
      .getAll()
      .then((res) => setTestimonials(res.data.data || []))
      .catch((err) => console.error("Erreur chargement témoignages :", err))
      .finally(() => setLoading(false));
  }, []);

  const videoSrc =
    "https://www.youtube.com/embed/4Aah5mnX5hM?autoplay=1&mute=1&loop=1&playlist=4Aah5mnX5hM&controls=0&modestbranding=1&rel=0";

  return (
    <section className="py-24 bg-gradient-to-br from-green-900 via-green-800 to-green-950 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-10 right-20 w-64 h-64 bg-green-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-20 w-72 h-72 bg-green-300/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Ce que disent les bénéficiaires"
          title="Témoignages du terrain"
          subtitle="Des voix authentiques des communautés qui vivent l'impact de nos actions au quotidien."
          light
        />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-3 sm:p-4 shadow-2xl relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-500" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3 text-green-300/80 text-xs font-medium tracking-wider uppercase px-2">
                <FaYoutube className="w-3.5 h-3.5 text-red-500/90" />
                <span>Aperçu de nos actions sur le terrain</span>
              </div>
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black/40">
                <div className="absolute inset-0 z-10 bg-transparent pointer-events-none" />
                <iframe
                  src={videoSrc}
                  title="ONG C.E.G - Actions Terrain"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  className="absolute top-0 left-0 w-full h-full scale-[1.02]"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-white/10 animate-pulse rounded-3xl"
              />
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
            {testimonials.map((t) => (
              <TestimonialCard key={t._id} testimonial={t} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
