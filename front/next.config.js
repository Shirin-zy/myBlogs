/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  webpack(config, { dev, isServer }) {
    // ── Less / Less Modules support ────────────────────────────
    // Walk the existing rule list to find Next.js's own CSS-modules rule,
    // then clone it and extend for .less files.
    const oneOfRules = config.module.rules.find(
      (r) => typeof r === 'object' && Array.isArray(r.oneOf)
    )

    if (oneOfRules && oneOfRules.oneOf) {
      // Find the CSS Modules rule (matches *.module.css)
      const cssModuleRule = oneOfRules.oneOf.find(
        (r) =>
          r &&
          r.test instanceof RegExp &&
          r.test.source.includes('module') &&
          r.test.source.includes('css') &&
          !r.test.source.includes('less') &&
          !r.test.source.includes('scss')
      )

      if (cssModuleRule) {
        // Clone the rule and change test + append less-loader at the end
        const lessModuleRule = {
          ...cssModuleRule,
          test: /\.module\.less$/,
          use: [
            ...(Array.isArray(cssModuleRule.use) ? cssModuleRule.use : []),
            {
              loader: 'less-loader',
              options: { lessOptions: { javascriptEnabled: true } },
            },
          ],
        }
        oneOfRules.oneOf.splice(
          oneOfRules.oneOf.indexOf(cssModuleRule),
          0,
          lessModuleRule
        )
      }
    }

    return config
  },
}

module.exports = nextConfig
