import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { NAV_LINKS } from "../../constants";

// ── NProgress couleur brand verte ────────────────────────────────────
NProgress.configure({ showSpinner: false, trickleSpeed: 200 });

// Injection du style brand une seule fois
if (typeof document !== "undefined" && !document.getElementById("nprogress-brand")) {
  const style = document.createElement("style");
  style.id = "nprogress-brand";
  style.textContent = `
    #nprogress .bar {
      background: #16a34a !important;
      height: 3px !important;
    }
    #nprogress .peg {
      box-shadow: 0 0 10px #16a34a, 0 0 5px #16a34a !important;
    }
  `;
  document.head.appendChild(style);
}

export function Navbar() {
  const [isOpen, setIsOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  const isHome        = pathname === "/";
  const isTransparent = !scrolled && isHome;

  // ── NProgress sur changement de route ────────────────────────────
  useEffect(() => {
    NProgress.start();
    const t = setTimeout(() => NProgress.done(), 300);
    setIsOpen(false);
    return () => {
      clearTimeout(t);
      NProgress.done();
    };
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg group-hover:shadow-green-200 transition-shadow">
              <img src="/logo.png" alt="C.E.G Logo" className="w-full h-full object-contain" />
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
                style={{ color: isTransparent ? "rgba(255,255,255,0.70)" : "#6b7280" }}
              >
                Club Environnemental de Guinée
              </p>
            </div>
          </Link>

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

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2 rounded-xl transition-all duration-200 ${
                isTransparent
                  ? "text-white hover:bg-white/10"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={isOpen}
            >
              <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden bg-white border-t border-gray-100 shadow-xl overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.path}
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
              ))}
              <div className="block w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl text-sm font-semibold mt-2 transition-colors duration-200">
                <Link to="/contact" className="flex items-center justify-center gap-4">
                  <Phone /> Nous contacter
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}