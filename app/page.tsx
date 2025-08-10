"use client"

import React, { useEffect } from "react"
import dynamic from "next/dynamic"
import { useTheme } from "next-themes"
import { useCMS } from "@/lib/store"
import { Shield } from "lucide-react"
import { subscribePublished } from "@/lib/realtime"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { StructuredData } from "@/components/seo/structured-data"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
// Lazy-loaded, non-critical components to reduce initial bundle size
const ChatbotWidget = dynamic(
  () => import("@/components/chatbot/chatbot-widget").then(m => m.ChatbotWidget),
  { ssr: false, loading: () => null }
)
const PerfHints = dynamic(
  () => import("@/components/perf/perf-hints").then(m => m.PerfHints),
  { ssr: false, loading: () => null }
)
const ReviewsSection = dynamic(
  () => import("@/components/reviews/reviews-section").then(m => m.ReviewsSection),
  { ssr: false, loading: () => <div className="py-8 opacity-50" /> }
)
const BlocksRenderer = dynamic(
  () => import("@/components/blocks/blocks-renderer").then(m => m.BlocksRenderer),
  { ssr: false, loading: () => <div className="py-8" /> }
)

// localStorage hook (client-safe) - commented out as unused
// function useLocalStorage<T>(key: string, initialValue: T) {
//   const [value, setValue] = React.useState<T>(initialValue)

