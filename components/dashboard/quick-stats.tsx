"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuickStatsProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  color?: "blue" | "emerald" | "purple" | "amber"
}

export function QuickStats({ 
  title, 
  value, 
  change, 
  changeLabel, 
  icon,
  color = "blue" 
}: QuickStatsProps) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400"
  }

  const getTrendIcon = () => {
    if (!change) return <Minus className="h-3 w-3" />
    if (change > 0) return <TrendingUp className="h-3 w-3" />
    if (change < 0) return <TrendingDown className="h-3 w-3" />
    return <Minus className="h-3 w-3" />
  }

  const getTrendColor = () => {
    if (!change) return "text-muted-foreground"
    if (change > 0) return "text-emerald-600"
    if (change < 0) return "text-red-600"
    return "text-muted-foreground"
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-muted-foreground flex items-center justify-between">
          {title}
          {icon && (
            <div className={cn("p-2 rounded-lg", colorClasses[color])}>
              {icon}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-end justify-between">
          <div className="text-3xl font-bold">{value}</div>
          {change !== undefined && (
            <Badge variant="secondary" className={cn("gap-1", getTrendColor())}>
              {getTrendIcon()}
              {Math.abs(change)}%
              {changeLabel && <span className="text-xs">{changeLabel}</span>}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}