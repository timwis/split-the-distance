<template>
  <main class="container">
    <fieldset>
      <form>
        <b-field label="Your location">
          <b-input
            v-model="yourLocation"
            name="yourLocation"
            icon="map-marker"
          />
        </b-field>

        <b-field label="Their location">
          <b-input
            v-model="theirLocation"
            icon="map-marker"
            name="theirLocation"
          />
        </b-field>

        <b-field label="Travel mode">
          <b-select
            v-model="travelMode"
            placeholder="Select a travel mode"
            name="travelMode"
            expanded
          >
            <option
              v-for="[key, label] in travelModes"
              :key="key"
              :value="key"
            >
              {{ label }}
            </option>
          </b-select>
        </b-field>

        <b-field label="Max travel time">
          <b-numberinput
            v-model="travelTime"
            min="5"
            max="60"
            step="5"
            aria-minus-label="Decrement by 5"
            aria-plus-label="Increment by 5"
            name="travelTime"
          />
        </b-field>

        <b-field>
          <p class="control">
            <b-button
              tag="input"
              native-type="submit"
              value="Search"
              type="is-primary"
              expanded
            />
          </p>
        </b-field>
      </form>
    </fieldset>
  </main>
</template>

<script>
export default {
  name: 'SearchPage',
  data () {
    return {
      yourLocation: '',
      theirLocation: '',
      travelTime: 45,
      travelMode: 'public_transport',
      travelModes: new Map([
        ['cycling', 'Cycling'],
        ['driving', 'Driving'],
        ['public_transport', 'Public transport'],
        ['walking', 'Walking']
      ])
    }
  }
}
</script>
