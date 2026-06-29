import { useState, useEffect } from "react";
import { SEO } from "../seo/SEO";
import { MainLayout } from "../layouts/MainLayout";
import { PageHero } from "../components/common/PageHero";
import { domainsService } from "../../api/services";
import { DomainsIntroGrid } from "../components/DomainComponents/DomainsIntroGrid";
import { DomainDetailSection } from "../components/DomainComponents/DomainDetailSection";


export default function DomainsPage() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    domainsService
      .getAll()
      .then((res) => setDomains(res.data.data || []))
      .catch((err) => console.error("Erreur chargement domaines :", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEO
        title="Domaines d'intervention"
        description="Les 4 domaines d'intervention de C.E.G : Environnement et Développement Durable, Genre et Gouvernance, Santé Communautaire, Recherche et Formation en Guinée."
        keywords="domaines intervention CEG, environnement développement durable Guinée, genre gouvernance locale, santé communautaire Guinée, recherche formation environnement"
      />
      <MainLayout>
        <PageHero
          badge="4 piliers d'action stratégique"
          bgImage="/ceg-bg-domaines.jpg"
          title="Domaines d'intervention"
          subtitle="C.E.G intervient sur quatre axes complémentaires pour un impact durable, mesurable et pérenne sur les communautés et l'environnement guinéen."
          breadcrumb={["Accueil", "Domaines"]}
        />

        {loading ? (
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-40 bg-gray-100 animate-pulse rounded-2xl"
                  />
                ))}
              </div>
            </div>
          </section>
        ) : (
          <>
            <DomainsIntroGrid domains={domains} />
            {domains.map((domain, i) => (
              <DomainDetailSection key={domain._id} domain={domain} index={i} />
            ))}
          </>
        )}
      </MainLayout>
    </>
  );
}
