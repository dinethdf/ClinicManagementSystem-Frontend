import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: process.env.BASEPATH,
  redirects: async () => {
    return [
      // {
      //   source: '/',
      //   destination: '/:path*',
      //   permanent: true,
      //   locale: false
      // },
      // {
      //   source: '/:lang(en|si|other)',
      //   destination: '/:lang/clinic',
      //   permanent: true,
      //   locale: false
      // },
      {
        source: '/:path((?!en|si|other|home|front-pages|images|api|favicon.ico|landing2).+)+',
        destination: '/en/:path*',
        permanent: true,
        locale: false
      }
    ]
  }
}

export default nextConfig
