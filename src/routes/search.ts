import slugify from 'slugify'
import {
	geojsonArrayToObject,
	isochroneToPolygon,
	stringToArray
} from '$lib/utils/geometry'

// const TIME_MAP_URL = 'https://api.traveltimeapp.com/v4/time-map'
const TIME_MAP_URL = 'http://localhost:3001/v4/time-map'
const intervals = [45, 30, 15]

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({ url }) {
	const points: number[][] = url.searchParams
		.getAll('points')
		.map(stringToArray)
	const labels: string[] = url.searchParams.getAll('labels')
	const origins = points.map((point, index) => ({
		point,
		label: labels[index]
	}))
	const travelMode = url.searchParams.get('travelMode')
	const arrivalTime = url.searchParams.get('arrivalTime')
	const travelTime = 45

	const opts = {
		arrival_searches: origins.flatMap((origin) =>
			intervals.map((interval) => ({
				id: createIsochroneId(origin.label, interval),
				coords: geojsonArrayToObject(origin.point),
				transportation: { type: travelMode },
				arrival_time: arrivalTime,
				travel_time: travelTime * interval
			}))
		),
		intersections: intervals.map((interval) => ({
			id: `intersection|${interval}m`,
			search_ids: origins.map((origin) =>
				createIsochroneId(origin.label, interval)
			)
		}))
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
		const polygon = isochroneToPolygon(isochrone)
		if (polygon.flat(3).length > 0) {
			const [label, interval] = isochrone.search_id.split('|')
			accum[label] = accum[label] || {}
			accum[label][interval] = polygon
		}
		return accum
	}, {})

	return { body: { polygons } }
}

function createIsochroneId(label, travelTime) {
	return `${slugify(label)}|${travelTime}m`
}
