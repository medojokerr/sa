"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { useCMS } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import {
  Zap,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Globe,
  Eye,
  RotateCcw,
  Activity,
  TrendingUp,
  Users,
  MessageSquare
} from "lucide-react"

interface SiteMetrics {
  visitors: number
  pageViews: number
  responseTime: number
  uptime: number
  lastUpdate: string
}

interface BridgeStatus {
  connected: boolean
  lastSync: Date | null
  pendingChanges: number
  errors: string[]
}

export function AdminBridge() {
  const { content, design } = useCMS()
  const { toast } = useToast()
  const [status, setStatus] = useState<BridgeStatus>({
    connected: true,
    lastSync: null,
    pendingChanges: 0,
    errors: []
  })
  
  const [metrics, setMetrics] = useState<SiteMetrics>({
    visitors: 1247,
    pageViews: 3891,
    responseTime: 45,
    uptime: 99.9,
    lastUpdate: new Date().toISOString()
  })

  const [syncProgress, setSyncProgress] = useState(0)
  const [isSyncing, setIsSyncing] = useState(false)

  // Simulate real-time metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        visitors: prev.visitors + Math.floor(Math.random() * 3),
        pageViews: prev.pageViews + Math.floor(Math.random() * 8),
        responseTime: 40 + Math.floor(Math.random() * 20),
        lastUpdate: new Date().toISOString()
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Simulate sync progress
  const syncChanges = async () => {
    setIsSyncing(true)
    setSyncProgress(0)

    // Simulate sync steps
    const steps = [
      { name: "تحليل التغييرات", duration: 1000 },
      { name: "تحديث قاعدة البيانات", duration: 1500 },
      { name: "تحديث الكاش", duration: 800 },
      { name: "إرسال إشعارات", duration: 500 },
      { name: "التحقق من الصحة", duration: 700 }
    ]

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i]
      await new Promise(resolve => setTimeout(resolve, step.duration))
      setSyncProgress(((i + 1) / steps.length) * 100)
    }

    setStatus(prev => ({
      ...prev,
      lastSync: new Date(),
      pendingChanges: 0
    }))

    setIsSyncing(false)
    setSyncProgress(0)

    toast({
      title: "تم المزامنة بنجاح",
      description: "تم تطبيق جميع التغييرات على الموقع المباشر"
    })
  }

  const checkSiteHealth = async () => {
    // Simulate health check
    toast({
      title: "فحص صحة الموقع",
      description: "جاري فحص حالة الموقع..."
    })

    await new Promise(resolve => setTimeout(resolve, 2000))

    toast({
      title: "الموقع يعمل بشكل مثالي",
      description: `زمن الاستجابة: ${metrics.responseTime}ms | نسبة التشغيل: ${metrics.uptime}%`
    })
  }

  return (
    <div className="space-y-6">
      {/* Bridge Status Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              جسر الإدارة - الموقع المباشر
            </div>
            <Badge variant={status.connected ? "default" : "destructive"}>
              {status.connected ? "متصل" : "غير متصل"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded">
                <Activity className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium">حالة الاتصال</p>
                <p className="text-xs text-muted-foreground">
                  {status.connected ? "نشط" : "غير متصل"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded">
                <RotateCcw className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium">آخر مزامنة</p>
                <p className="text-xs text-muted-foreground">
                  {status.lastSync ? status.lastSync.toLocaleTimeString('ar-EG') : "لم تتم"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded">
                <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-medium">تغييرات معلقة</p>
                <p className="text-xs text-muted-foreground">
                  {status.pendingChanges} تغيير
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded">
                <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium">زمن الاستجابة</p>
                <p className="text-xs text-muted-foreground">
                  {metrics.responseTime}ms
                </p>
              </div>
            </div>
          </div>

          {/* Sync Progress */}
          {isSyncing && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">جاري المزامنة...</span>
                <span className="text-sm font-medium">{Math.round(syncProgress)}%</span>
              </div>
              <Progress value={syncProgress} className="h-2" />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 mt-4">
            <Button 
              onClick={syncChanges}
              disabled={isSyncing || status.pendingChanges === 0}
              size="sm"
            >
              {isSyncing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RotateCcw className="h-4 w-4 mr-2" />
              )}
              مزامنة التغييرات
            </Button>

            <Button 
              onClick={checkSiteHealth}
              variant="outline"
              size="sm"
            >
              <Activity className="h-4 w-4 mr-2" />
              فحص صحة الموقع
            </Button>

            <Button 
              variant="outline"
              size="sm"
              asChild
            >
              <a href="/" target="_blank">
                <Globe className="h-4 w-4 mr-2" />
                عرض الموقع
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Live Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded">
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{metrics.visitors.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">الزوار اليوم</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded">
                <Eye className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{metrics.pageViews.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">مشاهدات الصفحة</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded">
                <Activity className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{metrics.responseTime}ms</p>
                <p className="text-sm text-muted-foreground">زمن الاستجابة</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded">
                <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{metrics.uptime}%</p>
                <p className="text-sm text-muted-foreground">نسبة التشغيل</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>إجراءات سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex-col" variant="outline" asChild>
              <a href="/dashboard/content/live">
                <Eye className="h-6 w-6 mb-2" />
                محرر مباشر
              </a>
            </Button>

            <Button className="h-20 flex-col" variant="outline" asChild>
              <a href="/dashboard/analytics">
                <TrendingUp className="h-6 w-6 mb-2" />
                التحليلات
              </a>
            </Button>

            <Button className="h-20 flex-col" variant="outline" asChild>
              <a href="/dashboard/reviews">
                <MessageSquare className="h-6 w-6 mb-2" />
                إدارة التقييمات
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Alerts */}
      {status.errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>تحذير</AlertTitle>
          <AlertDescription>
            هناك بعض المشاكل التي تحتاج إلى انتباه:
            <ul className="mt-2 list-disc list-inside">
              {status.errors.map((error, index) => (
                <li key={index} className="text-sm">{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
