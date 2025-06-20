import type { Metadata, Viewport } from "next"
import type React from "react"
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
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "QQ's Sweet Dreams - Marcador de Competición",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QQ's Sweet Dreams - Marcador de Competición",
    description:
      "Aplicación de marcador para la competición QQ's Sweet Dreams. Sigue las puntuaciones, apuestas y clasificaciones en tiempo real.",
    images: ["/og-image.png"],
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
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#000000" }],
  },
  verification: {
    google: "your-google-verification-code", // Reemplaza con tu código real
  },
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  viewportFit: "cover",
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es">
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* Critical CSS - Inline small CSS */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            /* Critical CSS for above-the-fold content */
            body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            .loading { display: flex; align-items: center; justify-content: center; min-height: 100vh; }
            .spinner { width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          `,
          }}
        />

        {/* Preload critical fonts */}
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        />

        {/* Fallback for browsers that don't support onLoad */}
        <noscript>
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </noscript>

        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />

        {/* Structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "QQ's Sweet Dreams",
              description: "Aplicación de marcador para la competición QQ's Sweet Dreams",
              url: "https://qqsweetdreams.vercel.app",
              applicationCategory: "GameApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "EUR",
              },
            }),
          }}
        />
      </head>
      <body className="overscroll-none">
        {/* Loading fallback */}
        <noscript>
          <div className="loading">
            <div>
              <h1>QQ's Sweet Dreams</h1>
              <p>Esta aplicación requiere JavaScript para funcionar correctamente.</p>
            </div>
          </div>
        </noscript>
        {children}
      </body>
    </html>
  )
}
