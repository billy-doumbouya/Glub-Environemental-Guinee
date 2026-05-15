import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import NotFoundPage from "../pages/NotFoundPage";

const HomePage = lazy(() => import("../pages/HomePage"));
const AboutPage = lazy(() => import("../pages/AboutPage"));
const DomainsPage = lazy(() => import("../pages/DomainsPage"));
const ProjectsPage = lazy(() => import("../pages/ProjectsPage"));
const PartnersPage = lazy(() => import("../pages/PartnersPage"));
const NewsPage = lazy(() => import("../pages/NewsPage"));
const GalleryPage = lazy(() => import("../pages/GalleryPage"));
const ContactPage = lazy(() => import("../pages/ContactPage"));
const DonatePage = lazy(() => import("../pages/DonatePage"));
export const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/a-propos", element: <AboutPage /> },
  { path: "/domaines", element: <DomainsPage /> },
  { path: "/projets", element: <ProjectsPage /> },
  { path: "/partenaires", element: <PartnersPage /> },
  { path: "/actualites", element: <NewsPage /> },
  { path: "/galerie", element: <GalleryPage /> },
  { path: "/contact", element: <ContactPage /> },
  { path: "/don", element: <DonatePage /> },
  { path: "*", element: <NotFoundPage /> },
]);
