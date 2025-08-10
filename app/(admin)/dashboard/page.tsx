"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SimpleLineChart } from "@/components/dashboard/charts"
import { AdminBridge } from "@/components/admin/admin-bridge"
import { SecurityMonitor } from "@/components/admin/security-monitor"
import { useAppSelector } from "@/lib/redux/store"
import { Loader2, RefreshCcw, UsersIcon, Database, Shield, TrendingUp, Activity, Eye, MessageSquare } from 'lucide-react'

type AnalyticsRow = { day: string; visitors: number; leads: number; orders: number; conversion_rate: string }

export default function DashboardHome() {
  const ui = useAppSelector((s) => s.ui)
  const [loading, setLoading] = useState(true)
  const [series, setSeries] = useState<{ t: string; v: number }[]>([])
  const [usersCount, setUsersCount] = useState<number | null>(null)
  const [reviewsCount, setReviewsCount] = useState<number | null>(null)
  const [regenPending, setRegenPending] = useState(false)
  const locale = ui.locale

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const [a, u, r] = await Promise.all([
          fetch("/api/analytics"), 
          fetch("/api/users"),
          fetch("/api/reviews")
        ])
        const aj = (await a.json()) as AnalyticsRow[]
        const sj = aj.map((r) => ({ t: r.day.slice(5), v: r.visitors }))
        if (mounted) setSeries(sj)
        const uj = await u.json()
        if (mounted) setUsersCount(Array.isArray(uj) ? uj.length : null)
        const rj = await r.json()
        if (mounted) setReviewsCount(rj?.summary?.count || 0)
      } catch {
        if (mounted) {
          setSeries([])
          setUsersCount(null)
          setReviewsCount(null)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const kpis = useMemo(
    () => [
      { 
        title: locale === "ar" ? "الزوار (14 يوم)" : "Visitors (14d)", 
        value: series.reduce((a, b) => a + b.v, 0).toLocaleString(),
        icon: Eye,
        color: "text-blue-600",
        bgColor: "bg-blue-50 dark:bg-blue-950/20"
      },
      { 
        title: locale === "ar" ? "��دد المستخدمين" : "Users", 
        value: usersCount === null ? "—" : usersCount.toString(),
        icon: UsersIcon,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50 dark:bg-emerald-950/20"
      },
      { 
        title: locale === "ar" ? "التقييمات" : "Reviews", 
        value: reviewsCount === null ? "—" : reviewsCount.toString(),
        icon: MessageSquare,
        color: "text-purple-600",
        bgColor: "bg-purple-50 dark:bg-purple-950/20"
      },
      { 
        title: locale === "ar" ? "معدل التحويل" : "Conversion Rate", 
        value: series.length ? "2.8%" : "—",
        icon: TrendingUp,
        color: "text-amber-600",
        bgColor: "bg-amber-50 dark:bg-amber-950/20"
      },
    ],
    [locale, series, usersCount, reviewsCount]
  )

  const regen = async () => {
    setRegenPending(true)
    try {
      await fetch("/api/analytics", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ days: 14 }) })
      const a = await fetch("/api/analytics")
      const aj = (await a.json()) as AnalyticsRow[]
      setSeries(aj.map((r) => ({ t: r.day.slice(5), v: r.visitors })))
    } finally {
      setRegenPending(false)
    }
  }

  return (
    <div className="grid gap-6">
      {/* Admin Bridge - Live Connection */}
      <AdminBridge />

      {/* Security & Performance Monitor */}
      <SecurityMonitor />

      {/* Welcome section */}
      <Card className="border-neutral-200/60 bg-gradient-to-r from-violet-50 to-emerald-50 dark:from-violet-950/20 dark:to-emerald-950/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                {locale === "ar" ? "مرحباً بك في لوحة التحكم" : "Welcome to Dashboard"}
              </h1>
              <p className="text-muted-foreground">
                {locale === "ar" ? "إدارة شاملة لموقعك ومحتواه وعملائك" : "Complete management of your site, content, and customers"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                <Activity className="h-3 w-3 me-1" />
                {locale === "ar" ? "نشط" : "Active"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k, i) => (
          <Card key={i} className="hover:shadow-lg transition-all duration-300 border-neutral-200/60 bg-white/80 backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-900/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">{k.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${k.bgColor}`}>
                  <k.icon className={`h-6 w-6 ${k.color}`} />
                </div>
                <div>
                  <div className="text-3xl font-bold">{k.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {locale === "ar" ? "إجمالي" : "Total"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {locale === "ar" ? "الزوار اليوميون" : "Daily Visitors"}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {locale === "ar" ? "آخر 14 يوم" : "Last 14 days"}
            </p>
          </div>
          <Button size="sm" onClick={regen} disabled={regenPending}>
            {regenPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
            {locale === "ar" ? "تحديث البيانات" : "Regenerate"}
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">
                {locale === "ar" ? "جاري التحميل..." : "Loading..."}
              </span>
            </div>
          ) : (
            <SimpleLineChart data={series} height={200} />
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">{locale === "ar" ? "إدارة المستخدمين" : "Manage Users"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {locale === "ar" ? "اعرض وأضف وحدّث واحذف مستخدمين." : "View, add, update, and delete users."}
            </p>
            <Button variant="outline" className="w-full" asChild>
              <a href="/dashboard/users">
                {locale === "ar" ? "الذهاب إلى المستخدمين" : "Go to Users"}
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Database className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">{locale === "ar" ? "نشر المحتوى" : "Publish Content"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {locale === "ar"
                ? "قم بالتعديل من صفحة المحتوى وانشر إلى صفحة الهبوط."
                : "Edit from Content page and publish to the landing page."}
            </p>
            <Button variant="outline" className="w-full" asChild>
              <a href="/dashboard/content">
                {locale === "ar" ? "الذهاب إلى المحتوى" : "Go to Content"}
              </a>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">{locale === "ar" ? "إدارة التقييمات" : "Manage Reviews"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {locale === "ar"
                ? "راجع واعتمد أو ارفض تقييمات العملاء."
                : "Review and approve or reject customer reviews."}
            </p>
            <Button variant="outline" className="w-full" asChild>
              <a href="/dashboard/reviews">
                {locale === "ar" ? "الذهاب إلى التقييمات" : "Go to Reviews"}
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {locale === "ar" ? "حالة النظام" : "System Status"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium">
                  {locale === "ar" ? "قاعدة البيانات" : "Database"}
                </span>
              </div>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                {locale === "ar" ? "متصل" : "Connected"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <span className="text-sm font-medium">
                  {locale === "ar" ? "الأمان" : "Security"}
                </span>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                {locale === "ar" ? "محمي" : "Protected"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-purple-500" />
                <span className="text-sm font-medium">
                  {locale === "ar" ? "الأداء" : "Performance"}
                </span>
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300">
                {locale === "ar" ? "ممتاز" : "Excellent"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
