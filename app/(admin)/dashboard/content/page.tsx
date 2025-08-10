"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useCMS } from "@/lib/store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SiteForm, HeroForm, ServicesForm, PaymentsForm, FAQForm, LogosForm, TestimonialsForm, CTAForm, ContactForm } from "@/components/editor/forms"
import Link from "next/link"
import { Upload, Download, Save } from 'lucide-react'
import { notifyPublished } from "@/lib/realtime"

export default function ContentManagerPage() {
  const { toast } = useToast()
  const cms = useCMS()
  const fileRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const r = await fetch("/api/content/published", { cache: "no-store" })
        if (!r.ok) return
        const j = await r.json()
        if (j && j.ar && j.en) {
          cms.setContent("ar", j.ar)
          cms.setContent("en", j.en)
          if (j.design) cms.setDesign(j.design)
        }
      } finally {
        setLoading(false)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const exportJSON = () => {
    const data = JSON.stringify({ ar: cms.content.ar, en: cms.content.en, design: cms.design }, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `kyctrust-content.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const onImport = async (file: File) => {
    try {
      const text = await file.text()
      const j = JSON.parse(text)
      if (!j.ar || !j.en) throw new Error("Missing ar/en")
      cms.setContent("ar", j.ar)
      cms.setContent("en", j.en)
      if (j.design) cms.setDesign(j.design)
      toast({ title: "Imported", description: "JSON imported into editor state." })
    } catch (e: any) {
      toast({ title: "Invalid JSON", description: e?.message || "Could not parse file." })
    }
  }

  const publish = async () => {
    try {
      const r = await fetch("/api/content/published", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ar: cms.content.ar, en: cms.content.en, design: cms.design }),
      })
      if (!r.ok) {
        const j = await r.json().catch(() => ({}))
        throw new Error(j.error || "Publish failed")
      }
      await fetch("/api/content/snapshots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: "ar", content: cms.content.ar }),
      }).catch(() => {})
      await fetch("/api/content/snapshots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: "en", content: cms.content.en }),
      }).catch(() => {})
      notifyPublished()
      toast({ title: "Published", description: "Landing content has been published and broadcast." })
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Could not publish content." })
    }
  }

  if (loading) return <div className="p-4 text-sm text-muted-foreground">Loading published content…</div>

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              {locale === "ar" ? "إدارة المحتوى" : "Content Manager"}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {locale === "ar" ? "تحرير ونشر محتوى الموقع" : "Edit and publish website content"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={exportJSON}>
              <Download className="mr-2 h-4 w-4" /> Export JSON
            </Button>
            <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && onImport(e.target.files[0])} />
            <Button variant="outline" onClick={() => fileRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" /> Import JSON
            </Button>
            <Link href="/dashboard/content/json" className="inline-flex items-center rounded-md border px-3 py-2 text-sm">
              Open JSON Editor
            </Link>
            <Button onClick={publish} className="bg-gradient-to-r from-violet-600 to-emerald-600 text-white">
              <Save className="mr-2 h-4 w-4" /> Publish
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="site" className="space-y-4">
        <TabsList className="flex w-full flex-wrap justify-start bg-muted/50">
          <TabsTrigger value="site">Site</TabsTrigger>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="logos">Logos</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="cta">CTA</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="site">
          <Card className="border-neutral-200/60 bg-white/80 backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-900/60">
            <CardContent className="p-6"><SiteForm locale={cms.locale} /></CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="hero">
          <Card className="border-neutral-200/60 bg-white/80 backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-900/60">
            <CardContent className="p-6"><HeroForm locale={cms.locale} /></CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="services">
          <Card className="border-neutral-200/60 bg-white/80 backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-900/60">
            <CardContent className="p-6"><ServicesForm locale={cms.locale} /></CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payments">
          <Card className="border-neutral-200/60 bg-white/80 backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-900/60">
            <CardContent className="p-6"><PaymentsForm locale={cms.locale} /></CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="faq">
          <Card className="border-neutral-200/60 bg-white/80 backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-900/60">
            <CardContent className="p-6"><FAQForm locale={cms.locale} /></CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="logos">
          <Card className="border-neutral-200/60 bg-white/80 backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-900/60">
            <CardContent className="p-6"><LogosForm locale={cms.locale} /></CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="testimonials">
          <Card className="border-neutral-200/60 bg-white/80 backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-900/60">
            <CardContent className="p-6"><TestimonialsForm locale={cms.locale} /></CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="cta">
          <Card className="border-neutral-200/60 bg-white/80 backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-900/60">
            <CardContent className="p-6"><CTAForm locale={cms.locale} /></CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="contact">
          <Card className="border-neutral-200/60 bg-white/80 backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-900/60">
            <CardContent className="p-6"><ContactForm locale={cms.locale} /></CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
