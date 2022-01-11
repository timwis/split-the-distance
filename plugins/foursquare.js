export default function ({ $axios }, inject) {
  const foursquare = new Foursquare($axios)
  inject('foursquare', foursquare)
}

class Foursquare {
  static categories = {
    'coffee-shops': '13032',
    bars: '13003',
    restaurants: '13065'
  }

  constructor ($axios) {
    this.client = $axios.create({
      baseURL: '/foursquare/'
    })
  }

  search ({ category, ne, sw }) {
    const params = {
      ne,
      sw,
      categories: Foursquare.categories[category],
      limit: 50
    }

    return this.client.$get('/places/search', { params })
  }
}
