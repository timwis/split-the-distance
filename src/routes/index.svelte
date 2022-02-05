<script lang="ts">
  import { add, roundToNearestMinutes, format } from 'date-fns'
  import Fa from 'svelte-fa'
  import { faCarAlt, faBicycle, faBus, faWalking } from '@fortawesome/free-solid-svg-icons'
  import LocationInput from '$lib/LocationInput.svelte'
import { mode } from '$app/env'

  interface GeocodeResult {
    id: string,
    text: string,
    place_name: string,
    center: number[]
  }
  
  let yourLocation: GeocodeResult
  let theirLocation: GeocodeResult
  let travelMode: 'driving' | 'cycling' | 'public_transport' | 'walking' = 'public_transport'
  let arrivalTime = formatDateForInput(aboutAnHourFromNow())
  const minArrivalTime = formatDateForInput(new Date())
  const travelModeOptions = [
    { key: 'driving', label: 'Driving', icon: faCarAlt },
    { key: 'cycling', label: 'Cycling', icon: faBicycle },
    { key: 'public_transport', label: 'Public Transport', icon: faBus },
    { key: 'walking', label: 'Walking', icon: faWalking }
  ]
  
  function aboutAnHourFromNow () {
    const oneHourFromNow = add(new Date(), { hours: 1 })
    return roundToNearestMinutes(oneHourFromNow, { nearestTo: 15 })
  }
  
  function formatDateForInput (date: Date) {
    // datetime-local inputs cannot have a timezone
    return format(date, `yyyy-MM-dd'T'HH:mm`)
  }
</script>

<svelte:head>
  <title>Split the Distance</title>
</svelte:head>

<section class="section">
  <div class="container">
    <p>Find mutually convenient places to meet</p>

    <form>
      <div class="field">
        <label class="label" for="yourLocation">Your location</label>
        <div class="control">
          <LocationInput
            name="yourLocation"
            id="yourLocation"
            bind:selectedItem={yourLocation}
          />
        </div>
      </div>

      <div class="field">
        <label class="label" for="theirLocation">Their location</label>
        <div class="control">
          <LocationInput
            name="theirLocation"
            id="theirLocation"
            bind:selectedItem={theirLocation}
          />
        </div>
      </div>

      <div class="label">Travel mode</div>
      <div class="field has-addons">
        {#each travelModeOptions as mode}
          {@const isSelected = travelMode === mode.key}
          {@const selectedClasses = 'is-primary is-outlined is-light is-selected'}
          <div class="control">
            <label class="radio button {isSelected ? selectedClasses : ''}">
              <abbr title={mode.label}>
                <Fa icon={mode.icon} />
              </abbr>
              <input
                type="radio"
                value={mode.key}
                name="travelMode"
                id="travelMode"
                bind:group={travelMode}
              >
            </label>
          </div>
        {/each}
      </div>

      <div class="field">
        <label class="label" for="arrivalTime">Meeting at</label>
        <div class="control">
          <input
            type="datetime-local"
            name="arrivalTime"
            id="arrivalTime"
            class="input"
            bind:value={arrivalTime}
            min={minArrivalTime}
          >
        </div>
      </div>

      <div class="field">
        <div class="control">
          <button class="button is-primary is-fullwidth">
            Search
          </button>
        </div>
      </div>
    </form>
  </div>
</section>

<style lang="scss">
  .radio.button {
    outline: none;
    align-items: center;
    display: flex;
    
    input[type="radio"] {
      position: absolute;
      left: 0;
      opacity: 0;
      outline: none;
      z-index: -1;
    }
    
    &.is-selected {
      z-index: 1;
    }
  }
</style>
