"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { paletteGrad } from "@/lib/palette"
import { ScrollReveal } from "@/components/animate/scroll-reveal"
import { useCMS } from "@/lib/store"
import type { Bundle, Locale } from "@/lib/types"
import { Filter, MessageCircle, Search, Star } from "lucide-react"
import { useMemo, useState } from "react"

/**
 * Build WhatsApp deep link for service order.
 */
function buildWhatsApp(service: string, price: string, locale: Locale = "ar", brand = "kyctrust") {
  const phone = "201062453344"
  const timestamp = Date.now()
  const requestId = `LP-${timestamp}`
  const messages: Record<Locale, string> = {
    ar: `🔥 طلب خدمة من ${brand}

📋 تفاصيل الطلب:
• الخدمة: ${service}
• السعر: ${price}
• اللغة: ${locale}
• معرف الطلب: ${requestId}

⏰ سنرد عليك خلال 15 دقيقة
🛡️ خدمة آمنة ومضمونة 100%`,
    en: `🔥 Service Request from ${brand}

📋 Order Details:
• Service: ${service}
• Price: ${price}
• Language: ${locale}
• Request ID: ${requestId}

⏰ We'll reply within 15 minutes
🛡️ 100% Safe and Guaranteed Service`,
  }
  const text = encodeURIComponent(messages[locale] || messages.ar)
  return `https://wa.me/${phone}?text=${text}`
}

/**
 * Normalize name for lookups (strip spaces, case, non-alphanumerics).
 */
function normalizeName(s: string) {
  return (
    String(s || "")
      .toLowerCase()
      .normalize("NFKD")
      // remove diacritics
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9]/g, "")
  )
}

/**
 * Curated mapping to official local assets (already in /public/images/logos).
 * Ensures we show the correct brand icon even if the Logos list misses a match.
 */
const officialLogos: Record<string, string> = {
  payoneer: "/images/logos/payoneer.png",
  wise: "/images/logos/wise.png",
  skrill: "/images/logos/skrill.png",
  neteller: "/images/logos/neteller.png",
  paypal: "/images/logos/paypal.png",
  okx: "/images/logos/okx.png",
  bybit: "/images/logos/bybit.png",
  bitget: "/images/logos/bitget.png",
  kucoin: "/images/logos/kucoin.png",
  exness: "/images/logos/exness.png",
  mexc: "/images/logos/mexc.png",
  vodafonecash: "/images/logos/vodafone-cash.png",
}

/**
 * Resolve the best icon for a given service:
 * 1) explicit service.iconImage
 * 2) match from content logos
 * 3) curated officialLogos mapping
 * 4) fallback placeholder
 */
function resolveIconSrc(serviceName: string, explicit?: string, logos?: { name: string; src: string }[]) {
  if (explicit && explicit.trim()) return explicit
  const key = normalizeName(serviceName)
  const fromLogos = (logos || []).find((l) => normalizeName(l.name) === key)?.src
  if (fromLogos) return fromLogos
  if (officialLogos[key]) return officialLogos[key]
  return "/generic-financial-logo.png" + encodeURIComponent(serviceName)
}

/**
 * Optional meta builder to clarify type/purpose under each service card.
 */
function buildServiceMeta(serviceName: string, category: string, locale: Locale) {
  const key = normalizeName(serviceName)
  const catalog: Record<string, { typeAr: string; typeEn: string; purposeAr: string; purposeEn: string }> = {
    payoneer: {
      typeAr: "حساب بنكي دولي",
      typeEn: "Global bank account",
      purposeAr: "استلام المدفوعات الدولية وإدارتها",
      purposeEn: "Receive and manage international payments",
    },
    wise: {
      typeAr: "حساب متعدد العملات",
      typeEn: "Multi-currency account",
      purposeAr: "تحويلات دولية برسوم منخفضة",
      purposeEn: "Low-fee international transfers",
    },
    skrill: {
      typeAr: "محفظة إلكترونية",
      typeEn: "E-wallet",
      purposeAr: "مدفوعات وتحويلات رقمية سريعة",
      purposeEn: "Fast digital payments and transfers",
    },
    neteller: {
      typeAr: "محفظة إلكترونية",
      typeEn: "E-wallet",
      purposeAr: "مدفوعات عالمية فورية",
      purposeEn: "Instant global payments",
    },
    paypal: {
      typeAr: "محفظة إلكترونية",
      typeEn: "E-wallet",
      purposeAr: "الدفع الآمن عبر الإنترنت",
      purposeEn: "Secure online checkout",
    },
  }
  const known = catalog[key]
  if (locale === "ar") {
    return known
      ? { type: known.typeAr, purpose: known.purposeAr }
      : { type: category || "خدمة", purpose: "حل مالي موثوق" }
  }
  return known
    ? { type: known.typeEn, purpose: known.purposeEn }
    : { type: category || "Service", purpose: "Reliable financial solution" }
}

