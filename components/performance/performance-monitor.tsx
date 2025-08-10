"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Wifi, Database, Zap } from "lucide-react"

interface PerformanceMetrics {
  loadTime: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  cumulativeLayoutShift: number
  connectionType: string
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Monitor connection status
    const updateOnlineStatus = () => setIsOnline(navigator.onLine)
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    // Collect performance metrics
    if (typeof window !== 'undefined' && 'performance' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        
        // Get Web Vitals
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        const paint = performance.getEntriesByType('paint')
        
        const fcp = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
        const lcp = entries.find(entry => entry.entryType === 'largest-contentful-paint')?.startTime || 0
        
        setMetrics({
          loadTime: navigation?.loadEventEnd - navigation?.loadEventStart || 0,
          firstContentfulPaint: fcp,
          largestContentfulPaint: lcp,
          cumulativeLayoutShift: 0, // Would need layout-shift observer
          connectionType: (navigator as any)?.connection?.effectiveType || 'unknown'
        })
      })

      observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] })
      
      return () => {
        observer.disconnect()
        window.removeEventListener('online', updateOnlineStatus)
        window.removeEventListener('offline', updateOnlineStatus)
      }
    }
  }, [])

  const getPerformanceScore = (value: number, thresholds: [number, number]) => {
    if (value <= thresholds[0]) return { label: 'Good', color: 'bg-emerald-100 text-emerald-700' }
    if (value <= thresholds[1]) return { label: 'Needs Improvement', color: 'bg-amber-100 text-amber-700' }
    return { label: 'Poor', color: 'bg-red-100 text-red-700' }
  }

  if (!metrics) return null

  return (
    <Card className="border-neutral-200/60 bg-white/80 backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-900/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Performance Monitor
          <Badge variant={isOnline ? "default" : "destructive"} className="ml-auto">
            <Wifi className="h-3 w-3 mr-1" />
            {isOnline ? "Online" : "Offline"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">First Contentful Paint</span>
              <Badge className={getPerformanceScore(metrics.firstContentfulPaint, [1800, 3000]).color}>
                {getPerformanceScore(metrics.firstContentfulPaint, [1800, 3000]).label}
              </Badge>
            </div>
            <div className="text-2xl font-bold">{Math.round(metrics.firstContentfulPaint)}ms</div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Largest Contentful Paint</span>
              <Badge className={getPerformanceScore(metrics.largestContentfulPaint, [2500, 4000]).color}>
                {getPerformanceScore(metrics.largestContentfulPaint, [2500, 4000]).label}
              </Badge>
            </div>
            <div className="text-2xl font-bold">{Math.round(metrics.largestContentfulPaint)}ms</div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span>Connection: {metrics.connectionType}</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span>Load: {Math.round(metrics.loadTime)}ms</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}