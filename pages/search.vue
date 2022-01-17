<template>
  <main class="container">
    <fieldset>
      <form @submit.prevent="onSubmit">
        <b-field label="Your location">
          <LocationInput
            v-model="yourLocation"
            name="yourLocation"
            icon="map-marker"
            required="true"
            data-testid="yourLocation"
          />
        </b-field>

        <b-field label="Their location">
          <LocationInput
            v-model="theirLocation"
            name="theirLocation"
            icon="map-marker"
            required
            data-testid="theirLocation"
          />
        </b-field>

        <b-field label="Travel mode">
          <b-select
            v-model="travelMode"
            placeholder="Select a travel mode"
            name="travelMode"
            data-testid="travelMode"
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
            data-testid="travelTime"
          />
        </b-field>

        <b-field label="Venue type">
          <b-radio-button
            v-model="venueType"
            native-value="coffee-shops"
            type="is-outlined is-primary is-light"
          >
            <b-icon icon="coffee" />
            <span>Coffee shops</span>
          </b-radio-button>

          <b-radio-button
            v-model="venueType"
            native-value="restaurants"
            type="is-outlined is-primary is-light"
          >
            <b-icon icon="silverware-fork-knife" />
            <span>Restaurants</span>
          </b-radio-button>

          <b-radio-button
            v-model="venueType"
            native-value="bars"
            type="is-outlined is-primary is-light"
          >
            <b-icon icon="glass-cocktail" />
            <span>Bars</span>
          </b-radio-button>
        </b-field>

        <b-field label="Meeting at">
          <b-datetimepicker
            v-model="arrivalTime"
            placeholder="Select a date and time"
            icon="calendar-today"
            :timepicker="{ incrementMinutes: 15 }"
          >
            <template #left>
              <b-button
                label="Now"
                type="is-primary"
                icon-left="clock"
                @click="arrivalTime = new Date()"
              />
            </template>
          </b-datetimepicker>
        </b-field>

        <b-field>
          <p class="control">
            <b-button
              tag="input"
              native-type="submit"
              value="Search"
              type="is-primary"
              data-testid="search-btn"
              expanded
            />
          </p>
        </b-field>
      </form>
    </fieldset>
  </main>
</template>

<script>
import { add, roundToNearestMinutes } from 'date-fns'
import LocationInput from '@/components/LocationInput'

export default {
  name: 'SearchPage',
  components: {
    LocationInput
  },
  data () {
    return {
      yourLocation: {},
      theirLocation: {},
      travelTime: 45,
      travelMode: 'public_transport',
      travelModes: new Map([
        ['cycling', 'Cycling'],
        ['driving', 'Driving'],
        ['public_transport', 'Public transport'],
        ['walking', 'Walking']
      ]),
      venueType: 'coffee-shops',
      arrivalTime: roundToNearestMinutes(add(new Date(), { hours: 1 }), { nearestTo: 15 })
    }
  },
  methods: {
    onSubmit (_event) {
      const query = {
        points: [
          this.yourLocation.center.join(','),
          this.theirLocation.center.join(',')
        ],
        labels: [
          this.yourLocation.text,
          this.theirLocation.text
        ],
        travelTime: this.travelTime,
        travelMode: this.travelMode,
        venueType: this.venueType,
        arrivalTime: this.arrivalTime.toISOString()
      }
      this.$router.push({ path: '/results', query })
    }
  }
}
</script>
