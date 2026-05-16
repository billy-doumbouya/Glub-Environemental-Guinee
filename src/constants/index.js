export const SITE_URL = "https://www.clubenvironnementaldeguinee.org";
export const SITE_NAME = "ONG C.E.G — Club Environnemental de Guinée";
export const SITE_DESCRIPTION =
  "ONG C.E.G — Club Environnemental de Guinée - Préservation de l'environnement, développement durable et amélioration des conditions de vie des populations guinéennes.";

export const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
export const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
export const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
export const GOOGLE_MAPS_DRIVE_API_KEY = import.meta.env
  .VITE_GOOGLE_DRIVE_API_KEY;
export const GOOGLE_MAPS_DRIVE_FOLDER_ID = import.meta.env
  .VITE_GOOGLE_DRIVE_FOLDER_ID;

export const NAV_LINKS = [
  { label: "Accueil", path: "/" },
  { label: "À Propos", path: "/a-propos" },
  { label: "Domaines", path: "/domaines" },
  { label: "Projets", path: "/projets" },
  { label: "Partenaires", path: "/partenaires" },
  { label: "Actualités", path: "/actualites" },
  { label: "Galerie", path: "/galerie" },
  { label: "Contact", path: "/contact" },
];

export const COLORS = {
  primary: "#15803D",
  primaryLight: "#22C55E",
  primaryDark: "#14532D",
  trustBlue: "#2563EB",
  bgSoft: "#F8FAFC",
  textDark: "#1E293B",
  accentGold: "#F59E0B",
};

export const CONTACT_SUBJECTS = [
  "Demande de partenariat",
  "Demande de financement",
  "Information sur les projets",
  "Bénévolat et engagement",
  "Presse et médias",
  "Autre demande",
];
