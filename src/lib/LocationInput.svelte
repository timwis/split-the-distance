<script lang="ts">
  import Fa from 'svelte-fa'
  import { faMapMarkerAlt, faSpinner } from '@fortawesome/free-solid-svg-icons'
  import debounce from 'lodash/debounce'
  import mbxClient from '@mapbox/mapbox-sdk'
  import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding'

  export let name: string
  export let id = ''
  export let required = false
  
  const mapboxApiKey = import.meta.env.VITE_MAPBOX_API_KEY
  const mapboxClient = mbxClient({ accessToken: mapboxApiKey })
  const geocoder = mbxGeocoding(mapboxClient)
  
  let isLoading = false
  let results = []
  const handleInput = debounce(async (event) => {
    const query = event.target.value
    isLoading = true
    try {
      const response = await geocoder.forwardGeocode({
        query,
        autocomplete: true,
        types: ['postcode', 'district', 'place', 'locality',
          'neighborhood', 'address']
      }).send()
      results = response.body.features
    } catch (error) {
      results = []
      console.error(error)
    } finally {
      isLoading = false
    }
  }, 250)
</script>

<div class="autocomplete field dropdown is-active">
  <div
    class="control has-icons-left is-clearfix"
    class:has-icons-right={isLoading}
  >
    <input
      class="input"
      type="text"
      autocomplete="off"
      {name}
      {id}
      {required}
      on:input={handleInput}
    >
    <span class="icon is-left">
      <Fa icon={faMapMarkerAlt} />
    </span>
    {#if isLoading}
      <span class="icon is-right">
        <Fa icon={faSpinner} spin />
      </span>
    {/if}
  </div>
  {#if results.length > 0}
    <div class="dropdown-menu" role="menu">
      <div class="dropdown-content">
        {#each results as result}
          <a href="#" class="dropdown-item" tabindex="0">
            {result.place_name}
          </a>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .autocomplete .dropdown-menu {
    width: 100%;
    
    .dropdown-content {
      overflow: auto;
      max-height: 200px;
      
      .dropdown-item {
        white-space: inherit;
      }
    }
  }
</style>
