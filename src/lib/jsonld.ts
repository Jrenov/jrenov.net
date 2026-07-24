// Génère les blocs de données structurées (schema.org) à partir des données du
// site, pour qu'ils restent synchronisés avec le contenu affiché.

export const SITE_URL = "https://jrenov.net";
const ORG_ID = `${SITE_URL}/#organization`;
const LOGO = `${SITE_URL}/images/logo.webp`;

function postalAddress(site: any) {
  return {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    postalCode: site.address.postalCode,
    addressRegion: site.address.region,
    addressCountry: "FR",
  };
}

function areaServed(seo: any) {
  return seo.areaServed.map((name: string) => ({ "@type": "City", name }));
}

/** LocalBusiness complet (page d'accueil). */
export function localBusiness(site: any, seo: any) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": ORG_ID,
    name: site.legalName,
    description: site.businessDescription,
    url: SITE_URL,
    telephone: site.phoneTel,
    email: site.email,
    image: LOGO,
    logo: LOGO,
    address: postalAddress(site),
    geo: {
      "@type": "GeoCoordinates",
      latitude: seo.geo.latitude,
      longitude: seo.geo.longitude,
    },
    areaServed: areaServed(seo),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: seo.openingHours.days,
      opens: seo.openingHours.opens,
      closes: seo.openingHours.closes,
    },
    priceRange: seo.priceRange,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services de dépannage à Vannes",
      itemListElement: seo.offerCatalog.map((o: any) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: o.name,
          url: o.url,
          description: o.description,
        },
      })),
    },
  };
}

/** Service (pages service), avec le prestataire LocalBusiness en référence. */
export function serviceSchema(site: any, seo: any, svc: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: svc.serviceType,
    name: svc.jsonLdName,
    description: svc.jsonLdDescription,
    url: `${SITE_URL}/${svc.slug}`,
    areaServed: areaServed(seo),
    provider: {
      "@type": "LocalBusiness",
      "@id": ORG_ID,
      name: site.legalName,
      telephone: site.phoneTel,
      url: SITE_URL,
      address: postalAddress(site),
    },
  };
}

/** Fil d'Ariane. items = [{ name, item }]. */
export function breadcrumb(items: { name: string; item: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.item,
    })),
  };
}

/** FAQPage. Le texte des réponses est nettoyé du markdown (texte brut). */
export function faqPage(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: stripMarkdown(f.a) },
    })),
  };
}

/** Retire le markdown pour obtenir du texte brut (données structurées). */
export function stripMarkdown(src: string): string {
  return String(src)
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // [texte](url) → texte
    .replace(/\*\*([^*]+)\*\*/g, "$1") // **gras** → gras
    .replace(/[*_`]/g, "")
    .trim();
}
