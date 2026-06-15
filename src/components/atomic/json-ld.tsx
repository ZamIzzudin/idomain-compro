import { JSX } from "react";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://idomain.example.com";

/**
 * Renders a JSON-LD <script> tag for structured data.
 * Helps Google understand the site structure for Sitelinks and rich results.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export interface Crumb {
  name: string;
  path: string;
}

/**
 * BreadcrumbList structured data for a given trail of crumbs.
 */
export function BreadcrumbJsonLd({ crumbs }: { crumbs: Crumb[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${BASE_URL}${c.path}`,
    })),
  };
  return <JsonLd data={data} />;
}

/**
 * WebSite + Organization structured data.
 * Enables Sitelinks Search Box and helps Google generate sitelinks.
 */
export function SiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        name: "iDomain",
        url: BASE_URL,
        logo: `${BASE_URL}/logo.png`,
      },
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        url: BASE_URL,
        name: "iDomain",
        description: "Website Resmi iDomain",
        inLanguage: "id-ID",
        publisher: { "@id": `${BASE_URL}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${BASE_URL}/alumni?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
  return <JsonLd data={data} />;
}
