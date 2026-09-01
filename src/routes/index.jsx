import { createBrowserRouter, Navigate } from "react-router-dom";

// Components
import { ProtectedRoute } from "../components/shared/ProtectedRoute";

// Auth pages
import LoginPage from "../components/AdminPage/LoginPage";

// Public pages
import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import ProjectsPublicPage from "../pages/ProjectsPage";
import NewsPublicPage from "../pages/NewsPage";
import ContactPage from "../pages/ContactPage";
import PartnersPublicPage from "../pages/PartnersPage";
import GalleryPublicPage from "../pages/GalleryPage";
import DomainsPublicPage from "../pages/DomainsPage";

// Admin pages
import AdminDashboardPage from "../components/AdminPage/DashboardPage";
import BackgroundsPage from "../components/AdminPage/BackgroundsPage";
import AdminDomainsPage from "../components/AdminPage/DomainsPage";
import DonationsPage from "../components/AdminPage/DonationsPage";
import AdminGalleryPage from "../components/AdminPage/GalleryPage";
import MessagesPage from "../components/AdminPage/MessagesPage";
import AdminNewsPage from "../components/AdminPage/NewsPage";
import AdminPartnersPage from "../components/AdminPage/PartnersPage";
import AdminProjectsPage from "../components/AdminPage/ProjectsPage";
import StatisticsPage from "../components/AdminPage/StatisticsPage";
import TestimonialsPage from "../components/AdminPage/TestimonialsPage";
import TimelinePage from "../components/AdminPage/TimelinePage";
import FundingDashboardPage from "../components/AdminPage/FundingPage/DashboardPage";
import FundingOpportunitiesPage from "../components/AdminPage/FundingPage/OpportunitiesListPage";
import FundingOpportunityDetailPage from "../components/AdminPage/FundingPage/OpportunityDetailPage";
import FundingSourcesPage from "../components/AdminPage/FundingPage/SourcesPage";
import FundingProfilePage from "../components/AdminPage/FundingPage/NgoProfilePage";

export const router = createBrowserRouter([
  // ─── Auth ──────────────────────────────────────────────────────────────
  {
    path: "/admin-login",
    element: <LoginPage />,
  },

  // ─── Admin (protégées) ─────────────────────────────────────────────────
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminDashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute>
        <AdminDashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/projets",
    element: (
      <ProtectedRoute>
        <AdminProjectsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/actualites",
    element: (
      <ProtectedRoute>
        <AdminNewsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/galerie",
    element: (
      <ProtectedRoute>
        <AdminGalleryPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/partenaires",
    element: (
      <ProtectedRoute>
        <AdminPartnersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/temoignages",
    element: (
      <ProtectedRoute>
        <TestimonialsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/messages",
    element: (
      <ProtectedRoute>
        <MessagesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/dons",
    element: (
      <ProtectedRoute>
        <DonationsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/apparence/backgrounds",
    element: (
      <ProtectedRoute>
        <BackgroundsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/statistiques",
    element: (
      <ProtectedRoute>
        <StatisticsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/domaines",
    element: (
      <ProtectedRoute>
        <AdminDomainsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/timeline",
    element: (
      <ProtectedRoute>
        <TimelinePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/veille",
    element: (
      <ProtectedRoute>
        <FundingDashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/veille/opportunites",
    element: (
      <ProtectedRoute>
        <FundingOpportunitiesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/veille/opportunites/:id",
    element: (
      <ProtectedRoute>
        <FundingOpportunityDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/veille/sources",
    element: (
      <ProtectedRoute>
        <FundingSourcesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/veille/profil",
    element: (
      <ProtectedRoute>
        <FundingProfilePage />
      </ProtectedRoute>
    ),
  },

  // ─── Public ────────────────────────────────────────────────────────────
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/a-propos",
    element: <AboutPage />,
  },
  {
    path: "/projets",
    element: <ProjectsPublicPage />,
  },
  {
    path: "/actualites",
    element: <NewsPublicPage />,
  },
  {
    path: "/contact",
    element: <ContactPage />,
  },
  {
    path: "/partenaires",
    element: <PartnersPublicPage />,
  },
  {
    path: "/galerie",
    element: <GalleryPublicPage />,
  },
  {
    path: "/domaines",
    element: <DomainsPublicPage />,
  },

  // ─── Fallback ──────────────────────────────────────────────────────────
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
