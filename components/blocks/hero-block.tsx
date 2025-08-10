"use client"

import Image from "next/image"
import { ArrowLeft, ArrowRight, MessageCircle, Sparkles, Play, Shield, Clock, Award } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Bundle, Locale } from "@/lib/types"
import { paletteGrad } from "@/lib/palette"
import { useCMS } from "@/lib/store"
import { useParallax, useInViewOnce } from "@/hooks/use-parallax"
import { motion, useReducedMotion } from "framer-motion"
import { buildWhatsApp } from "@/lib/whatsapp"
import { Magnetic } from "@/components/animate/magnetic"

export function HeroBlock({
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
  const { design } = useCMS()
  const parallax = useParallax(design.anim?.parallax ?? 14)

  return (
    <section
      className="relative px-4 pt-20 pb-16 md:pt-32 md:pb-20"
      ref={parallax.ref as any}
      onPointerMove={parallax.onMove as any}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-32 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-48 -left-32 h-[32rem] w-[32rem] rounded-full bg-violet-500/20 blur-3xl animate-pulse [animation-delay:600ms]" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl animate-pulse [animation-delay:1200ms]" />
      </div>
      <div className="mx-auto max-w-7xl">
        {/* Hero core */}
        <div className="relative overflow-hidden rounded-3xl border bg-background/80 p-8 md:p-12 shadow-xl backdrop-blur dark:border-neutral-800/60">
          <DecorativeLogos data={data} palette={palette} />
          <div className="relative z-10 text-center">
            {/* Trust indicators */}
            <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
              <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-200 dark:text-emerald-300 dark:border-emerald-800">
                <Shield className="h-3 w-3 me-1" />
                {isRTL ? "آمن ومضمون" : "Secure & Guaranteed"}
              </Badge>
              <Badge className="bg-blue-500/10 text-blue-700 border-blue-200 dark:text-blue-300 dark:border-blue-800">
                <Clock className="h-3 w-3 me-1" />
                {isRTL ? "تسليم سريع" : "Fast Delivery"}
              </Badge>
              <Badge className="bg-amber-500/10 text-amber-700 border-amber-200 dark:text-amber-300 dark:border-amber-800">
                <Award className="h-3 w-3 me-1" />
                {isRTL ? "جودة عالية" : "Premium Quality"}
              </Badge>
            </div>
            
            <div className="mb-6 flex justify-center">
              <span
                className={`rounded-full bg-gradient-to-r ${palette.range} px-6 py-2 text-white shadow-lg`}
                style={parallax.styleFor(0.1)}
              >
                {isRTL ? "حلول مالية رقمية موثوقة" : "Trusted Digital Financial Solutions"}
              </span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight md:text-8xl lg:text-9xl">
              <span className={`bg-gradient-to-r ${palette.range} bg-clip-text text-transparent`}>
                {data.hero.title}
              </span>
            </h1>
            <p className="mt-6 text-2xl md:text-3xl font-medium text-muted-foreground">{data.hero.subtitle}</p>
            <p className="mx-auto mt-8 max-w-4xl text-lg md:text-xl leading-relaxed text-muted-foreground">
              {data.hero.description}
            </p>

            <div className="mx-auto mt-12 flex max-w-3xl flex-col items-center justify-center gap-4 sm:flex-row">
              <Magnetic>
                <Button
                  className={`group min-w-[280px] bg-gradient-to-r ${palette.range} text-white shadow-lg hover:shadow-xl transition-all duration-300`}
                  size="lg"
                  onClick={() =>
                    window.open(
                      buildWhatsApp(isRTL ? "استفسار عام" : "General Inquiry", "N/A", locale, data.site.name),
                      "_blank"
                    )
                  }
                >
                  <MessageCircle className="h-5 w-5 me-2" />
                  {data.hero.cta}
                  {isRTL ? (
                    <ArrowLeft className="ms-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  ) : (
                    <ArrowRight className="ms-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  )}
                </Button>
              </Magnetic>
              <Magnetic>
                <Button
                  variant="outline"
                  size="lg"
                  className="min-w-[280px] border-2 hover:bg-accent/50 transition-all duration-300"
                  onClick={() =>
                    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <Sparkles className="h-5 w-5 me-2" />
                  {data.hero.secondary}
                </Button>
              </Magnetic>
            </div>
            
            {/* Social proof */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 border-2 border-background" />
                  ))}
                </div>
                <span>{isRTL ? "أكثر من 1000+ عميل راضٍ" : "1000+ Happy Customers"}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="h-4 w-4 text-amber-400">★</div>
                  ))}
                </div>
                <span>{isRTL ? "تقييم 4.9/5" : "4.9/5 Rating"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-2 gap-6 sm:grid-cols-4">
          {(Array.isArray(data?.hero?.stats) ? data.hero.stats : []).map((s, i) => (
            <Card
              key={i}
              className="group border-neutral-200/60 bg-white/80 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:border-neutral-800/60 dark:bg-neutral-900/60"
            >
              <CardContent className="p-8 text-center">
                <div className={`mx-auto mb-3 h-12 w-12 rounded-xl bg-gradient-to-br ${palette.range} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {i === 0 && <Shield className="h-6 w-6" />}
                  {i === 1 && <Clock className="h-6 w-6" />}
                  {i === 2 && <Award className="h-6 w-6" />}
                  {i === 3 && <Sparkles className="h-6 w-6" />}
                </div>
                <p
                  className={`text-4xl md:text-5xl font-extrabold bg-gradient-to-r ${palette.range} bg-clip-text text-transparent`}
                >
                  {s.number}
                </p>
                <p className="mt-2 text-sm font-medium text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Video/Demo section */}
        <div className="mx-auto mt-20 max-w-4xl">
          <Card className="overflow-hidden border-neutral-200/60 bg-white/80 backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-900/60">
            <CardContent className="p-0">
              <div className="relative aspect-video bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    size="lg"
                    className={`bg-gradient-to-r ${palette.range} text-white shadow-2xl hover:scale-105 transition-transform duration-300`}
                  >
                    <Play className="h-6 w-6 me-2" />
                    {isRTL ? "شاهد كيف نعمل" : "See How We Work"}
                  </Button>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="rounded-lg bg-black/50 backdrop-blur p-3 text-white">
                    <p className="text-sm">
                      {isRTL ? "شرح مبسط لعملية إنشاء الحسابات في 3 دقائق" : "Simple 3-minute guide to account creation"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

function DecorativeLogos({
  data,
  palette,
}: {
  data: Bundle
  palette: ReturnType<typeof paletteGrad>
}) {
  const logos = Array.isArray(data.logos) ? data.logos.slice(0, 6) : []
  if (!logos.length) return null

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0">
        {logos.map((l, i) => (
          <FloatingLogo key={`${l.name}-${i}`} idx={i} src={l.src} name={l.name} palette={palette} />
        ))}
      </div>
    </div>
  )
}

function FloatingLogo({
  idx,
  src,
  name,
  palette,
}: {
  idx: number
  src: string
  name: string
  palette: ReturnType<typeof paletteGrad>
}) {
  const positions = [
    { top: "8%", left: "6%" },
    { top: "12%", right: "8%" },
    { bottom: "12%", left: "12%" },
    { bottom: "10%", right: "14%" },
    { top: "40%", left: "4%" },
    { top: "45%", right: "6%" },
  ] as const
  const { ref, entered } = useInViewOnce(0.2)
  const pos = positions[idx % positions.length]
  const prefersReduced = useReducedMotion()

  return (
    <motion.div
      ref={ref as any}
      className="absolute hidden sm:block rounded-xl bg-white/60 p-2 shadow backdrop-blur dark:bg-neutral-900/60"
      style={{
        ...pos,
        willChange: "transform, opacity",
      }}
      initial={{ opacity: 0, y: prefersReduced ? 0 : 8, scale: prefersReduced ? 1 : 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 24,
        delay: prefersReduced ? 0 : idx * 0.05,
      }}
    >
      <div className="rounded-lg px-2 py-1 ring-1 ring-black/5 dark:ring-white/5">
        <Image
          src={src || "/placeholder.svg?height=24&width=80&query=brand%20logo"}
          alt={`${name} logo`}
          width={96}
          height={24}
          sizes="(max-width: 640px) 96px, 96px"
          className="h-6 w-auto contrast-125 grayscale"
        />
      </div>
    </motion.div>
  )
}
