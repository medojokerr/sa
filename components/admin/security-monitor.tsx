"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Shield, 
  Lock, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  Database,
  Zap,
  Globe,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  Users,
  Clock
} from "lucide-react"

interface SecurityMetrics {
  threatLevel: 'low' | 'medium' | 'high'
  blockedAttacks: number
  failedLogins: number
  activeUsers: number
  lastScan: string
  vulnerabilities: number
}

interface PerformanceMetrics {
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  responseTime: number
  uptime: number
  requestsPerMinute: number
}

export function SecurityMonitor() {
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>({
    threatLevel: 'low',
    blockedAttacks: 12,
    failedLogins: 3,
    activeUsers: 47,
    lastScan: new Date().toISOString(),
    vulnerabilities: 0
  })

  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    cpuUsage: 35,
    memoryUsage: 68,
    diskUsage: 45,
    responseTime: 45,
    uptime: 99.9,
    requestsPerMinute: 250
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPerformanceMetrics(prev => ({
        ...prev,
        cpuUsage: Math.max(10, Math.min(90, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(30, Math.min(95, prev.memoryUsage + (Math.random() - 0.5) * 5)),
        responseTime: Math.max(20, Math.min(200, prev.responseTime + (Math.random() - 0.5) * 20)),
        requestsPerMinute: Math.max(100, Math.min(500, prev.requestsPerMinute + (Math.random() - 0.5) * 50))
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'high': return 'destructive'
      case 'medium': return 'secondary'
      default: return 'default'
    }
  }

  const getUsageColor = (usage: number) => {
    if (usage > 85) return 'text-red-600 dark:text-red-400'
    if (usage > 70) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-green-600 dark:text-green-400'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          مراقبة الأمان والأداء
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="security" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              الأمان
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              الأداء
            </TabsTrigger>
          </TabsList>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded">
                      <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">مستوى التهديد</p>
                      <Badge variant={getThreatColor(securityMetrics.threatLevel)}>
                        {securityMetrics.threatLevel === 'low' ? 'منخفض' : 
                         securityMetrics.threatLevel === 'medium' ? 'متوسط' : 'عالي'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900 rounded">
                      <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{securityMetrics.blockedAttacks}</p>
                      <p className="text-sm text-muted-foreground">هجمات محجوبة</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded">
                      <Lock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{securityMetrics.failedLogins}</p>
                      <p className="text-sm text-muted-foreground">محاولات دخول فاشلة</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded">
                      <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{securityMetrics.activeUsers}</p>
                      <p className="text-sm text-muted-foreground">مستخدمين نشطين</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">حالة الحماية</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">جدار الحماية</span>
                    <Badge variant="default">نشط</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">مكافح DDoS</span>
                    <Badge variant="default">نشط</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SSL/TLS</span>
                    <Badge variant="default">مفعل</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Rate Limiting</span>
                    <Badge variant="default">مفعل</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">آخر فحص أمني</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">
                      {new Date(securityMetrics.lastScan).toLocaleString('ar-EG')}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    تم فحص {securityMetrics.vulnerabilities} ثغرة أمنية
                  </div>
                  <Button size="sm" className="w-full">
                    إجراء فحص جديد
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded">
                      <Cpu className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">معالج</p>
                      <div className="flex items-center gap-2">
                        <Progress value={performanceMetrics.cpuUsage} className="h-2 flex-1" />
                        <span className={`text-sm font-bold ${getUsageColor(performanceMetrics.cpuUsage)}`}>
                          {Math.round(performanceMetrics.cpuUsage)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded">
                      <Database className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">ذاكرة</p>
                      <div className="flex items-center gap-2">
                        <Progress value={performanceMetrics.memoryUsage} className="h-2 flex-1" />
                        <span className={`text-sm font-bold ${getUsageColor(performanceMetrics.memoryUsage)}`}>
                          {Math.round(performanceMetrics.memoryUsage)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded">
                      <HardDrive className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">تخزين</p>
                      <div className="flex items-center gap-2">
                        <Progress value={performanceMetrics.diskUsage} className="h-2 flex-1" />
                        <span className={`text-sm font-bold ${getUsageColor(performanceMetrics.diskUsage)}`}>
                          {Math.round(performanceMetrics.diskUsage)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded">
                      <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{performanceMetrics.responseTime}ms</p>
                      <p className="text-sm text-muted-foreground">زمن الاستجابة</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">إحصائيات النشاط</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">طلبات في الدقيقة</span>
                    <Badge variant="outline">{Math.round(performanceMetrics.requestsPerMinute)}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">نسبة التشغيل</span>
                    <Badge variant="default">{performanceMetrics.uptime}%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">متوسط زمن الاستجابة</span>
                    <Badge variant="outline">{performanceMetrics.responseTime}ms</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">التحسينات المقترحة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {performanceMetrics.memoryUsage > 80 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        استخدام الذاكرة مرتفع - فكر في تحسين الكاش
                      </AlertDescription>
                    </Alert>
                  )}
                  {performanceMetrics.cpuUsage > 85 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        استخدام المعالج عالي - تحقق من العمليات الثقيلة
                      </AlertDescription>
                    </Alert>
                  )}
                  {performanceMetrics.memoryUsage <= 80 && performanceMetrics.cpuUsage <= 85 && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        الأداء ممتاز! لا توجد مشاكل
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
