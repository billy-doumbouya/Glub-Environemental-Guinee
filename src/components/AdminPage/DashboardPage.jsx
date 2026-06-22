// src/pages/DashboardPage.jsx
// Page d'accueil du dashboard avec statistiques rapides

import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Remplacement de <a> pour de meilleures performances SPA
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Card } from "../ui";
import { newsService, partnersService, projectsService, statisticsService } from "../../../api/services";

const QUICK_LINKS = [
  { path: "/admin/projets", label: "Gérer les projets", icon: "📋", color: "#15803D" },
  { path: "/admin/actualites", label: "Gérer les actualités", icon: "📰", color: "#2563EB" },
  { path: "/admin/galerie", label: "Gérer la galerie", icon: "🖼️", color: "#7C3AED" },
  { path: "/admin/partenaires", label: "Gérer les partenaires", icon: "🤝", color: "#D97706" },
  { path: "/admin/temoignages", label: "Gérer les témoignages", icon: "💬", color: "#DC2626" },
  { path: "/admin/statistiques", label: "Gérer les statistiques", icon: "📊", color: "#0891B2" },
  { path: "/admin/domaines", label: "Gérer les domaines", icon: "🌿", color: "#059669" },
  { path: "/admin/timeline", label: "Gérer la timeline", icon: "📅", color: "#6B7280" },
];

export default function DashboardPage() {
  const [counts, setCounts] = useState({ projects: 0, news: 0, partners: 0, stats: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    // Gestion du responsive adaptatif pour le conteneur global
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);

    Promise.allSettled([
      projectsService.getAll(),
      newsService.getAll(),
      partnersService.getAll(),
      statisticsService.getAll(),
    ]).then(([p, n, pa, s]) => {
      setCounts({
        projects: p.status === "fulfilled" ? p.value.data.total : 0,
        news: n.status === "fulfilled" ? n.value.data.total : 0,
        partners: pa.status === "fulfilled" ? pa.value.data.data?.length : 0,
        stats: s.status === "fulfilled" ? s.value.data.data?.length : 0,
      });
    });

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <DashboardLayout>
      <div style={{ padding: isMobile ? "16px" : "32px" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ margin: 0, fontSize: isMobile ? "22px" : "26px", fontWeight: "700", color: "#111827" }}>
            Bonjour 👋 M. Koly Doré
          </h1>
          <p style={{ margin: "6px 0 0", color: "#6B7280", fontSize: isMobile ? "14px" : "16px" }}>
            Bienvenue dans le dashboard de gestion du site ONG C.E.G
          </p>
        </div>

        {/* Stats rapides - Grille fluide responsive */}
        <div 
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
            gap: "16px", 
            marginBottom: "32px" 
          }}
        >
          {[
            { label: "Projets", value: counts.projects, icon: "📋", color: "#15803D" },
            { label: "Actualités", value: counts.news, icon: "📰", color: "#2563EB" },
            { label: "Partenaires", value: counts.partners, icon: "🤝", color: "#D97706" },
            { label: "Statistiques", value: counts.stats, icon: "📊", color: "#7C3AED" },
          ].map((stat) => (
            <Card key={stat.label} style={{ textAlign: "center", padding: "20px" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>{stat.icon}</div>
              <div style={{ fontSize: "28px", fontWeight: "700", color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: "14px", color: "#6B7280" }}>{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Accès rapides */}
        <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111827", marginBottom: "16px" }}>
          Accès rapides
        </h2>
        
        {/* Grille adaptative pour les liens */}
        <div 
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", 
            gap: "12px" 
          }}
        >
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                display: "flex", 
                flexDirection: isMobile ? "column" : "row",
                alignItems: "center", 
                justifyContent: isMobile ? "center" : "flex-start",
                gap: "10px",
                padding: "16px", 
                background: "white", 
                borderRadius: "10px",
                textDecoration: "none", 
                color: "#111827",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                border: `2px solid transparent`,
                transition: "all 0.2s",
                fontSize: "14px", 
                fontWeight: "500",
                textAlign: isMobile ? "center" : "left"
              }}
            >
              <span style={{ fontSize: "22px" }}>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Lien site public - Adaptabilité des flex-wrap pour les petits écrans */}
        <div 
          style={{ 
            marginTop: "32px", 
            padding: "16px", 
            background: "#F0FDF4", 
            borderRadius: "10px", 
            border: "1px solid #86EFAC",
            display: "flex",
            flexWrap: "wrap",
            gap: "4px"
          }}
        >
          <span style={{ color: "#15803D", fontWeight: "600", fontSize: "14px" }}>🌐 Site public : </span>
          <a 
            href="https://www.clubenvironnementaldeguinee.org" 
            target="_blank" 
            rel="noreferrer"
            style={{ color: "#15803D", fontSize: "14px", wordBreak: "break-all" }}
          >
            www.clubenvironnementaldeguinee.org
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}