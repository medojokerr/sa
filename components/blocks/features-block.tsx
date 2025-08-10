"use client"

import { Card, CardContent } from "@/components/ui/card"
import { FeatureIcon } from "@/components/icons"
import { paletteGrad } from "@/lib/palette"
import { ScrollReveal } from "@/components/animate/scroll-reveal"
import { useCMS } from "@/lib/store"
import type { Bundle } from "@/lib/types"

export function FeaturesBlock({ data, isRTL, palette }: { data: Bundle; isRTL: boolean; palette: ReturnType<typeof paletteGrad> }) {
  const { design } = useCMS()
  const enable = design.anim?.enableReveal !== false
  const k = design.anim?.intensity ?? 1

  return (
    <section className="relative px-4 py-20">
      {/* Enhanced background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-gradient-to-r from-violet-500/10 to-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl" />
      </div>
      
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          {enable ? (
            <ScrollReveal y={18 * k}>
              <div className="mb-4">
                <div className={`mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br ${palette.range} text-white shadow-xl`}>
                  <Shield className="h-8 w-8" />
                </div>
              </div>
              <h2 className="text-4xl font-extrabold md:text-6xl lg:text-7xl">
                <span className={`bg-gradient-to-r ${palette.range} bg-clip-text text-transparent`}>
                  {isRTL ? "لماذا تختارنا؟" : "Why Choose Us?"}
                </span>
              </h2>
              <p className="mx-auto mt-6 max-w-4xl text-xl md:text-2xl leading-relaxed text-muted-foreground">
                {isRTL ? "نقدم أفضل الخدمات المالية الرقمية بمعايير عالمية وتقنيات متطورة" : "We provide the best digital financial services with global standards and advanced technology"}
              </p>
            </ScrollReveal>
          ) : (
            <div>
              <div className="mb-4">
                <div className={`mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br ${palette.range} text-white shadow-xl`}>
                  <Shield className="h-8 w-8" />
                </div>
              </div>
              <h2 className="text-4xl font-extrabold md:text-6xl lg:text-7xl">
                <span className={`bg-gradient-to-r ${palette.range} bg-clip-text text-transparent`}>
                  {isRTL ? "لماذا تختارنا؟" : "Why Choose Us?"}
                </span>
              </h2>
              <p className="mx-auto mt-6 max-w-4xl text-xl md:text-2xl leading-relaxed text-muted-foreground">
                {isRTL ? "نقدم أفضل الخدمات المالية الرقمية بمعايير عالمية وتقنيات متطورة" : "We provide the best digital financial services with global standards and advanced technology"}
              </p>
            </div>
          )}
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {data.features.map((f, i) => (
            enable ? (
              <ScrollReveal key={i} y={16 * k} delay={i * 0.05}>
                <Card className="group relative border-neutral-200/60 bg-white/80 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 dark:border-neutral-800/60 dark:bg-neutral-900/60">
                  <CardContent className="p-8 text-center">
                    <div className={`mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${palette.range} text-white shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                      <FeatureIcon name={f.icon} className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                    <p className="text-base leading-relaxed text-muted-foreground">{f.desc}</p>
                    
                    {/* Hover effect overlay */}
                    <div aria-hidden className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-transparent group-hover:ring-primary/20 transition-all duration-300" />
                  </CardContent>
                </Card>
              </ScrollReveal>
            ) : (
              <Card key={i} className="group relative border-neutral-200/60 bg-white/80 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 dark:border-neutral-800/60 dark:bg-neutral-900/60">
                <CardContent className="p-8 text-center">
                  <div className={`mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${palette.range} text-white shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <FeatureIcon name={f.icon} className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                  <p className="text-base leading-relaxed text-muted-foreground">{f.desc}</p>
                  
                  {/* Hover effect overlay */}
                  <div aria-hidden className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-transparent group-hover:ring-primary/20 transition-all duration-300" />
                </CardContent>
              </Card>
            )
          ))}
        </div>
      </div>
    </section>
  )
}
