import { geojsonArrayToObject } from './geometry'

export function geocode (query) {
  return {
    method: 'get',
    url: '/traveltime/geocoding/search',
    params: { query }
  }
}

export function timeMap ({ points, labels, travelMode, travelTime }) {
  if (process.env.NUXT_ENV_STUB_TRAVEL_TIME) {
    return {
      method: 'get',
      url: '/time-map.json'
    }
  }

  const departureTime = (new Date()).toISOString()
  const body = {
    departure_searches: points.map((point, index) => ({
      id: labels[index] || `isochrone-${index}`,
      coords: geojsonArrayToObject(point),
      transportation: { type: travelMode },
      departure_time: departureTime,
      travel_time: travelTime * 60
    })),
    intersections: [
      {
        id: 'intersection',
        search_ids: labels
      }
    ]
  }
  return {
    method: 'post',
    url: '/traveltime/time-map',
    data: body
  }
}
