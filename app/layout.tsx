import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/layout/navigation"
import Footer from "@/components/layout/footer"
import { AuthProvider } from "@/lib/context/auth-context"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CounselMate - Connect with Top CAs & Lawyers",
  description:
    "A trusted marketplace connecting clients with verified Chartered Accountants and Lawyers for professional services.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://counselmate.app",
    siteName: "CounselMate",
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
          <Navigation />
          <main>{children}</main>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
