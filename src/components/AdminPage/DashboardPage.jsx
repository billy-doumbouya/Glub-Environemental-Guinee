// src/pages/DashboardPage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import {
  newsService,
  partnersService,
  projectsService,
  statisticsService,
} from "../../../api/services";

// ── Data ──────────────────────────────────────────────────────────
const MONTHLY_DATA = [
  { month: "Jan", projets: 3, actualites: 5, partenaires: 1 },
  { month: "Fév", projets: 5, actualites: 8, partenaires: 2 },
  { month: "Mar", projets: 4, actualites: 6, partenaires: 1 },
  { month: "Avr", projets: 7, actualites: 9, partenaires: 3 },
  { month: "Mai", projets: 6, actualites: 7, partenaires: 2 },
  { month: "Jun", projets: 8, actualites: 11, partenaires: 3 },
];

const DOMAINES_DATA = [
  { name: "Environnement", value: 40 },
  { name: "Éducation", value: 25 },
  { name: "Reboisement", value: 20 },
  { name: "Autre", value: 15 },
];
const DOMAINES_COLORS = ["#4ade80", "#34d399", "#a3e635", "#fbbf24"];

const QUICK_LINKS = [
  {
    path: "/admin/projets",
    label: "Projets",
    icon: "ti-clipboard-list",
    color: "rgba(34,197,94,0.15)",
    iconColor: "#4ade80",
  },
  {
    path: "/admin/actualites",
    label: "Actualités",
    icon: "ti-news",
    color: "rgba(59,130,246,0.15)",
    iconColor: "#60a5fa",
  },
  {
    path: "/admin/galerie",
    label: "Galerie",
    icon: "ti-photo",
    color: "rgba(168,85,247,0.15)",
    iconColor: "#c084fc",
  },
  {
    path: "/admin/partenaires",
    label: "Partenaires",
    icon: "ti-handshake",
    color: "rgba(245,158,11,0.15)",
    iconColor: "#fbbf24",
  },
  {
    path: "/admin/temoignages",
    label: "Témoignages",
    icon: "ti-message-dots",
    color: "rgba(220,38,38,0.15)",
    iconColor: "#f87171",
  },
  {
    path: "/admin/statistiques",
    label: "Statistiques",
    icon: "ti-chart-bar",
    color: "rgba(8,145,178,0.15)",
    iconColor: "#38bdf8",
  },
  {
    path: "/admin/domaines",
    label: "Domaines",
    icon: "ti-plant",
    color: "rgba(5,150,105,0.15)",
    iconColor: "#34d399",
  },
  {
    path: "/admin/timeline",
    label: "Timeline",
    icon: "ti-calendar-event",
    color: "rgba(107,114,128,0.15)",
    iconColor: "#9ca3af",
  },
];

// ── Styles ────────────────────────────────────────────────────────
const glass = {
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 16,
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
};

// ── Custom tooltip ────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "rgba(13,61,34,0.95)",
        border: "1px solid rgba(74,222,128,0.2)",
        borderRadius: 10,
        padding: "8px 12px",
        fontSize: 12,
      }}
    >
      <div style={{ color: "rgba(240,253,244,0.6)", marginBottom: 4 }}>
        {label}
      </div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.fill, fontWeight: 600 }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────
