import { SEO } from "../seo/SEO";
import { MainLayout } from "../layouts/MainLayout";
import { HeroSection } from "../sections/HeroSection";
import { StatisticsSection } from "../sections/StatisticsSection";
import { AboutPreviewSection } from "../sections/AboutPreviewSection";
import { DomainsSection } from "../sections/DomainsSection";
import { ProjectsPreviewSection } from "../sections/ProjectsPreviewSection";
import { PartnersSection } from "../sections/PartnersSection";
import { TestimonialsSection } from "../sections/TestimonialsSection";
import { NewsPreviewSection } from "../sections/NewsPreviewSection";
import { CTASection } from "../sections/CTASection";

export default function HomePage() {
  return (
    <>
      <SEO
        title="C.E.G — ONG Club Environnemental de Guinée"
        description="ONG Club Environnemental de Guinée : protection de l'environnement, développement durable et amélioration des conditions de vie des populations. Partenaire GEF, PNUD-GUINEE, SGP depuis 2016."
        keywords="ONG environnement Guinée, développement durable Guinée, conservation environnement Guinée, ONG écologique Guinée, CEG Forécariah, reboisement Guinée"
      />
      <MainLayout>
        <HeroSection />
        <StatisticsSection />
        <AboutPreviewSection />
        <DomainsSection />
        <ProjectsPreviewSection />
        <PartnersSection />
        <TestimonialsSection />
        <NewsPreviewSection />
        <CTASection />
      </MainLayout>
    </>
  );
}