export function ServicesBlock({
  data,
  locale,
  isRTL,
  palette,
}: {
  data: Bundle
  locale: Locale
  isRTL: boolean
  palette: ReturnType<typeof paletteGrad>
}) {
  const [category, setCategory] = useState<string>("all")
  const [q, setQ] = useState<string>("")
  const [popularFirst, setPopularFirst] = useState<boolean>(true)
  const [nameAsc, setNameAsc] = useState<boolean>(false)
  const categories = useMemo(
    () => ["all", ...Array.from(new Set(data.services.map((s) => s.category)))],
    [data.services],
  )
  const services = useMemo(
    () =>
      data.services
        .filter((s) => s.active !== false)
        .filter((s) => (category === "all" ? true : s.category === category))
        .filter((s) => (q.trim() ? s.name.toLowerCase().includes(q.toLowerCase()) : true))
        .sort((a, b) => {
          // Primary stable sort by configured sort field
          let res = (a.sort ?? 0) - (b.sort ?? 0)
          if (popularFirst) {
            // Popular items first
            const pa = a.popular ? 1 : 0
            const pb = b.popular ? 1 : 0
            if (pa !== pb) return pb - pa
          }
          if (nameAsc) {
            const na = a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
            if (na !== 0) return na
          }
          return res
        }),
    [data.services, category, q, popularFirst, nameAsc],
  )
  const logos = Array.isArray(data.logos) ? data.logos : []
  const { design } = useCMS()
  const enable = design.anim?.enableReveal !== false
  const k = design.anim?.intensity ?? 1

  const Title = (
    <div className="text-center">
      <h2 className="text-3xl font-extrabold md:text-5xl">
        <span className={`bg-gradient-to-r ${palette.range} bg-clip-text text-transparent`}>
          {isRTL ? "خدماتنا المتميزة" : "Our Premium Services"}
        </span>
      </h2>
      <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
        {isRTL
          ? "اختر من مجموعة واسعة من الخدمات المالية المتطورة"
          : "Choose from a wide range of advanced financial services"}
      </p>
    </div>
  )

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative bg-gradient-to-b from-white via-emerald-50/30 to-blue-50/30 px-4 py-20 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-950"
    >
      {/* Background decorations */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-20 right-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl" />
        <div className="absolute bottom-20 left-10 h-40 w-40 rounded-full bg-violet-500/10 blur-2xl" />
      </div>
      
      <div className="mx-auto max-w-7xl">
        {enable ? <ScrollReveal y={18 * k}>{Title}</ScrollReveal> : Title}

        {/* Enhanced search and filters */}
        <div className="mx-auto mt-12 max-w-5xl">
          <Card className="border-neutral-200/60 bg-white/80 backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-900/60">
            <CardContent className="p-6">
              <div className="flex flex-col items-stretch gap-4 lg:flex-row lg:items-center">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 opacity-60 rtl:right-3 rtl:left-auto" />
                  <Input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder={isRTL ? "ابحث عن الخدمة المطلوبة..." : "Search for the service you need..."}
                    className="ps-10 pe-4 py-3 text-base rounded-xl border-2 focus:border-primary/50"
                    aria-label={isRTL ? "بحث في الخدمات" : "Search services"}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {categories.map((c) => {
                    const active = category === c
                    return (
                      <Button
                        key={c}
                        variant={active ? "default" : "outline"}
                        onClick={() => setCategory(c)}
                        className={active ? `bg-gradient-to-r ${palette.range} text-white shadow-md` : "hover:bg-accent/80"}
                        size="sm"
                      >
                        <Filter className="h-4 w-4 me-2" />
                        {c === "all" ? (isRTL ? "جميع الخدمات" : "All Services") : c}
                      </Button>
                    )
                  })}
                </div>
              </div>
              
              <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-4">
                  <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                    <input type="checkbox" checked={popularFirst} onChange={(e) => setPopularFirst(e.target.checked)} className="rounded" />
                    {isRTL ? "الأكثر طلباً أولاً" : "Popular first"}
                  </label>
                  <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                    <input type="checkbox" checked={nameAsc} onChange={(e) => setNameAsc(e.target.checked)} className="rounded" />
                    {isRTL ? "ترتيب أبجدي" : "Sort alphabetically"}
                  </label>
                </div>
                <div className="text-sm text-muted-foreground">
                  {isRTL ? `${services.length} خدمة متاحة` : `${services.length} services available`}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services grid with enhanced cards */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60 rtl:right-3 rtl:left-auto" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={isRTL ? "ابحث عن الخدمة..." : "Search services..."}
              className="ps-9 pe-3 py-6 rounded-xl"
              aria-label={isRTL ? "بحث في الخدمات" : "Search services"}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((c) => {
              const active = category === c
              return (
                <Button
                  key={c}
                  variant={active ? "default" : "outline"}
                  onClick={() => setCategory(c)}
                  className={active ? `bg-gradient-to-r ${palette.range} text-white` : ""}
                >
                  <Filter className="h-4 w-4 me-2" />
                  {c === "all" ? (isRTL ? "الكل" : "All") : c}
                </Button>
              )
            })}
          </div>
        </div>

        <div className="mx-auto mt-3 flex max-w-4xl flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={popularFirst} onChange={(e) => setPopularFirst(e.target.checked)} />
            {isRTL ? "الأكثر طلباً أولاً" : "Popular first"}
          </label>
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={nameAsc} onChange={(e) => setNameAsc(e.target.checked)} />
            {isRTL ? "ترتيب أبجدي" : "Sort by name"}
          </label>
        </div>

        <div
          className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          role="list"
          aria-label={isRTL ? "قائمة الخدمات" : "Services list"}
        >
          {services.map((s, i) => {
            const iconSrc = resolveIconSrc(s.name, s.iconImage, logos)
            const hasRealIcon = Boolean(iconSrc)
            const meta = buildServiceMeta(s.name, s.category, locale)

            const CardInner = (
              <Card
                key={s.name} // Added key property
                className="group relative border-neutral-200/60 bg-white/80 backdrop-blur transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:shadow-primary/10 dark:border-neutral-800/60 dark:bg-neutral-900/60"
                role="listitem"
              >
                <CardContent className="p-8">
                  {/* Popular badge */}
                  {s.popular && (
                    <div className="absolute -top-2 -right-2">
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
                        <Star className="me-1 h-3 w-3" />
                        {isRTL ? "الأكثر طلباً" : "Most Popular"}
                      </Badge>
                    </div>
                  )}
                  
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`grid h-14 w-14 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br ${palette.range} text-white shadow-lg ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                        aria-hidden={!hasRealIcon}
                      >
                        {iconSrc ? (
                          <Image
                            src={iconSrc || "/placeholder.svg"}
                            alt={`${s.name} logo`}
                            width={56}
                            height={56}
                            sizes="(max-width: 768px) 56px, 56px"
                            className="h-14 w-14 object-contain"
                            loading="lazy"
                          />
                        ) : (
                          <span className="text-2xl leading-none" aria-label={`${s.name} icon`}>
                            {s.icon}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          {/* Inline chip for quick brand recognition */}
                          <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground bg-muted/50">
                            <span className="relative inline-block h-4 w-4 overflow-hidden rounded">
                              <Image
                                src={iconSrc || "/placeholder.svg"}
                                alt={`${s.name} mini logo`}
                                width={16}
                                height={16}
                                className="h-4 w-4 object-contain"
                                loading="lazy"
                              />
                            </span>
                            {s.name}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground font-medium">
                          {s.category}
                          {" · "}
                          {meta.type}
                        </p>
                      </div>
                    </div>

                    <div className="text-end shrink-0">
                      <p
                        className={`bg-gradient-to-r ${palette.range} bg-clip-text text-3xl md:text-4xl font-extrabold text-transparent`}
                        aria-label={isRTL ? `السعر ${s.price}` : `Price ${s.price}`}
                      >
                        {s.price}
                      </p>
                      {s.note ? <p className="mt-2 text-xs text-muted-foreground font-medium">{s.note}</p> : null}
                    </div>
                  </div>

                  {/* Clear, richer description */}
                  <p className="mb-4 line-clamp-3 text-base leading-relaxed text-muted-foreground">{s.description}</p>
                  <p className="mb-6 text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
                    {isRTL ? "الهدف:" : "Purpose:"} {meta.purpose}
                  </p>

                  <div className="flex items-center justify-between gap-3">
                    <Badge variant="secondary" className="rounded-full px-3 py-1">
                      {s.category}
                    </Badge>
                    <Magnetic>
                      <Button
                        className={`bg-gradient-to-r ${palette.range} text-white shadow-lg hover:shadow-xl transition-all duration-300`}
                        onClick={() => window.open(buildWhatsApp(s.name, s.price, locale, data.site.name), "_blank")}
                        size="sm"
                        aria-label={isRTL ? `اطلب ${s.name} الآن` : `Order ${s.name} now`}
                      >
                        <MessageCircle className="h-4 w-4 me-2" />
                        {isRTL ? "اطلب الآن" : "Order Now"}
                      </Button>
                    </Magnetic>
                  </div>
                  
                  {/* Hover effect overlay */}
                  <div aria-hidden className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-transparent group-hover:ring-primary/20 transition-all duration-300" />
                </CardContent>
              </Card>
            )

            return enable ? (
              <ScrollReveal key={`${s.name}-${i}`} y={16 * k} delay={i * 0.05}>
                {CardInner}
              </ScrollReveal>
            ) : (
              <div key={`${s.name}-${i}`}>{CardInner}</div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
