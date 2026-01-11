export default defineNuxtConfig({
  ssr: false,

  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.min.css',
    '~/assets/css/main.css',
  ],

  plugins: [
    '~/plugins/scroll.js',
    '~/plugins/pinia.js'
  ],

  build: { transpile: ['vuetify'] },
  devtools: { enabled: false },

  app: {
    head: {
      title: 'PureClean x Butum Sakor',
      meta: [
        { name: 'description', content: 'PureClean Laundromat Management System' },
        { name: 'robots', content: 'index, follow, noarchive' },
        { name: 'author', content: 'Mengly Uch' },
        { name: 'theme-color', content: '#ffffff' } // optional
      ],
      link: [
        // put these files in /public or /public/logo
        { rel: 'icon', type: 'image/png', href: '/logo/favicon/favicon-32x32.png', sizes: '32x32' },
        { rel: 'icon', type: 'image/png', href: '/logo/favicon/favicon-16x16.png', sizes: '16x16' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/logo/favicon/apple-touch-icon.png' },
      ],
    },
  },

  devServer: { port: 5000 },

  runtimeConfig: {
    public: {
      MODE: process.env.MODE || 'development',
      ADMIN_PRIVATE_API: process.env.ADMIN_PRIVATE_API,
      ADMIN_PUBLIC_API: process.env.ADMIN_PUBLIC_API,
      ADMIN_PRIVATE_API_DEV: process.env.ADMIN_PRIVATE_API_DEV,
      ADMIN_PUBLIC_API_DEV: process.env.ADMIN_PUBLIC_API_DEV,
    },
  },

  compatibilityDate: '2025-02-12',
  modules: ['@nuxtjs/tailwindcss'],
});