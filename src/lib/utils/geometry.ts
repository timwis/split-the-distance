interface LatLngObject {
	lat: number
	lng: number
}
interface TimeMapResultShape {
	shell: LatLngObject[]
	holes: LatLngObject[]
}
interface TimeMapResult {
	search_id: string
	shapes: TimeMapResultShape[]
}
type Polygon = number[][][][]

export function stringToArray(pointString) {
	return pointString.split(',').map((item) => +item)
}

export function stringToObject(pointString) {
	return geojsonArrayToObject(stringToArray(pointString))
}

export function stringToLeafletArray(pointString) {
	return stringToArray(pointString).reverse() // lat, lng for leaflet
}

export function objectToLeafletArray(pointObject) {
	return [pointObject.lat, pointObject.lng]
}

export function objectToGeojsonArray(pointObject) {
	return [pointObject.lng, pointObject.lat]
}

export function geojsonArrayToObject(pointArray) {
	return { lng: pointArray[0], lat: pointArray[1] }
}

export function leafletLatLngToString(latLng) {
	const { lat, lng } = latLng
	return `${lat},${lng}`
}

export function foursquareObjectToLeafletObject(pointObject) {
	return {
		lat: pointObject.latitude,
		lng: pointObject.longitude
	}
}

export function isochroneToPolygon(isochrone: TimeMapResult): Polygon {
	return isochrone.shapes.map((polygon) => {
		const shell = polygon.shell.map(objectToLeafletArray)
		const holes = polygon.holes.map((hole) => hole.map(objectToLeafletArray))
		return [shell].concat(holes)
	})
}
