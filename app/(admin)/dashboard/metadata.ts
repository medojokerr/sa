import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    default: "لوحة الإدارة | KYCtrust",
    template: "%s | لوحة الإدارة | KYCtrust",
  },
  description: "إدارة المحتوى والمراجعات والتقارير والإعدادات في KYCtrust.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "لوحة الإدارة - KYCtrust",
    description: "إدارة المحتوى والمراجعات والتقارير والإعدادات في KYCtrust.",
    url: "/dashboard",
    siteName: "KYCtrust",
    type: "website",
    locale: "ar_EG",
  },
}
