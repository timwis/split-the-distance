import {
  geojsonArrayToObject,
  isochroneToPolygon,
  stringToArray
} from '$lib/utils/geometry';

// const TIME_MAP_URL = 'https://api.traveltimeapp.com/v4/time-map'
const TIME_MAP_URL = 'http://localhost:3001/v4/time-map'

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({ url }) {
  const points: number[][] = url.searchParams.getAll('points').map(stringToArray)
  const labels: string[] = url.searchParams.getAll('labels')
  const origins = points.map((point, index) => ({
    point,
    label: labels[index]
  }))
  const travelMode = url.searchParams.get('travelMode')
  const arrivalTime = url.searchParams.get('arrivalTime')
  const travelTime = 45
  
  const opts = {
    arrival_searches: origins.map((origin) => ({
      id: origin.label,
      coords: geojsonArrayToObject(origin.point),
      transportation: { type: travelMode },
      arrival_time: arrivalTime,
      travel_time: travelTime * 60
    })),
    intersections: [
      {
        id: 'intersection',
        search_ids: origins.map((origin) => origin.label)
      }
    ]
  }
  const body = JSON.stringify(opts)
  
  const response = await fetch(TIME_MAP_URL, {
    method: 'POST',
    body,
    headers: {
      'Accept-Language': 'en',
      'Content-Type': 'application/json',
      'X-Application-Id': import.meta.env.VITE_TRAVEL_TIME_APP_ID as string,
      'X-Api-Key': import.meta.env.VITE_TRAVEL_TIME_API_KEY as string
    }
  })
  const data = await response.json()
  const polygons = data.results.reduce((accum, isochrone) => {
    accum[isochrone.search_id] = isochroneToPolygon(isochrone)
    return accum
  }, {})
  
  return { body: { polygons } }
}