//   useEffect(() => {
//     try {
//       const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null
//       if (raw != null) setValue(JSON.parse(raw))
//     } catch {
//       // ignore
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   useEffect(() => {
//     try {
//       if (typeof window !== "undefined") {
//         window.localStorage.setItem(key, JSON.stringify(value))
//       }
//     } catch {
//       // ignore
//     }
//   }, [key, value])

//   return [value, setValue] as const
// }

// Data
const siteData: Record<string, unknown> = {
  ar: {
    site: {
      name: "KYCtrust",
      description: "خدمة متخصصة في الحسابات البنكية الإلكترونية والخدمات المالية الآمنة",
      phone: "+20-106-245-3344",
      tagline: "شريكك الموثوق في العالم الرقمي",
    },
    hero: {
      title: "KYCtrust",
      subtitle: "منصة متكاملة للخدمات المالية الرقمية",
      description: "احصل على أفضل الحسابات البنكية الإلكترونية والمحافظ الرقمية بأمان وسرعة لا مثيل لها",
      cta: "ابدأ رحلتك المالية",
      secondary: "تصفح خدماتنا",
      stats: [
        { number: "1000+", label: "عميل راضي" },
        { number: "24/7", label: "دعم فني" },
        { number: "99.9%", label: "معدل النجاح" },
        { number: "15+", label: "خدمة متاحة" },
      ],
    },
    services: [
      {
        name: "Payoneer",
        price: "$30",
        category: "حسابات بنكية",
        icon: "💳",
        popular: true,
        active: true,
        sort: 1,
        description: "حساب بنكي عالمي موثوق",
      },
      {
        name: "Wise",
        price: "$30",
        category: "حسابات بنكية",
        icon: "🏦",
        popular: true,
        active: true,
        sort: 2,
        description: "تحويلات دولية بأقل رسوم",
      },
      {
        name: "Skrill",
        price: "$20",
        category: "محافظ إلكترونية",
        icon: "💰",
        active: true,
        sort: 3,
        description: "محفظة إلكترونية آمنة وسريعة",
      },
      {
        name: "Neteller",
        price: "$20",
        category: "محافظ إلكترونية",
        icon: "💸",
        active: true,
        sort: 4,
        description: "مدفوعات فورية عالميا",
      },
      {
        name: "Kast",
        price: "$20",
        category: "محافظ إلكترونية",
        icon: "🎯",
        active: true,
        sort: 5,
        description: "حلول دفع مبتكرة",
      },
      {
        name: "Redotpay",
        price: "$20",
        category: "محافظ إلكترونية",
        icon: "🔴",
        active: true,
        sort: 6,
        description: "بطاقات افتراضية متقدمة",
      },
      {
        name: "Okx",
        price: "$20",
        category: "عملات رقمية",
        icon: "⚡",
        active: true,
        sort: 7,
        description: "منصة تداول العملات المشفرة",
      },
      {
        name: "World First",
        price: "$20",
        category: "حسابات بنكية",
        icon: "🌍",
        active: true,
        sort: 8,
        description: "خدمات مصرفية دولية",
      },
      {
        name: "Bybit",
        price: "$20",
        category: "عملات رقمية",
        icon: "📈",
        active: true,
        sort: 9,
        description: "تداول العقود الآجلة",
      },
      {
        name: "Bitget",
        price: "$20",
        category: "عملات رقمية",
        icon: "🚀",
        active: true,
        sort: 10,
        description: "منصة تداول متطورة",
      },
      {
        name: "Kucoin",
        price: "$20",
        category: "عملات رقمية",
        icon: "🔥",
        active: true,
        sort: 11,
        description: "بورصة عملات رقمية شاملة",
      },
      {
        name: "PayPal",
        price: "$15",
        category: "محافظ إلكترونية",
        icon: "💙",
        popular: true,
        active: true,
        sort: 12,
        description: "الحل الأشهر للمدفوعات",
      },
      {
        name: "Mexc",
        price: "$20",
        category: "عملات رقمية",
        icon: "💎",
        active: true,
        sort: 13,
        description: "منصة تداول عملات رقمية",
      },
      {
        name: "Exness",
        price: "$20",
        category: "تداول",
        icon: "📊",
        active: true,
        sort: 14,
        description: "وسيط فوركس موثوق",
      },
      {
        name: "شحن فودافون كاش",
        price: "120 جنيه/100 جنيه",
        note: "خصم للكميات الكبيرة",
        category: "خدمات محلية",
        icon: "📱",
        active: true,
        sort: 15,
        description: "شحن فوري بأفضل سعر",
      },
      {
        name: "سحب من TikTok",
        price: "حسب المبلغ",
        category: "خدمات خاصة",
        icon: "🎵",
        active: true,
        sort: 16,
        description: "سحب أرباح تيك توك بسهولة",
      },
      {
        name: "سحب من PayPal",
        price: "حسب المبلغ",
        category: "خدمات خاصة",
        icon: "💰",
        active: true,
        sort: 17,
        description: "تحويل أموال PayPal محليا",
      },
    ],
    payments: [
      { label: "فودافون كاش", value: "01062453344", icon: "📱", color: "red" },
      { label: "USDT TRC20", value: "TFUt8GRpk2R8Wv3FvoCiSUghRBQo4HrmQK", icon: "₿", color: "green" },
    ],
    features: [
      { title: "خدمة سريعة", desc: "تسليم خلال 24-48 ساعة", icon: <Shield className="h-6 w-6" /> },
      { title: "أمان مضمون", desc: "حماية كاملة لبياناتك", icon: <Shield className="h-6 w-6" /> },
      { title: "دعم مستمر", desc: "فريق دعم على مدار الساعة", icon: <Shield className="h-6 w-6" /> },
      { title: "أسعار تنافسية", desc: "أفضل الأسعار في السوق", icon: <Shield className="h-6 w-6" /> },
    ],
    faq: [
      {
        question: "كم تستغرق عملية إنشاء الحساب؟",
        answer:
          "عادة من 24-48 ساعة حسب نوع الحساب والمتطلبات. نحن نعمل بأقصى سرعة لضمان حصولك على حسابك في أسرع وقت ممكن.",
      },
      {
        question: "هل الخدمة آمنة ومضمونة؟",
        answer:
          "نعم تماماً، نتبع أعلى معايير الأمان العالمية ونحافظ على سرية بياناتك الشخصية. كما نقدم ضمان استرداد المال في حالة عدم نجاح العملية.",
      },
      {
        question: "ما هي طرق الدفع المتاحة؟",
        answer: "نقبل الدفع عبر فودافون كاش والعملات الرقمية USDT TRC20 فقط لضمان الأمان والسرعة ��ي المعاملات.",
      },
      {
        question: "هل تقدمون خدمة ما بعد البيع؟",
        answer: "بالطبع، نقدم دعم فني مجاني مدى الحياة لجميع عملائنا مع إرشادات مفصلة لاست��دام حساباتكم الجديدة.",
      },
    ],
    contact: {
      title: "ابدأ معنا اليوم",
      subtitle: "فريق الدعم متاح على مدار الساعة للإجابة على استفساراتك",
      whatsapp: "تواصل عبر واتساب",
      features: ["رد فوري", "استشارة مجانية", "ضمان الخدمة"],
    },
  },
  en: {
    site: {
      name: "KYCtrust",
      description: "Specialized service for secure electronic banking accounts and financial services",
      phone: "+20-106-245-3344",
      tagline: "Your trusted partner in the digital world",
    },
    hero: {
      title: "KYCtrust",
      subtitle: "Complete Digital Financial Services Platform",
      description: "Get the best electronic banking accounts and digital wallets with unmatched security and speed",
      cta: "Start Your Financial Journey",
      secondary: "Browse Our Services",
      stats: [
        { number: "1000+", label: "Happy Clients" },
        { number: "24/7", label: "Support" },
        { number: "99.9%", label: "Success Rate" },
        { number: "15+", label: "Services" },
      ],
    },
    services: [
      {
        name: "Payoneer",
        price: "$30",
        category: "Banking",
        icon: "💳",
        popular: true,
        active: true,
        sort: 1,
        description: "Trusted global banking account",
      },
      {
        name: "Wise",
        price: "$30",
        category: "Banking",
        icon: "🏦",
        popular: true,
        active: true,
        sort: 2,
        description: "International transfers with lowest fees",
      },
      {
        name: "Skrill",
        price: "$20",
        category: "E-Wallets",
        icon: "💰",
        active: true,
        sort: 3,
        description: "Safe and fast digital wallet",
      },
      {
        name: "Neteller",
        price: "$20",
        category: "E-Wallets",
        icon: "💸",
        active: true,
        sort: 4,
        description: "Instant payments worldwide",
      },
      {
        name: "Kast",
        price: "$20",
        category: "E-Wallets",
        icon: "🎯",
        active: true,
        sort: 5,
        description: "Innovative payment solutions",
      },
      {
        name: "Redotpay",
        price: "$20",
        category: "E-Wallets",
        icon: "🔴",
        active: true,
        sort: 6,
        description: "Advanced virtual cards",
      },
      {
        name: "Okx",
        price: "$20",
        category: "Crypto",
        icon: "⚡",
        active: true,
        sort: 7,
        description: "Crypto trading platform",
      },
      {
        name: "World First",
        price: "$20",
        category: "Banking",
        icon: "🌍",
        active: true,
        sort: 8,
        description: "International banking services",
      },
      {
        name: "Bybit",
        price: "$20",
        category: "Crypto",
        icon: "📈",
        active: true,
        sort: 9,
        description: "Futures trading platform",
      },
      {
        name: "Bitget",
        price: "$20",
        category: "Crypto",
        icon: "🚀",
        active: true,
        sort: 10,
        description: "Advanced trading platform",
      },
      {
        name: "Kucoin",
        price: "$20",
        category: "Crypto",
        icon: "🔥",
        active: true,
        sort: 11,
        description: "Comprehensive crypto exchange",
      },
      {
        name: "PayPal",
        price: "$15",
        category: "E-Wallets",
        icon: "💙",
        popular: true,
        active: true,
        sort: 12,
        description: "Most popular payment solution",
      },
      {
        name: "Mexc",
        price: "$20",
        category: "Crypto",
        icon: "💎",
        active: true,
        sort: 13,
        description: "Crypto trading exchange",
      },
      {
        name: "Exness",
        price: "$20",
        category: "Trading",
        icon: "📊",
        active: true,
        sort: 14,
        description: "Trusted forex broker",
      },
      {
        name: "Vodafone Cash Top-up",
        price: "120 EGP/100 EGP",
        note: "Bulk discount available",
        category: "Local Services",
        icon: "📱",
        active: true,
        sort: 15,
        description: "Instant top-up best rates",
      },
      {
        name: "TikTok Withdrawal",
        price: "Based on amount",
        category: "Special Services",
        icon: "🎵",
        active: true,
        sort: 16,
        description: "Easy TikTok earnings withdrawal",
      },
      {
        name: "PayPal Withdrawal",
        price: "Based on amount",
        category: "Special Services",
        icon: "💰",
        active: true,
        sort: 17,
        description: "Local PayPal money transfer",
      },
    ],
    payments: [
      { label: "Vodafone Cash", value: "01062453344", icon: "📱", color: "red" },
      { label: "USDT TRC20", value: "TFUt8GRpk2R8Wv3FvoCiSUghRBQo4HrmQK", icon: "₿", color: "green" },
    ],
    features: [
      { title: "Fast Service", desc: "Delivery within 24-48 hours", icon: <Shield className="h-6 w-6" /> },
      { title: "Guaranteed Security", desc: "Complete protection for your data", icon: <Shield className="h-6 w-6" /> },
      { title: "Continuous Support", desc: "24/7 support team", icon: <Shield className="h-6 w-6" /> },
      { title: "Competitive Prices", desc: "Best prices in the market", icon: <Shield className="h-6 w-6" /> },
    ],
    faq: [
      {
        question: "How long does account creation take?",
        answer:
          "Usually 24-48 hours depending on account type and requirements. We work at maximum speed to ensure you get your account as soon as possible.",
      },
      {
        question: "Is the service safe and guaranteed?",
        answer:
          "Absolutely yes, we follow the highest international security standards and maintain confidentiality of your personal data. We also offer money-back guarantee if the process fails.",
      },
      {
        question: "What payment methods are available?",
        answer:
          "We accept payments via Vodafone Cash and USDT TRC20 cryptocurrency only to ensure security and speed in transactions.",
      },
      {
        question: "Do you provide after-sales service?",
        answer:
          "Of course, we provide free lifetime technical support for all our clients with detailed instructions for using your new accounts.",
      },
    ],
    contact: {
      title: "Get Started Today",
      subtitle: "Support team available 24/7 to answer your questions",
      whatsapp: "Contact via WhatsApp",
      features: ["Instant Reply", "Free Consultation", "Service Guarantee"],
    },
  },
}

// function buildWhatsApp(service: string, price: string, locale = "ar") {
//   const phone = "201062453344"
//   const timestamp = Date.now()
//   const requestId = `LP-${timestamp}`

//   const messages: Record<string, string> = {
//     ar: `🔥 طلب خدمة من KYCtrust

// 📋 تفاصيل الطلب:
// • الخدمة: ${service}
// • السعر: ${price}
// • اللغة: ${locale}
// • معرف الطلب: ${requestId}

// ⏰ سنرد عليك خلال 15 دقيقة
// 🛡️ خدمة آمنة ومضمونة 100%`,
//     en: `🔥 Service Request from KYCtrust

// 📋 Order Details:
// • Service: ${service}
// • Price: ${price}
// • Language: ${locale}
// • Request ID: ${requestId}

// ⏰ We'll reply within 15 minutes
// 🛡️ 100% Safe and Guaranteed Service`,
//   }

//   const text = encodeURIComponent(messages[locale] || messages.ar)
//   return `https://wa.me/${phone}?text=${text}`
// }

// function useInViewAnimation() {
//   const [visibleMap, setVisibleMap] = React.useState<Record<string, boolean>>({})

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         for (const entry of entries) {
//           const id = (entry.target as HTMLElement).dataset["animId"]
//           if (!id) continue
//           if (entry.isIntersecting) {
//             setVisibleMap((p) => ({ ...p, [id]: true }))
//             observer.unobserve(entry.target)
//           }
//         }
//       },
//       { threshold: 0.12 },
//     )

//     const nodes = document.querySelectorAll("[data-anim-id]")
//     nodes.forEach((n) => observer.observe(n))

//     return () => observer.disconnect()
//   }, [])

//   return (id: string, extra = "") =>
//     [
//       "transition-all duration-700 will-change-transform",
//       visibleMap[id] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
//       extra,
//     ].join(" ")
// }

// function CopyField({ value }: { value: string }) {
//   const [copied, setCopied] = React.useState(false)
//   const onCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(value)
//       setCopied(true)
//       setTimeout(() => setCopied(false), 1500)
//     } catch {
//       // ignore
//     }
//   }
//   return (
//     <button
//       variant="ghost"
//       size="icon"
//       aria-label={copied ? "Copied" : "Copy"}
//       onClick={onCopy}
//       className="hover:scale-110"
//     >
//       {copied ? <Shield className="h-4 w-4 text-emerald-500" /> : <Shield className="h-4 w-4" />}
//     </button>
//   )
// }

export default function Page() {
  const { design, locale, setContent, setDesign } = useCMS()
  const { setTheme } = useTheme()

  // Sync theme and dir/lang
  useEffect(() => {
    if (design.theme !== "system") setTheme(design.theme)
    document.documentElement.setAttribute("dir", locale === "ar" ? "rtl" : "ltr")
    document.documentElement.setAttribute("lang", locale)
  }, [design.theme, locale, setTheme])

  // Load published content when available
  useEffect(() => {
    ;(async () => {
      try {
        const r = await fetch("/api/content/published", { cache: "no-store" })
        if (!r.ok) return
        const j = await r.json()
        if (j && j.ar && j.en) {
          setContent("ar", j.ar)
          setContent("en", j.en)
          if (j.design) setDesign(j.design)
        }
      } catch {}
    })()
  }, [setContent, setDesign])

  // Refetch on publish broadcast
  const refetchPublished = React.useCallback(async () => {
    try {
      const r = await fetch("/api/content/published", { cache: "no-store" })
      if (!r.ok) return
      const j = await r.json()
      if (j && j.ar && j.en) {
        setContent("ar", j.ar)
        setContent("en", j.en)
        if (j.design) setDesign(j.design)
      }
    } catch {}
  }, [setContent, setDesign])

  useEffect(() => {
    const unsub = subscribePublished(() => {
      refetchPublished()
    })
    return () => unsub()
  }, [refetchPublished])

  // Live preview from localStorage (while editing)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== "kyctrust-cms" || !e.newValue) return
      try {
        const parsed = JSON.parse(e.newValue)
        const state = parsed.state || parsed
        if (state?.content) {
          if (state.content.ar) setContent("ar", state.content.ar)
          if (state.content.en) setContent("en", state.content.en)
        }
        if (state?.design) setDesign(state.design)
      } catch {}
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [setContent, setDesign])

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-gradient-to-b from-neutral-50 via-emerald-50/30 to-blue-50/20 text-neutral-900 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-950 dark:text-neutral-100">
        <StructuredData />
        <PerfHints />
        <SiteHeader />
        <main id="main-content">
          <BlocksRenderer />
          <ReviewsSection />
        </main>
        <SiteFooter />
        <ChatbotWidget />
        <Toaster />
      </div>
    </ThemeProvider>
  )
}