export default function DashboardPage() {
  const [counts, setCounts] = useState({
    projects: "—",
    news: "—",
    partners: "—",
    stats: "—",
  });

  useEffect(() => {
    Promise.allSettled([
      projectsService.getAllAdmin(),
      newsService.getAllAdmin(),
      partnersService.getAllAdmin(),
      statisticsService.getAllAdmin(),
    ]).then(([p, n, pa, s]) => {
      setCounts({
        projects: p.status === "fulfilled" ? p.value.data.total : 0,
        news: n.status === "fulfilled" ? n.value.data.total : 0,
        partners: pa.status === "fulfilled" ? pa.value.data.data?.length : 0,
        stats: s.status === "fulfilled" ? s.value.data.data?.length : 0,
      });
    });
  }, []);

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <DashboardLayout>
      <div
        style={{
          minHeight: "100%",
          background:
            "linear-gradient(145deg, #0a2e1a 0%, #0d3d22 55%, #0f4c2a 100%)",
          padding: "20px 16px 32px",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient orbs */}
        <div
          style={{
            position: "absolute",
            top: -120,
            left: -80,
            width: 320,
            height: 320,
            borderRadius: "50%",
            pointerEvents: "none",
            background:
              "radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            right: -60,
            width: 260,
            height: 260,
            borderRadius: "50%",
            pointerEvents: "none",
            background:
              "radial-gradient(circle, rgba(217,119,6,0.08) 0%, transparent 70%)",
          }}
        />

        {/* ── Header ── */}
        <div style={{ ...glass, padding: "16px 18px", marginBottom: 20 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(240,253,244,0.38)",
              marginBottom: 4,
            }}
          >
            Tableau de bord
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#f0fdf4",
              marginBottom: 2,
            }}
          >
            Bonjour, M. Koly Doré 👋
          </div>
          <div style={{ fontSize: 13, color: "rgba(240,253,244,0.62)" }}>
            Voici un aperçu de l'activité du site.
          </div>
          <div
            style={{
              fontSize: 11,
              color: "rgba(240,253,244,0.38)",
              marginTop: 8,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <i
              className="ti ti-calendar"
              style={{ fontSize: 13 }}
              aria-hidden="true"
            />
            {today}
          </div>
        </div>

        {/* ── Stats cards ── */}
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(240,253,244,0.38)",
            marginBottom: 10,
          }}
        >
          Vue d'ensemble
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 10,
            marginBottom: 24,
          }}
        >
          {[
            {
              label: "Projets",
              value: counts.projects,
              icon: "ti-clipboard-list",
              color: "#4ade80",
              bg: "rgba(34,197,94,0.18)",
              trend: "Actifs",
            },
            {
              label: "Actualités",
              value: counts.news,
              icon: "ti-news",
              color: "#60a5fa",
              bg: "rgba(59,130,246,0.18)",
              trend: "Publiées",
            },
            {
              label: "Partenaires",
              value: counts.partners,
              icon: "ti-handshake",
              color: "#fbbf24",
              bg: "rgba(245,158,11,0.18)",
              trend: "Organisations",
            },
            {
              label: "Statistiques",
              value: counts.stats,
              icon: "ti-chart-bar",
              color: "#c084fc",
              bg: "rgba(168,85,247,0.18)",
              trend: "Entrées",
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                ...glass,
                padding: 14,
                borderRadius: 14,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Glow orb */}
              <div
                style={{
                  position: "absolute",
                  top: -10,
                  right: -10,
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  background: s.color,
                  opacity: 0.07,
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  marginBottom: 10,
                  background: s.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i
                  className={`ti ${s.icon}`}
                  style={{ fontSize: 16, color: s.color }}
                  aria-hidden="true"
                />
              </div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: s.color,
                  lineHeight: 1,
                  marginBottom: 3,
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: "rgba(240,253,244,0.62)" }}>
                {s.label}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "#4ade80",
                  marginTop: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <i className="ti ti-trending-up" aria-hidden="true" /> {s.trend}
              </div>
            </div>
          ))}
        </div>

        {/* ── Bar chart : activité mensuelle ── */}
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(240,253,244,0.38)",
            marginBottom: 10,
          }}
        >
          Activité mensuelle
        </div>
        <div style={{ ...glass, padding: 16, marginBottom: 16 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#f0fdf4" }}>
                Publications & Projets
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(240,253,244,0.38)",
                  marginTop: 1,
                }}
              >
                6 derniers mois
              </div>
            </div>
            <span
              style={{
                fontSize: 10,
                padding: "4px 10px",
                borderRadius: 20,
                fontWeight: 500,
                background: "rgba(34,197,94,0.15)",
                border: "1px solid rgba(34,197,94,0.25)",
                color: "#4ade80",
              }}
            >
              2026
            </span>
          </div>

          {/* Legend */}
          <div
            style={{
              display: "flex",
              gap: 14,
              marginBottom: 10,
              flexWrap: "wrap",
            }}
          >
            {[
              { color: "#4ade80", label: "Projets" },
              { color: "#60a5fa", label: "Actualités" },
              { color: "#fbbf24", label: "Partenaires" },
            ].map((l) => (
              <div
                key={l.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 11,
                  color: "rgba(240,253,244,0.6)",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    background: l.color,
                  }}
                />
                {l.label}
              </div>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY_DATA} barCategoryGap="30%">
              <XAxis
                dataKey="month"
                tick={{ fill: "rgba(240,253,244,0.5)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "rgba(240,253,244,0.5)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
              />
              <Bar
                dataKey="projets"
                name="Projets"
                fill="#4ade80"
                radius={[5, 5, 0, 0]}
              />
              <Bar
                dataKey="actualites"
                name="Actualités"
                fill="#60a5fa"
                radius={[5, 5, 0, 0]}
              />
              <Bar
                dataKey="partenaires"
                name="Partenaires"
                fill="#fbbf24"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>

          {/* Mini stats */}
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            {[
              { val: "+12%", label: "Projets", color: "#4ade80" },
              { val: "+8%", label: "Actualités", color: "#60a5fa" },
              { val: "+5%", label: "Partenaires", color: "#fbbf24" },
            ].map((m) => (
              <div
                key={m.label}
                style={{
                  flex: 1,
                  padding: 10,
                  textAlign: "center",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 700, color: m.color }}>
                  {m.val}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "rgba(240,253,244,0.38)",
                    marginTop: 2,
                  }}
                >
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Pie chart : domaines ── */}
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(240,253,244,0.38)",
            marginBottom: 10,
          }}
        >
          Répartition des domaines
        </div>
        <div style={{ ...glass, padding: 16, marginBottom: 24 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#f0fdf4",
              marginBottom: 4,
            }}
          >
            Domaines d'intervention
          </div>
          <div
            style={{
              fontSize: 11,
              color: "rgba(240,253,244,0.38)",
              marginBottom: 12,
            }}
          >
            Distribution par catégorie
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={DOMAINES_DATA}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {DOMAINES_DATA.map((_, i) => (
                  <Cell
                    key={i}
                    fill={DOMAINES_COLORS[i]}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Legend
                formatter={(v) => (
                  <span
                    style={{ color: "rgba(240,253,244,0.6)", fontSize: 11 }}
                  >
                    {v}
                  </span>
                )}
                iconType="square"
                iconSize={8}
              />
              <Tooltip
                formatter={(v) => [`${v}%`, ""]}
                contentStyle={{
                  background: "rgba(13,61,34,0.95)",
                  border: "1px solid rgba(74,222,128,0.2)",
                  borderRadius: 10,
                  fontSize: 12,
                }}
                itemStyle={{ color: "#f0fdf4" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* ── Accès rapides ── */}
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(240,253,244,0.38)",
            marginBottom: 10,
          }}
        >
          Accès rapides
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 8,
            marginBottom: 20,
          }}
        >
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                ...glass,
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 14px",
                borderRadius: 12,
                textDecoration: "none",
                color: "#f0fdf4",
                fontSize: 12,
                fontWeight: 500,
                transition: "all 0.18s",
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  flexShrink: 0,
                  background: link.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i
                  className={`ti ${link.icon}`}
                  style={{ color: link.iconColor, fontSize: 17 }}
                  aria-hidden="true"
                />
              </div>
              {link.label}
            </Link>
          ))}
        </div>

        {/* ── Site public ── */}
        <a
          href="https://www.clubenvironnementaldeguinee.org"
          target="_blank"
          rel="noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 16px",
            borderRadius: 12,
            background: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.2)",
            textDecoration: "none",
          }}
        >
          <i
            className="ti ti-world"
            style={{ color: "#4ade80", fontSize: 20 }}
            aria-hidden="true"
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 11,
                color: "rgba(240,253,244,0.38)",
                marginBottom: 1,
              }}
            >
              Site public
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#4ade80",
                fontWeight: 500,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              www.clubenvironnementaldeguinee.org
            </div>
          </div>
          <i
            className="ti ti-arrow-right"
            style={{ color: "rgba(240,253,244,0.38)", fontSize: 16 }}
            aria-hidden="true"
          />
        </a>
      </div>
    </DashboardLayout>
  );
}
