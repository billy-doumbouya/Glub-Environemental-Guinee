import { motion } from "framer-motion";
import { Leaf, Users, Heart, BookOpen } from "lucide-react";
import { staggerContainer, fadeUp, viewportConfig } from "../../animations/variants";

const iconMap = { leaf: Leaf, users: Users, heart: Heart, book: BookOpen };

export function DomainsIntroGrid({ domains }) {
  return (
    <section className="relative py-20 bg-white overflow-hidden">
      {/* Clip-path décoratif haut */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "120px",
          background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
          clipPath: "polygon(0 0, 100% 0, 100% 60%, 85% 100%, 50% 80%, 15% 100%, 0 60%)",
        }}
      />

      {/* Clip-path décoratif bas */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: "120px",
          background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
          clipPath: "polygon(0 40%, 15% 0, 50% 20%, 85% 0, 100% 40%, 100% 100%, 0 100%)",
        }}
      />

      {/* Orbe ambiant */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(22,163,74,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {domains.map((domain, i) => {
            const Icon = iconMap[domain.icon] || Leaf;
            // Clip différent par carte
            const cardClips = [
              "polygon(0 0, 100% 0, 100% 85%, 90% 100%, 0 100%)",
              "polygon(10% 0, 100% 0, 100% 100%, 0 100%, 0 15%)",
              "polygon(0 0, 90% 0, 100% 15%, 100% 100%, 0 100%)",
              "polygon(0 0, 100% 0, 100% 100%, 10% 100%, 0 85%)",
            ];

            return (
              <motion.a
                key={domain._id}
                href={`#${domain.slug}`}
                variants={fadeUp}
                className="group relative border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 text-center overflow-hidden"
                style={{
                  clipPath: cardClips[i % cardClips.length],
                  backgroundColor: domain.bgColor,
                  borderColor: `${domain.color}20`,
                  padding: "32px 24px",
                }}
              >
                {/* Fond décoratif hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${domain.color}15, ${domain.color}05)`,
                  }}
                />

                {/* Motif pointillé */}
                <div
                  className="absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage: `radial-gradient(circle, ${domain.color} 1px, transparent 1px)`,
                    backgroundSize: "16px 16px",
                  }}
                />

                <div className="relative z-10">
                  <div
                    className="w-14 h-14 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg"
                    style={{
                      backgroundColor: `${domain.color}20`,
                      clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    }}
                  >
                    <Icon className="w-7 h-7" style={{ color: domain.color }} />
                  </div>

                  <p className="font-poppins font-bold text-gray-900 text-sm leading-tight mb-2">
                    {domain.shortTitle}
                  </p>

                  <div
                    className="w-8 h-0.5 mx-auto mt-3 transition-all duration-300 group-hover:w-16"
                    style={{ background: domain.color }}
                  />
                </div>
              </motion.a>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}