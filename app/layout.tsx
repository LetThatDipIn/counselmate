import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/context/auth-context"
import { Toaster } from "@/components/ui/sonner"
import SidebarLayout from "@/components/layout/sidebar-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Consultancy - Find Verified Professionals",
  description:
    "A trusted marketplace connecting clients with verified Chartered Accountants and Consultants for professional services.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://consultancy.app",
    siteName: "Consultancy",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <SidebarLayout>
            {children}
          </SidebarLayout>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
