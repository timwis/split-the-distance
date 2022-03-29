<script lang="ts">
	import { browser } from '$app/env'
	import { page } from '$app/stores'
	import 'leaflet/dist/leaflet.css'
	import {
		LeafletMap,
		TileLayer,
		Polygon,
		Marker,
		Popup
	} from 'svelte-leafletjs?client'
	import {
		leafletLatLngToString,
		stringToObject,
		objectToGeojsonArray
	} from '$lib/utils/geometry'

	export let polygons

	interface Point {
		lng: number
		lat: number
	}
	const points: Point[] = $page.url.searchParams
		.getAll('points')
		.map(stringToObject)
	const labels: string[] = $page.url.searchParams.getAll('labels')
	const origins = points.map((point, index) => ({
		point,
		label: labels[index]
	}))
	const travelMode = $page.url.searchParams.get('travelMode')
	const arrivalTime = $page.url.searchParams.get('arrivalTime')

	const mapOptions = {
		center: points[0],
		zoom: 11
	}
	const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
	const tileLayerOptions = {
		minZoom: 0,
		maxZoom: 20,
		maxNativeZoom: 19,
		attribution: '© OpenStreetMap contributors'
	}
	const intervalColors = {
		'15m': '#36F76A',
		'30m': '#FFF157',
		'45m': '#F76363'
	}

	let map
	let selectedLocation: Point
	$: gmapsUrl = selectedLocation
		? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
				leafletLatLngToString(selectedLocation)
		  )}`
		: null

	async function onPopupOpen(event) {
		selectedLocation = event.detail.popup.getLatLng()
	}
</script>

{#if browser}
	<LeafletMap bind:this={map} options={mapOptions}>
		<TileLayer url={tileUrl} options={tileLayerOptions} />

		{#if 'intersection' in polygons}
			{#each Object.entries(polygons.intersection).reverse() as [interval, polygon]}
				<Polygon
					latLngs={polygon}
					fillColor={intervalColors[interval]}
					color={intervalColors[interval]}
					events={['popupopen']}
					on:popupopen={onPopupOpen}
				>
					<Popup>
						<p>You can both reach this location within <b>{interval}</b>.</p>
						{#if gmapsUrl}
							<a href={gmapsUrl}>Google Maps</a>
						{/if}
					</Popup>
				</Polygon>
			{/each}
		{/if}

		{#each points as point, index}
			<Marker latLng={point}>
				<Popup>{labels[index]}</Popup>
			</Marker>
		{/each}
	</LeafletMap>
{/if}
