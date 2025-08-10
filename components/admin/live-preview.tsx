"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCMS } from "@/lib/store"
import { Eye, ExternalLink, RefreshCw, Monitor, Smartphone, Tablet } from "lucide-react"
import { cn } from "@/lib/utils"

export function LivePreview() {
  const { locale, content, design } = useCMS()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Simulate live preview refresh
  const refreshPreview = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLastUpdate(new Date())
    setIsRefreshing(false)
  }

  // Auto-refresh when content changes
  useEffect(() => {
    setLastUpdate(new Date())
  }, [content, design])

  const getViewModeClass = () => {
    switch (viewMode) {
      case 'mobile':
        return 'w-[375px] h-[667px]'
      case 'tablet':
        return 'w-[768px] h-[1024px]'
      default:
        return 'w-full h-[800px]'
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            معاينة مباشرة
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              آخر تحديث: {lastUpdate.toLocaleTimeString('ar-EG')}
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={refreshPreview}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a href="/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                فتح في تبويب جديد
              </a>
            </Button>
          </div>
        </div>
        
        {/* View Mode Selector */}
        <div className="flex items-center gap-2 pt-2">
          <Button
            size="sm"
            variant={viewMode === 'desktop' ? 'default' : 'outline'}
            onClick={() => setViewMode('desktop')}
          >
            <Monitor className="h-4 w-4 mr-2" />
            سطح المكتب
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'tablet' ? 'default' : 'outline'}
            onClick={() => setViewMode('tablet')}
          >
            <Tablet className="h-4 w-4 mr-2" />
            تابلت
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'mobile' ? 'default' : 'outline'}
            onClick={() => setViewMode('mobile')}
          >
            <Smartphone className="h-4 w-4 mr-2" />
            موبايل
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 h-full overflow-auto">
          <div className={cn("mx-auto bg-white dark:bg-black rounded border shadow-lg transition-all duration-300", getViewModeClass())}>
            <iframe
              src="/"
              className="w-full h-full rounded"
              title="Live Preview"
              key={lastUpdate.getTime()}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
