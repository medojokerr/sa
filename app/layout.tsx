import type { Metadata } from 'next'
import type { Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: {
    default: 'KYCtrust | شريكك الموثوق في العالم الرقمي',
    template: '%s | KYCtrust',
  },
  description:
    'خدمة متخصصة في الحسابات البنكية الإلكترونية والخدمات المالية الآمنة. حلول موثوقة وسريعة مع دعم 24/7.',
  generator: 'v0.dev',
  manifest: '/site.webmanifest',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  applicationName: 'KYCtrust',
  keywords: [
    'KYCtrust',
    'حسابات بنكية إلكترونية',
    'محافظ رقمية',
    'Payoneer',
    'Wise',
    'Skrill',
    'Neteller',
    'خدمات مالية',
    'digital banking',
    'e-wallets',
    'financial services',
    'secure payments',
    'crypto exchange accounts'
  ],
  icons: {
    icon: [
      { url: '/placeholder-logo.png', type: 'image/png', sizes: '32x32' },
      { url: '/placeholder-logo.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [
      { url: '/placeholder-logo.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/placeholder-logo.png'],
  },
  openGraph: {
    title: 'KYCtrust | منصة متكاملة للخدمات المالية الرقمية',
    description:
      'احصل على أفضل الحسابات البنكية الإلكترونية والمحافظ الرقمية بأمان وسرعة لا مثيل لها.',
    type: 'website',
    url: '/',
    siteName: 'KYCtrust',
    locale: 'ar_EG',
    images: [
      {
        url: '/generic-brand-logo.png',
        width: 1200,
        height: 630,
        alt: 'KYCtrust - الخدمات المالية الرقمية',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KYCtrust | منصة متكاملة للخدمات المالية الرقمية',
    description:
      'احصل على أفضل الحسابات البنكية الإلكترونية والمحافظ الرقمية بأمان وسرعة لا مثيل لها.',
    images: ['/generic-brand-logo.png'],
  },
  alternates: {
    canonical: '/',
    languages: {
      ar: '/',
      en: '/en',
    },
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0f19' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://wa.me" />
        <link rel="dns-prefetch" href="https://api.kyctrust.site" />
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #7c3aed, #10b981);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #6d28d9, #059669);
}
        `}</style>
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:start-2 focus:top-2 focus:z-50 focus:rounded focus:bg-emerald-600 focus:px-3 focus:py-2 focus:text-white"
          >
            تخطّي إلى المحتوى
          </a>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
