"use client"

import { useCMS } from "@/lib/store"
import { paletteGrad } from "@/lib/palette"
import { cn } from "@/lib/utils"
import { Shield, MessageCircle, Clock } from "lucide-react"

export function SiteFooter() {
  const { design, locale, content } = useCMS()
  const data = content[locale]
  const palette = paletteGrad(design.palette)
  
  return (
    <footer className="mt-20">
      <div
        className={cn(
          "h-1 w-full bg-gradient-to-r",
          palette.range
        )}
        aria-hidden
      />
      <div className="bg-gradient-to-b from-neutral-900 to-neutral-950 px-4 py-16 text-neutral-300">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Brand section */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className={cn("grid h-10 w-10 place-items-center rounded-xl text-white shadow-lg", `bg-gradient-to-br ${palette.range}`)}>
                  <Shield className="h-5 w-5" />
                </div>
                <span className={cn("text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent", palette.range)}>
                  {data.site.name}
                </span>
              </div>
              <p className="text-neutral-400 mb-4 max-w-md">
                {data.site.description}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-emerald-400" />
                <span>{data.site.tagline}</span>
              </div>
            </div>
            
            {/* Quick links */}
            <div>
              <h3 className="font-semibold mb-4 text-white">
                {locale === "ar" ? "روابط سريعة" : "Quick Links"}
              </h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#services" className="hover:text-white transition-colors">{locale === "ar" ? "الخدمات" : "Services"}</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">{locale === "ar" ? "الأسئلة الشائعة" : "FAQ"}</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">{locale === "ar" ? "تواصل معنا" : "Contact Us"}</a></li>
                <li><a href="/dashboard" className="hover:text-white transition-colors">{locale === "ar" ? "لوحة التحكم" : "Dashboard"}</a></li>
              </ul>
            </div>
            
            {/* Contact info */}
            <div>
              <h3 className="font-semibold mb-4 text-white">
                {locale === "ar" ? "تواصل معنا" : "Contact"}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-emerald-400" />
                  <span className="font-mono">{data.site.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <span>{locale === "ar" ? "24/7 دعم فني" : "24/7 Support"}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-neutral-800 text-center">
            <p className="text-sm text-neutral-500">
              © {new Date().getFullYear()} {data.site.name}. 
              {locale === "ar" ? " جميع الحقوق محفوظة." : " All rights reserved."}
            </p>
            <p className="text-xs text-neutral-600 mt-2">
              {locale === "ar" ? "منصة آمنة وموثوقة للخدمات المالية الرقمية" : "Secure and trusted platform for digital financial services"}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
