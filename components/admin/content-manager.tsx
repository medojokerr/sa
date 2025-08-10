"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useCMS } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { 
  Save, 
  Eye, 
  Globe, 
  Settings, 
  Image, 
  Type, 
  Palette,
  Layout,
  Share2,
  BarChart3,
  Users,
  MessageSquare,
  Star
} from "lucide-react"
import { cn } from "@/lib/utils"

export function ContentManager() {
  const { locale, content, design, setContent, setDesign, setLocale } = useCMS()
  const { toast } = useToast()
  const [isPublishing, setIsPublishing] = useState(false)
  const [isDraftMode, setIsDraftMode] = useState(true)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Quick stats for the current locale
  const stats = {
    services: content[locale].services?.length || 0,
    features: content[locale].features?.length || 0,
    faq: content[locale].faq?.length || 0,
    testimonials: content[locale].testimonials?.length || 0
  }

  const saveAsDraft = async () => {
    try {
      // Save to localStorage as draft
      localStorage.setItem('kyctrust-cms-draft', JSON.stringify({
        content,
        design,
        timestamp: new Date().toISOString()
      }))
      setLastSaved(new Date())
      toast({
        title: "تم الحفظ كمسودة",
        description: "تم حفظ التغييرات محلياً"
      })
    } catch (error) {
      toast({
        title: "خطأ في الحفظ",
        description: "فشل في حفظ المسودة",
        variant: "destructive"
      })
    }
  }

  const publishContent = async () => {
    setIsPublishing(true)
    try {
      const response = await fetch('/api/content/published', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, design })
      })

      if (response.ok) {
        setIsDraftMode(false)
        setLastSaved(new Date())
        toast({
          title: "تم النشر بنجاح",
          description: "المحتوى متاح الآن على الموقع"
        })
      } else {
        throw new Error('فشل في النشر')
      }
    } catch (error) {
      toast({
        title: "خطأ في النشر",
        description: "فشل في نشر المحتوى",
        variant: "destructive"
      })
    } finally {
      setIsPublishing(false)
    }
  }

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(saveAsDraft, 30000)
    return () => clearInterval(interval)
  }, [content, design])

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                إدارة المحتوى المتقدمة
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                تحرير ونشر محتوى الموقع مع معاينة مباشرة
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isDraftMode ? "secondary" : "default"}>
                {isDraftMode ? "مسودة" : "منشور"}
              </Badge>
              {lastSaved && (
                <Badge variant="outline" className="text-xs">
                  آخر حفظ: {lastSaved.toLocaleTimeString('ar-EG')}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <Button
                size="sm"
                variant={locale === 'ar' ? 'default' : 'outline'}
                onClick={() => setLocale('ar')}
              >
                العربية
              </Button>
              <Button
                size="sm"
                variant={locale === 'en' ? 'default' : 'outline'}
                onClick={() => setLocale('en')}
              >
                English
              </Button>
            </div>

            <div className="h-6 w-px bg-border" />

            {/* Actions */}
            <Button size="sm" variant="outline" onClick={saveAsDraft}>
              <Save className="h-4 w-4 mr-2" />
              حفظ مسودة
            </Button>
            
            <Button 
              size="sm" 
              onClick={publishContent}
              disabled={isPublishing}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isPublishing ? (
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Share2 className="h-4 w-4 mr-2" />
              )}
              نشر المحتوى
            </Button>

            <Button size="sm" variant="outline" asChild>
              <a href="/" target="_blank">
                <Eye className="h-4 w-4 mr-2" />
                معاينة
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded">
                <Star className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.services}</p>
                <p className="text-sm text-muted-foreground">الخدمات</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded">
                <Layout className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.features}</p>
                <p className="text-sm text-muted-foreground">المميزات</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded">
                <MessageSquare className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.faq}</p>
                <p className="text-sm text-muted-foreground">الأسئلة</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded">
                <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.testimonials}</p>
                <p className="text-sm text-muted-foreground">التقييمات</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Editing Tabs */}
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="site" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="site" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                الموقع
              </TabsTrigger>
              <TabsTrigger value="hero" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                الرئيسية
              </TabsTrigger>
              <TabsTrigger value="services" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                الخدمات
              </TabsTrigger>
              <TabsTrigger value="design" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                التصميم
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                الإحصائيات
              </TabsTrigger>
            </TabsList>

            {/* Site Settings */}
            <TabsContent value="site" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="site-name">اسم الموقع</Label>
                  <Input
                    id="site-name"
                    value={content[locale].site?.name || ''}
                    onChange={(e) => setContent(locale, {
                      site: { ...content[locale].site, name: e.target.value }
                    })}
                    placeholder="اسم الموقع"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site-phone">رقم التواصل</Label>
                  <Input
                    id="site-phone"
                    value={content[locale].site?.phone || ''}
                    onChange={(e) => setContent(locale, {
                      site: { ...content[locale].site, phone: e.target.value }
                    })}
                    placeholder="+20-XXX-XXX-XXXX"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-description">وصف الموقع</Label>
                <Textarea
                  id="site-description"
                  value={content[locale].site?.description || ''}
                  onChange={(e) => setContent(locale, {
                    site: { ...content[locale].site, description: e.target.value }
                  })}
                  placeholder="وصف مختصر للموقع"
                  rows={3}
                />
              </div>
            </TabsContent>

            {/* Hero Section */}
            <TabsContent value="hero" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hero-title">العنوان الرئيسي</Label>
                  <Input
                    id="hero-title"
                    value={content[locale].hero?.title || ''}
                    onChange={(e) => setContent(locale, {
                      hero: { ...content[locale].hero, title: e.target.value }
                    })}
                    placeholder="العنوان الرئيسي"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero-subtitle">العنوان الفرعي</Label>
                  <Input
                    id="hero-subtitle"
                    value={content[locale].hero?.subtitle || ''}
                    onChange={(e) => setContent(locale, {
                      hero: { ...content[locale].hero, subtitle: e.target.value }
                    })}
                    placeholder="العنوان الفرعي"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-description">الوصف</Label>
                <Textarea
                  id="hero-description"
                  value={content[locale].hero?.description || ''}
                  onChange={(e) => setContent(locale, {
                    hero: { ...content[locale].hero, description: e.target.value }
                  })}
                  placeholder="وصف القسم الرئيسي"
                  rows={4}
                />
              </div>
            </TabsContent>

            {/* Services */}
            <TabsContent value="services" className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">إدارة الخدمات</h3>
                <Button size="sm">
                  إضافة خدمة جديدة
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {content[locale].services?.slice(0, 6).map((service, index) => (
                  <Card key={index} className="border-dashed">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{service.icon}</span>
                        <span className="font-medium">{service.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{service.price}</Badge>
                        <Button size="sm" variant="outline">تعديل</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Design Settings */}
            <TabsContent value="design" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">إعدادات المظهر</h3>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dark-mode">الوضع الليلي</Label>
                    <Switch id="dark-mode" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="animations">الحركات والتأثيرات</Label>
                    <Switch 
                      id="animations"
                      checked={design.anim?.enableReveal !== false}
                      onCheckedChange={(checked) => setDesign({
                        anim: { ...design.anim, enableReveal: checked }
                      })}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">الألوان والتدرجات</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {['emerald-violet', 'blue-purple', 'orange-red'].map((palette) => (
                      <Button
                        key={palette}
                        size="sm"
                        variant={design.palette === palette ? 'default' : 'outline'}
                        onClick={() => setDesign({ palette })}
                        className="h-12"
                      >
                        <div className={cn(
                          "w-full h-8 rounded bg-gradient-to-r",
                          palette === 'emerald-violet' && 'from-emerald-500 to-violet-500',
                          palette === 'blue-purple' && 'from-blue-500 to-purple-500',
                          palette === 'orange-red' && 'from-orange-500 to-red-500'
                        )} />
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Analytics Preview */}
            <TabsContent value="analytics" className="space-y-4 mt-6">
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">إحصائيات الموقع</h3>
                <p className="text-sm text-muted-foreground">
                  ستظهر هنا إحصائيات مفصلة عن الزوار والتفاعل مع المحتوى
                </p>
                <Button className="mt-4" asChild>
                  <a href="/dashboard/analytics">
                    عرض التقرير الكامل
                  </a>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
