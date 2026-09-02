import { useState, useEffect, useCallback } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import { NAV_LINKS } from "../../constants";
import { useNProgress } from "../../utils/useNProgress ";

// Son UI léger via Web Audio API — zéro fichier, zéro lib
function playMenuSound(type = "open") {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    // Bruit blanc = son de tissu/drap
    const bufferSize = ctx.sampleRate * 0.25; // 250ms de bruit
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1; // bruit blanc pur
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    // Filtre passe-bande → donne la texture "tissu" (ni trop aigu ni trop grave)
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = type === "open" ? 1800 : 1200;
    filter.Q.value = 0.8;

    // Enveloppe : attaque rapide, extinction progressive
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.03); // attaque
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22); // extinction

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    source.start(ctx.currentTime);
    source.stop(ctx.currentTime + 0.25);
  } catch (_) {
    // Navigateur sans AudioContext : silence
  }
}
// Variants stagger pour les items du menu mobile
const menuVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.22, ease: "easeOut", staggerChildren: 0.055 },
  },
  exit: { opacity: 0, height: 0, transition: { duration: 0.18 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 320, damping: 24 },
  },
};

export function Navbar() {
  useNProgress();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isHome = pathname === "/";
  const isTransparent = !scrolled && isHome;

  const handleLogoClick = useCallback(() => {
    setLogoClicks((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        setTimeout(() => {
          navigate("/admin/login");
        }, 100);
        return 0;
      }
      return next;
    });
  }, [navigate]);

  // FIX 1 — Fermeture automatique au changement de route
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // FIX 2 — onPointerDown : réponse instantanée sans attendre le tap delay
  const handleToggle = useCallback(() => {
    setIsOpen((prev) => {
      playMenuSound(prev ? "close" : "open");
      return !prev;
    });
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent"
          : "bg-white/95 backdrop-blur-md shadow-lg border-b border-green-50"
      }`}
    >
      <nav className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            type="button"
            onClick={handleLogoClick}
            className="flex items-center gap-3 group bg-transparent border-0 p-0 text-left"
            aria-label="Logo ONG C.E.G"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg group-hover:shadow-green-200 transition-shadow">
              <img
                src="/logo.png"
                fetchPriority="high"
                alt="C.E.G Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <p
                className="font-bold text-sm leading-tight font-poppins transition-colors duration-300"
                style={{ color: isTransparent ? "#fff" : "#166534" }}
              >
                ONG C.E.G
              </p>
              <p
                className="text-xs leading-tight transition-colors duration-300"
                style={{
                  color: isTransparent ? "rgba(255,255,255,0.70)" : "#6b7280",
                }}
              >
                Club Environnemental de Guinée
              </p>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? isTransparent
                        ? "bg-white/15 text-white font-semibold"
                        : "bg-green-50 text-green-700 font-semibold"
                      : isTransparent
                        ? "text-white/85 hover:text-white hover:bg-white/10"
                        : "text-gray-700 hover:text-green-700 hover:bg-green-50"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-3">
            <Link
              to="/contact"
              className="hidden lg:inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-green-200"
            >
              Nous contacter
            </Link>

            {/* FIX 2 — onPointerDown au lieu de onClick */}
            <motion.button
              onPointerDown={handleToggle}
              className={`lg:hidden p-2 rounded-xl transition-all duration-200 touch-manipulation ${
                isTransparent
                  ? "text-white hover:bg-white/10"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              whileTap={{ scale: 0.88 }}
              aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={isOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu — FIX 3 : stagger + son */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="lg:hidden bg-white border-t border-gray-100 shadow-xl overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <motion.div key={link.path} variants={itemVariants}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-green-50 text-green-700 font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}

              <motion.div variants={itemVariants}>
                <Link
                  to="/contact"
                  className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl text-sm font-semibold mt-2 transition-colors duration-200"
                >
                  <Phone className="w-4 h-4" /> Nous contacter
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
