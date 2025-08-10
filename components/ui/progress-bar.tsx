"use client"

import { cn } from "@/lib/utils"

interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
  color?: "primary" | "success" | "warning" | "error"
}

export function ProgressBar({ 
  value, 
  max = 100, 
  className, 
  showLabel = false,
  color = "primary" 
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  
  const colorClasses = {
    primary: "bg-gradient-to-r from-violet-600 to-emerald-600",
    success: "bg-gradient-to-r from-emerald-500 to-green-600",
    warning: "bg-gradient-to-r from-amber-500 to-orange-600", 
    error: "bg-gradient-to-r from-red-500 to-rose-600"
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-2">
        {showLabel && (
          <span className="text-sm font-medium text-muted-foreground">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-500 ease-out", colorClasses[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}