export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Split the Distance',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/foursquare.js',
    '~/plugins/mapbox.js',
    '~/plugins/travel-time.ts'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    ['@nuxtjs/eslint-module', { failOnError: false, failOnWarning: false }],
    '@nuxt/typescript-build'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/buefy
    'nuxt-buefy',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    'nuxt-leaflet'
  ],

  axios: {
    proxy: true
  },

  proxy: {
    '/traveltime': {
      target: 'https://api.traveltimeapp.com',
      pathRewrite: { '^/traveltime': '/v4' },
      headers: {
        'Accept-Language': 'en',
        'X-Application-Id': process.env.TRAVEL_TIME_APP_ID,
        'X-Api-Key': process.env.TRAVEL_TIME_API_KEY
      }
    },
    '/foursquare': {
      target: 'https://api.foursquare.com',
      pathRewrite: { '^/foursquare': '/v3' },
      headers: {
        Authorization: process.env.FOURSQUARE_API_KEY
      }
    }
  },

  publicRuntimeConfig: {
    mapboxApiKey: process.env.MAPBOX_API_KEY
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
