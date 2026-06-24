import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "../components/shared/ProtectedRoute";
import NotFoundPage from "../pages/NotFoundPage";
import DonationSuccessPage from "../pages/DonationSuccessPage";
import DonationFailPage from "../pages/DonationFailPage";

// ─── Pages publiques ──────────────────────────────────────────────────────────
const HomePage = lazy(() => import("../pages/HomePage"));
const AboutPage = lazy(() => import("../pages/AboutPage"));
const DomainsPage = lazy(() => import("../pages/DomainsPage"));
const ProjectsPage = lazy(() => import("../pages/ProjectsPage"));
const PartnersPage = lazy(() => import("../pages/PartnersPage"));
const NewsPage = lazy(() => import("../pages/NewsPage"));
const GalleryPage = lazy(() => import("../pages/GalleryPage"));
const ContactPage = lazy(() => import("../pages/ContactPage"));
const DonatePage = lazy(() => import("../pages/DonatePage"));

// ─── Pages admin ─────────────────────────────────────────────────────────────
const AdminLogin = lazy(() => import("../components/AdminPage/LoginPage"));
const AdminDashboard = lazy(
  () => import("../components/AdminPage/DashboardPage"),
);
const AdminProjects = lazy(
  () => import("../components/AdminPage/ProjectsPage"),
);
const AdminNews = lazy(() => import("../components/AdminPage/NewsPage"));
const AdminGallery = lazy(() => import("../components/AdminPage/GalleryPage"));
const AdminPartners = lazy(
  () => import("../components/AdminPage/PartnersPage"),
);
const AdminTestimonials = lazy(
  () => import("../components/AdminPage/TestimonialsPage"),
);
const AdminStatistics = lazy(
  () => import("../components/AdminPage/StatisticsPage"),
);
const AdminDomains = lazy(() => import("../components/AdminPage/DomainsPage"));
const AdminTimeline = lazy(
  () => import("../components/AdminPage/TimelinePage"),
);

export const router = createBrowserRouter([
  // ─── Routes publiques ───────────────────────────────────────────────────────
  { path: "/", element: <HomePage /> },
  { path: "/a-propos", element: <AboutPage /> },
  { path: "/domaines", element: <DomainsPage /> },
  { path: "/projets", element: <ProjectsPage /> },
  { path: "/partenaires", element: <PartnersPage /> },
  { path: "/actualites", element: <NewsPage /> },
  { path: "/galerie", element: <GalleryPage /> },
  { path: "/contact", element: <ContactPage /> },
  { path: "/don", element: <DonatePage /> },
  { path: "/don/succes", element: <DonationSuccessPage /> },
  { path: "/don/echec", element: <DonationFailPage /> },

  // ─── Routes admin ────────────────────────────────────────────────────────────
  { path: "/admin-login", element: <AdminLogin /> },
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/projets",
    element: (
      <ProtectedRoute>
        <AdminProjects />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/actualites",
    element: (
      <ProtectedRoute>
        <AdminNews />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/galerie",
    element: (
      <ProtectedRoute>
        <AdminGallery />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/partenaires",
    element: (
      <ProtectedRoute>
        <AdminPartners />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/temoignages",
    element: (
      <ProtectedRoute>
        <AdminTestimonials />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/statistiques",
    element: (
      <ProtectedRoute>
        <AdminStatistics />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/domaines",
    element: (
      <ProtectedRoute>
        <AdminDomains />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/timeline",
    element: (
      <ProtectedRoute>
        <AdminTimeline />
      </ProtectedRoute>
    ),
  },

  { path: "*", element: <NotFoundPage /> },
]);
