import { writable } from 'svelte/store'
import { formatDateForInput, aboutAnHourFromNow } from '$lib/utils/time'

interface GeocodeResult {
	id: string
	text: string
	place_name: string
	center: number[]
}
type TravelMode = 'driving' | 'cycling' | 'public_transport' | 'walking'

export const yourLocation = writable<GeocodeResult>()
export const theirLocation = writable<GeocodeResult>()
export const travelMode = writable<TravelMode>('public_transport')
export const arrivalTime = writable(formatDateForInput(aboutAnHourFromNow()))
