"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Stars, StarsInput } from "./star-rating"
import { Loader2, MessageCircle } from "lucide-react"
import { paletteGrad } from "@/lib/palette"
import { useCMS } from "@/lib/store"

type Review = { id: string; name: string; rating: number; comment: string; created_at: string }

export function ReviewsSection() {
  const { locale, design } = useCMS()
  const { toast } = useToast()
  const palette = paletteGrad(design.palette)
  const [items, setItems] = useState<Review[]>([])
  const [summary, setSummary] = useState<{ avg: number; count: number }>({ avg: 0, count: 0 })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", rating: 5, comment: "", website: "" }) // website: honeypot

  const t = useMemo(
    () => ({
      title: locale === "ar" ? "آراء المستخدمين" : "User Reviews",
      subtitle:
        locale === "ar" ? "شارك رأيك وساعد الآخرين على اتخاذ القرار" : "Share your experience and help others decide",
      submit: locale === "ar" ? "إرسال التقييم" : "Submit Review",
      pending: locale === "ar" ? "تم الإستلام، قيد المراجعة." : "Received. Pending moderation.",
    }),
    [locale],
  )

  async function load(p = 1) {
    setLoading(true)
    try {
      const r = await fetch(`/api/reviews?page=${p}&pageSize=8`, { cache: "no-store" })
      if (!r.ok) throw new Error("Failed")
      const j = await r.json()
      setItems(j.items || [])
      setSummary(j.summary || { avg: 0, count: 0 })
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(page)
  }, [page])

  const submit = async () => {
    if (!form.name || !form.comment || !form.rating) {
      toast({
        title: locale === "ar" ? "تحقق من الحقول" : "Check fields",
        description: locale === "ar" ? "الاسم والتعليق مطلوبان." : "Name and comment are required.",
      })
      return
    }
    setSubmitting(true)
    try {
      const r = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || "Failed")
      toast({ title: "OK", description: t.pending })
      setForm({ name: "", email: "", rating: 5, comment: "", website: "" })
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Could not submit" })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="relative px-4 py-20 bg-gradient-to-b from-neutral-50/50 to-white dark:from-neutral-950/50 dark:to-neutral-950">
      {/* Background decorations */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-20 left-20 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl" />
        <div className="absolute bottom-20 right-20 h-40 w-40 rounded-full bg-violet-500/10 blur-2xl" />
      </div>
      
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <div className={`mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br ${palette.range} text-white shadow-xl`}>
            <MessageCircle className="h-8 w-8" />
          </div>
          <h2 className="text-4xl font-extrabold md:text-6xl lg:text-7xl">
            <span className={`bg-gradient-to-r ${palette.range} bg-clip-text text-transparent`}>{t.title}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-4xl text-xl leading-relaxed text-muted-foreground">{t.subtitle}</p>
        </div>

        {/* Summary */}
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
          <Card className="border-neutral-200/60 bg-white/80 backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-900/60 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">
                {locale === "ar" ? "متوسط التقييم" : "Average rating"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-center gap-3">
                <div className={`text-5xl font-extrabold bg-gradient-to-r ${palette.range} bg-clip-text text-transparent`}>
                  {summary.avg.toFixed(1)}
                </div>
                <div className="flex flex-col items-center">
                  <Stars value={summary.avg} size={20} />
                  <span className="text-xs text-muted-foreground mt-1">
                    {locale === "ar" ? "من 5" : "out of 5"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-neutral-200/60 bg-white/80 backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-900/60 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">
                {locale === "ar" ? "عدد التقييمات" : "Total reviews"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-center">
              <div className={`text-5xl font-extrabold bg-gradient-to-r ${palette.range} bg-clip-text text-transparent`}>
                {summary.count.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {locale === "ar" ? "تقييم موثق" : "verified reviews"}
              </p>
            </CardContent>
          </Card>
          <Card className="border-neutral-200/60 bg-white/80 backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-900/60 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">
                {locale === "ar" ? "شارك رأيك" : "Share your review"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Button
                className={`w-full bg-gradient-to-r ${palette.range} text-white`}
                onClick={() => document.getElementById("review-form")?.scrollIntoView({ behavior: "smooth" })}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                {t.submit}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* List */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse border-neutral-200/60 bg-white/80 backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-900/60">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted" />
                    <div className="flex-1">
                      <div className="h-4 w-2/3 rounded bg-muted mb-2" />
                      <div className="h-3 w-1/2 rounded bg-muted" />
                    </div>
                  </div>
                  <div className="h-3 w-full rounded bg-muted" />
                  <div className="h-3 w-4/5 rounded bg-muted" />
                </CardContent>
              </Card>
            ))
          ) : items.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className={`mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br ${palette.range} text-white/50`}>
                <MessageCircle className="h-8 w-8" />
              </div>
              <p className="text-lg text-muted-foreground">
                {locale === "ar" ? "كن أول من يشارك تجربته معنا" : "Be the first to share your experience"}
              </p>
            </div>
          ) : (
            items.map((r) => (
              <Card
                key={r.id}
                className="group border-neutral-200/60 bg-white/80 backdrop-blur hover:shadow-xl transition-all duration-300 dark:border-neutral-800/60 dark:bg-neutral-900/60"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                        {r.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-base font-semibold">{r.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {locale === "ar" ? "عميل موثق" : "Verified customer"}
                        </div>
                      </div>
                    </div>
                    <Stars value={r.rating} />
                  </div>
                  <blockquote className="text-base leading-relaxed text-muted-foreground italic border-l-4 border-primary/20 pl-4 mb-3">
                    "{r.comment}"
                  </blockquote>
                  <div className="text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination (simple) */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            {locale === "ar" ? "السابق" : "Prev"}
          </Button>
          <div className="px-4 py-2 text-sm text-muted-foreground bg-muted/50 rounded-lg">
            {locale === "ar" ? `صفحة ${page}` : `Page ${page}`}
          </div>
          <Button variant="outline" onClick={() => setPage((p) => p + 1)}>
            {locale === "ar" ? "التالي" : "Next"}
          </Button>
        </div>

        {/* Form */}
        <div id="review-form" className="mx-auto mt-16 max-w-4xl">
          <Card className="border-neutral-200/60 bg-white/80 backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-900/60 shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className={`mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${palette.range} text-white shadow-lg`}>
                <MessageCircle className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl">{t.submit}</CardTitle>
              <p className="text-muted-foreground">
                {locale === "ar" ? "نقدر رأيك ونسعى لتحسين خدماتنا باستمرار" : "We value your feedback and strive to improve our services"}
              </p>
            </CardHeader>
            <CardContent className="grid gap-6 p-8">
              <div className="grid gap-3">
                <Label>{locale === "ar" ? "الاسم" : "Name"}</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder={locale === "ar" ? "اسمك" : "Your name"}
                  className="py-3 text-base"
                />
              </div>
              <div className="grid gap-3">
                <Label>{locale === "ar" ? "البريد (اختياري)" : "Email (optional)"}</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="py-3 text-base"
                />
              </div>
              {/* Honeypot (hidden from users) */}
              <input
                aria-hidden
                tabIndex={-1}
                autoComplete="off"
                name="website"
                value={form.website}
                onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                className="hidden"
              />
              <div className="grid gap-3">
                <Label>{locale === "ar" ? "التقييم" : "Rating"}</Label>
                <div className="flex items-center gap-3">
                  <StarsInput value={form.rating} onChange={(v) => setForm((f) => ({ ...f, rating: v }))} />
                  <span className="text-sm text-muted-foreground">
                    ({form.rating}/5)
                  </span>
                </div>
              </div>
              <div className="grid gap-3">
                <Label>{locale === "ar" ? "التعليق" : "Comment"}</Label>
                <Textarea
                  rows={5}
                  value={form.comment}
                  onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                  placeholder={locale === "ar" ? "اكتب رأيك هنا..." : "Write your review..."}
                  className="text-base resize-none"
                />
              </div>
              <Button 
                onClick={submit} 
                disabled={submitting} 
                size="lg"
                className={`bg-gradient-to-r ${palette.range} text-white shadow-lg hover:shadow-xl transition-all duration-300 py-3`}
              >
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {t.submit}
              </Button>
              <div className="text-sm text-muted-foreground text-center bg-muted/30 rounded-lg p-3">
                {locale === "ar"
                  ? "قد تتم مراجعة تقييمك من قبل الإدارة قبل النشر."
                  : "Your review may be moderated by admins before publishing."}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
