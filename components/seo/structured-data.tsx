"use client"

import { useCMS } from "@/lib/store"
import { useMemo } from "react"

export function StructuredData() {
  const { locale, content } = useCMS()
  const data = content[locale]
  
  const structuredData = useMemo(() => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kyctrust.site"
    
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": `${siteUrl}/#organization`,
          name: data.site.name,
          url: siteUrl,
          logo: `${siteUrl}/generic-brand-logo.png`,
          description: data.site.description,
          contactPoint: {
            "@type": "ContactPoint",
            telephone: data.site.phone,
            contactType: "customer service",
            availableLanguage: ["Arabic", "English"]
          },
          sameAs: []
        },
        {
          "@type": "WebSite",
          "@id": `${siteUrl}/#website`,
          url: siteUrl,
          name: data.site.name,
          description: data.site.description,
          publisher: {
            "@id": `${siteUrl}/#organization`
          },
          inLanguage: locale === "ar" ? "ar" : "en"
        },
        {
          "@type": "Service",
          "@id": `${siteUrl}/#service`,
          name: data.hero.title,
          description: data.hero.description,
          provider: {
            "@id": `${siteUrl}/#organization`
          },
          serviceType: "Financial Services",
          areaServed: "Global"
        }
      ]
    }
  }, [data, locale])

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  )
}