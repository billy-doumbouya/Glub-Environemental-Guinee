import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Calendar, FolderOpen, Users, Map, Globe, Heart } from "lucide-react";
import { statisticsService } from "../../api/services"; // ← adapte le chemin
import { useCounter } from "../hooks/useCounter";

const iconMap = {
  calendar: Calendar,
  folder: FolderOpen,
  users: Users,
  map: Map,
  globe: Globe,
  heart: Heart,
};

function StatItem({ stat, isVisible, index }) {
  const { count, startCounting } = useCounter(stat.value, 2000);
  const started = useRef(false);

  useEffect(() => {
    if (isVisible && !started.current) {
      started.current = true;
      setTimeout(() => startCounting(), index * 120);
    }
  }, [isVisible, startCounting, index]);

  const Icon = iconMap[stat.icon] || Globe;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.55,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative flex flex-col items-center text-center px-4 py-10
                 border-r border-white/10 last:border-r-0
                 md:[&:nth-child(3)]:border-r-0 lg:[&:nth-child(3)]:border-r
                 [&:nth-child(2)]:border-r-0 sm:[&:nth-child(2)]:border-r"
    >
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.03] rounded-xl transition-colors duration-500" />
      <div className="relative mb-5 w-12 h-12 rounded-2xl bg-green-400/10 border border-green-400/20 flex items-center justify-center group-hover:bg-green-400/20 group-hover:border-green-400/40 transition-all duration-300">
        <Icon className="w-5 h-5 text-green-400 shrink-0" />
      </div>
      <p className="font-poppins font-bold text-white text-4xl sm:text-5xl lg:text-6xl leading-none mb-3 tabular-nums">
        <span>{count.toLocaleString("fr-FR")}</span>
        <span className="text-green-400">{stat.suffix}</span>
      </p>
      <p className="text-green-300/70 text-sm leading-snug max-w-[120px]">
        {stat.label}
      </p>
    </motion.div>
  );
}

export function StatisticsSection() {
  const [statistics, setStatistics] = useState([]);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    statisticsService
      .getAll()
      .then((res) => setStatistics(res.data.data || []))
      .catch((err) => console.error("Erreur chargement statistiques :", err));
  }, []);

  return (
    <section ref={ref} className="relative bg-green-950 overflow-hidden py-6">
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400/40 to-transparent" />
      <div className="absolute -left-24 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-green-400/5 blur-3xl pointer-events-none" />
      <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-emerald-300/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-green-400/60 text-xs font-semibold tracking-[0.2em] uppercase mb-2"
        >
          Notre impact en chiffres
        </motion.p>

        {statistics.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-y divide-white/10 md:divide-y-0">
            {statistics.map((stat, i) => (
              <StatItem
                key={stat._id}
                stat={stat}
                isVisible={isInView}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
