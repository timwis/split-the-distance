<script lang="ts">
	import AutoComplete from 'simple-svelte-autocomplete'
	import mbxClient from '@mapbox/mapbox-sdk'
	import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding.js'

	export let selectedItem = null
	export let name: string
	export let id = ''

	const mapboxApiKey = import.meta.env.VITE_MAPBOX_API_KEY
	const mapboxClient = mbxClient({ accessToken: mapboxApiKey })
	const geocoder = mbxGeocoding(mapboxClient)

	const handleInput = async (query: string) => {
		const response = await geocoder
			.forwardGeocode({
				query,
				autocomplete: true,
				types: [
					'postcode',
					'district',
					'place',
					'locality',
					'neighborhood',
					'address'
				]
			})
			.send()
		return response.body.features
	}
</script>

<AutoComplete
	searchFunction={handleInput}
	delay="250"
	localFiltering={false}
	labelFieldName="text"
	valueFieldName="text"
	showLoadingIndicator={true}
	bind:selectedItem
	{name}
	inputId={id}
>
	<div slot="item" let:item let:label>
		{@html item.place_name}
	</div>
</AutoComplete>
