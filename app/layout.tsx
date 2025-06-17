import type React from "react"
import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "QQ's Sweet Dreams - Marcador de Competición",
  description:
    "Aplicación de marcador para la competición QQ's Sweet Dreams. Sigue las puntuaciones, apuestas y clasificaciones en tiempo real.",
  keywords: ["marcador", "competición", "QQ Sweet Dreams", "puntuaciones", "apuestas", "clasificación"],
  authors: [{ name: "QQ's Sweet Dreams Team" }],
  creator: "QQ's Sweet Dreams",
  publisher: "QQ's Sweet Dreams",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://qqsweetdreams.vercel.app"),
  openGraph: {
    title: "QQ's Sweet Dreams - Marcador de Competición",
    description:
      "Aplicación de marcador para la competición QQ's Sweet Dreams. Sigue las puntuaciones, apuestas y clasificaciones en tiempo real.",
    url: "https://qqsweetdreams.vercel.app",
    siteName: "QQ's Sweet Dreams",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QQ's Sweet Dreams - Marcador de Competición",
    description:
      "Aplicación de marcador para la competición QQ's Sweet Dreams. Sigue las puntuaciones, apuestas y clasificaciones en tiempo real.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="overscroll-none">{children}</body>
    </html>
  )
}
