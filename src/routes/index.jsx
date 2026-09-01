import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "../components/shared/ProtectedRoute";
import LoginPage from "../components/AdminPage/LoginPage";
import AdminDashboardPage from "../components/AdminPage/DashboardPage";
import BackgroundsPage from "../components/AdminPage/BackgroundsPage";
import DomainsPage from "../components/AdminPage/DomainsPage";
import DonationsPage from "../components/AdminPage/DonationsPage";
import GalleryPage from "../components/AdminPage/GalleryPage";
import MessagesPage from "../components/AdminPage/MessagesPage";
import NewsPage from "../components/AdminPage/NewsPage";
import PartnersPage from "../components/AdminPage/PartnersPage";
import ProjectsPage from "../components/AdminPage/ProjectsPage";
import StatisticsPage from "../components/AdminPage/StatisticsPage";
import TestimonialsPage from "../components/AdminPage/TestimonialsPage";
import TimelinePage from "../components/AdminPage/TimelinePage";
import FundingDashboardPage from "../components/AdminPage/FundingPage/DashboardPage";
import FundingOpportunitiesPage from "../components/AdminPage/FundingPage/OpportunitiesListPage";
import FundingOpportunityDetailPage from "../components/AdminPage/FundingPage/OpportunityDetailPage";
import FundingSourcesPage from "../components/AdminPage/FundingPage/SourcesPage";
import FundingProfilePage from "../components/AdminPage/FundingPage/NgoProfilePage";

export const router = createBrowserRouter([
  {
    path: "/admin-login",
    element: <LoginPage />,
  },
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
        <ProjectsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/actualites",
    element: (
      <ProtectedRoute>
        <NewsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/galerie",
    element: (
      <ProtectedRoute>
        <GalleryPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/partenaires",
    element: (
      <ProtectedRoute>
        <PartnersPage />
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
        <DomainsPage />
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
  {
    path: "/",
    element: <Navigate to="/admin/dashboard" replace />,
  },
  {
    path: "*",
    element: <Navigate to="/admin/dashboard" replace />,
  },
]);
