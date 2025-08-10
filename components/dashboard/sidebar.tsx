"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  BarChart2, 
  Settings, 
  PieChart, 
  MessageSquare,
  Eye,
  Monitor,
  Database,
  Shield,
  Globe
} from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()
  const nav = [
    { href: "/dashboard", icon: LayoutDashboard, label: "لوحة التحكم", group: "main" },
    { href: "/dashboard/content", icon: Database, label: "إدارة المحتوى", group: "content" },
    { href: "/dashboard/content/live", icon: Eye, label: "المحرر المباشر", group: "content" },
    { href: "/dashboard/content/snapshots", icon: FileText, label: "نسخ المحتوى", group: "content" },
    { href: "/dashboard/reviews", icon: MessageSquare, label: "التقييمات", group: "content" },
    { href: "/dashboard/users", icon: Users, label: "المستخدمين", group: "admin" },
    { href: "/dashboard/analytics", icon: PieChart, label: "التحليلات", group: "admin" },
    { href: "/dashboard/reports", icon: BarChart2, label: "التقارير", group: "admin" },
    { href: "/dashboard/settings", icon: Settings, label: "الإعدادات", group: "admin" },
    { href: "/dashboard/settings/secrets", icon: Shield, label: "الأسرار", group: "admin" },
  ]

  const groups = {
    main: "الرئيسية",
    content: "المحتوى",
    admin: "الإدارة"
  }

  const groupedNav = nav.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = []
    acc[item.group].push(item)
    return acc
  }, {} as Record<string, typeof nav>)

  return (
    <aside className="hidden h-screen w-64 flex-col border-r bg-background/95 backdrop-blur p-4 md:flex">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-violet-500 rounded-lg">
            <Monitor className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-lg font-bold">لوحة الإدارة</div>
            <div className="text-xs text-muted-foreground">KYCtrust Admin</div>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 space-y-4">
        {Object.entries(groupedNav).map(([group, items]) => (
          <div key={group}>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
              {groups[group]}
            </div>
            <div className="space-y-1">
              {items.map((n) => {
                const active = pathname === n.href
                const Icon = n.icon
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:bg-accent hover:scale-[1.02]",
                      active && "bg-gradient-to-r from-emerald-500/10 to-violet-500/10 text-foreground border border-emerald-500/20",
                    )}
                  >
                    {/* Active gradient indicator */}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute left-0 top-1/2 h-6 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-emerald-500 to-violet-500 transition-all duration-200",
                        active ? "w-1 opacity-100" : "w-0 opacity-0 group-hover:w-1 group-hover:opacity-60",
                      )}
                    />
                    <Icon className={cn(
                      "h-4 w-4 transition-colors",
                      active && "text-emerald-600 dark:text-emerald-400"
                    )} />
                    <span className={cn(
                      "transition-colors",
                      active && "font-medium"
                    )}>{n.label}</span>
                    
                    {/* New badge for live editor */}
                    {n.href === "/dashboard/content/live" && (
                      <span className="text-xs bg-gradient-to-r from-emerald-500 to-violet-500 text-white px-2 py-0.5 rounded-full">
                        جديد
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
      
      <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-violet-50 dark:from-emerald-950/50 dark:to-violet-950/50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="h-4 w-4 text-emerald-600" />
          <span className="text-sm font-medium">الموقع المباشر</span>
        </div>
        <Link 
          href="/" 
          target="_blank"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          عرض الموقع →
        </Link>
      </div>
      
      <div className="mt-2 text-xs text-muted-foreground text-center">
        KYCtrust Admin v2.0
      </div>
    </aside>
  )
}
