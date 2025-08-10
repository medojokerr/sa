"use client"

import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import { useCMS } from "@/lib/store"
import { paletteGrad } from "@/lib/palette"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Globe, Moon, Sun, MessageCircle, Shield } from 'lucide-react'
import { buildWhatsApp } from "@/lib/whatsapp"
import { Magnetic } from "@/components/animate/magnetic"

export function SiteHeader() {
  const { locale, content, design, setLocale } = useCMS()
  const data = content[locale]
  const { theme, setTheme } = useTheme()
  const palette = paletteGrad(design.palette)

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/90",
        "border-neutral-200/60 dark:border-neutral-800/60"
      )}
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <span
            className={cn(
              "grid h-10 w-10 place-items-center overflow-hidden rounded-xl text-white shadow-lg ring-1 ring-black/5 dark:ring-white/5 transition-transform hover:scale-105",
              `bg-gradient-to-br ${palette.range}`
            )}
          >
            {data.site.logoSrc ? (
              <Image
                src={data.site.logoSrc || "/placeholder.svg"}
                width={32}
                height={32}
                alt={`${data.site.name} logo`}
                className="h-8 w-8 object-contain"
                priority
              />
            ) : (
              <Shield className="h-5 w-5" aria-label="Brand logo" />
            )}
          </span>
          <span
            className={cn(
              "hidden text-lg font-bold sm:inline-block",
              `bg-gradient-to-r ${palette.range} bg-clip-text text-transparent`
            )}
          >
            {data.site.name}
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group">
            {locale === "ar" ? "الخدمات" : "Services"}
            <span className={`absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r ${palette.range} transition-all duration-300 group-hover:w-full`} />
          </a>
          <a href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group">
            {locale === "ar" ? "الأسئلة" : "FAQ"}
            <span className={`absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r ${palette.range} transition-all duration-300 group-hover:w-full`} />
          </a>
          <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group">
            {locale === "ar" ? "تواصل" : "Contact"}
            <span className={`absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r ${palette.range} transition-all duration-300 group-hover:w-full`} />
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="hover:bg-accent/80 transition-all duration-300"
            onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
          >
            <Globe className="mr-2 h-4 w-4" />
            {locale === "ar" ? "English" : "عربي"}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hover:bg-accent/80 transition-all duration-300"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Magnetic>
            <Button
              className={cn(
                "hidden sm:inline-flex shadow-lg hover:shadow-xl transition-all duration-300",
                `bg-gradient-to-r ${palette.range} text-white`
              )}
              size="sm"
              onClick={() =>
                window.open(
                  buildWhatsApp(locale === "ar" ? "استفسار سريع" : "Quick inquiry", "N/A", locale, data.site.name),
                  "_blank"
                )
              }
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              {locale === "ar" ? "ابدأ الدردشة" : "Chat now"}
            </Button>
          </Magnetic>
        </div>
      </div>
    </header>
  )
}
