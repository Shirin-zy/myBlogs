/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  compiler: {
    styledComponents: true,
  },
  eslint: {
    // 忽略打包时的 eslint 错误，确保能顺利部署
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 忽略打包时的类型检查错误
    ignoreBuildErrors: true,
  },
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
    optimizePackageImports: ["lucide-react"],
    // 强制追踪并包含特定依赖，解决 standalone 模式下可能出现的软链接失效或模块缺失问题
    outputFileTracingIncludes: {
      "/**": ["./node_modules/styled-jsx/**/*", "./node_modules/next/**/*"],
    },
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
