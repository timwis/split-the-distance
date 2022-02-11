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
	import { stringToLeafletArray } from '$lib/utils/geometry'

	export let polygons

	const points: number[][] = $page.url.searchParams
		.getAll('points')
		.map(stringToLeafletArray)
	const labels: string[] = $page.url.searchParams.getAll('labels')

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

	let map
</script>

{#if browser}
	<LeafletMap bind:this={map} options={mapOptions}>
		<TileLayer url={tileUrl} options={tileLayerOptions} />

		<Polygon latLngs={polygons.intersection} />

		{#each points as point, index}
			<Marker latLng={point}>
				<Popup>{labels[index]}</Popup>
			</Marker>
		{/each}
	</LeafletMap>
{/if}
