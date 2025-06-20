export function GET(): Response {
  const robotsTxt = `User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: https://qqsweetdreams.vercel.app/sitemap.xml

# Disallow admin paths
Disallow: /admin
Disallow: /api/admin

# Allow important pages
Allow: /
Allow: /leaderboard
Allow: /betting
Allow: /rivals
`

  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  })
}
