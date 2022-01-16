import { geojsonArrayToObject } from '~/lib/geometry'

export default function ({ $axios }, inject) {
  const travelTime = new TravelTime($axios)
  inject('travelTime', travelTime)
}

class TravelTime {
  constructor ($axios) {
    const currentBaseURL = $axios.defaults.baseURL
    this.client = $axios.create({
      baseURL: currentBaseURL + 'traveltime/'
    })
  }

  geocode (query) {
    const params = { query }
    return this.client.$get('/geocoding/search', { params })
  }

  timeMap ({ points, labels, travelMode, travelTime, arrivalTime = (new Date()).toISOString() }) {
    if (process.env.NUXT_ENV_STUB_TRAVEL_TIME) {
      return this.client.$get('/time-map.json')
    }

    const data = {
      arrival_searches: points.map((point, index) => ({
        id: labels[index] || `isochrone-${index}`,
        coords: geojsonArrayToObject(point),
        transportation: { type: travelMode },
        arrival_time: arrivalTime,
        travel_time: travelTime * 60
      })),
      intersections: [
        {
          id: 'intersection',
          search_ids: labels
        }
      ]
    }

    return this.client.$post('/time-map', data)
  }
}
