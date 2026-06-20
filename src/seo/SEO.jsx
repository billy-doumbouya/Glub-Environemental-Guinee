import { Helmet } from "react-helmet-async";
import { SITE_URL, SITE_NAME } from "../constants";
import { organization } from "../data/organization";
import { useLocation } from "react-router-dom";

const defaultMeta = {
  title: "C.E.G — ONG Club Environnemental de Guinée",
  description:
    "ONG Club Environnemental de Guinée : préservation de l'environnement, développement durable, conservation des écosystèmes en Guinée. Partenaire GEF, PNUD-GUINEE, SGP.",
  keywords:
    "ONG environnement Guinée, développement durable Guinée, conservation environnement Guinée, ONG écologique Guinée, Club Environnemental Guinée, CEG, Forécariah, reboisement Guinée, agriculture durable Guinée",
  image: `${SITE_URL}/og-image.jpg`,
  type: "website",
};

const schemaOrganization = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: organization.fullName,
  alternateName: organization.acronym,
  description: organization.mission,
  url: SITE_URL,
  email: organization.email,
  telephone: organization.phones[0],
  foundingDate: "2016-11-06",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Km 66/Maléah Centre I",
    addressLocality: "Forécariah",
    addressRegion: "Guinée",
    addressCountry: "GN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: organization.coordinates.lat,
    longitude: organization.coordinates.lng,
  },
  areaServed: {
    "@type": "Country",
    name: "Guinée",
  },
  sameAs: [
    organization.socialLinks.facebookPage,
    organization.socialLinks.youtube,
    organization.socialLinks.instagram,
  ],
  knowsAbout: [
    "Environnement",
    "Développement durable",
    "Conservation des écosystèmes",
    "Agriculture résiliente",
    "Genre et gouvernance locale",
    "Santé communautaire",
  ],
};

export function SEO({ title, description, keywords, image, type, article }) {
  const location = useLocation(); // ← ajout
  const metaTitle = title ? `${title} | ${SITE_NAME}` : defaultMeta.title;
  const metaDescription = description || defaultMeta.description;
  const metaKeywords = keywords || defaultMeta.keywords;
  const metaImage = image || defaultMeta.image;
  const metaType = type || defaultMeta.type;

  return (
    <Helmet>
      {/* Primary */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="author" content={organization.fullName} />
      <meta name="robots" content="index, follow" />

      {/* Canonical dynamique ← correction */}
      <link rel="canonical" href={`${SITE_URL}${location.pathname}`} />

      {/* Google Search Console verification ← ajout */}
      <meta
        name="google-site-verification"
        content="GCLHAUTQKS5OwJSB1bb_juztj4DNRiPzvG"
      />

      {/* Geo / Local SEO */}
      <meta name="geo.region" content="GN" />
      <meta name="geo.placename" content="Forécariah, Guinée" />
      <meta
        name="geo.position"
        content={`${organization.coordinates.lat};${organization.coordinates.lng}`}
      />
      <meta
        name="ICBM"
        content={`${organization.coordinates.lat}, ${organization.coordinates.lng}`}
      />
      <meta name="language" content="fr" />
      <meta name="content-language" content="fr-GN" />

      {/* Open Graph */}
      <meta property="og:type" content={metaType} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={SITE_URL} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="fr_GN" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {/* Article specific */}
      {article && (
        <meta property="article:published_time" content={article.date} />
      )}
      {article && <meta property="article:author" content={article.author} />}

      {/* Schema.org NGO */}
      <script type="application/ld+json">
        {JSON.stringify(schemaOrganization)}
      </script>

      {/* Preload fonts */}
      <link
        rel="preload"
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Inter:wght@400;500&display=swap"
        as="style"
      />
    </Helmet>
  );
}
