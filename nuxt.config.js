export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'midway',
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
    '~/plugins/mapbox.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    ['@nuxtjs/eslint-module', { failOnError: false, failOnWarning: false }]
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/buefy
    'nuxt-buefy',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    'nuxt-leaflet'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/'
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
    }
  },

  publicRuntimeConfig: {
    mapboxApiKey: process.env.MAPBOX_API_KEY
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
