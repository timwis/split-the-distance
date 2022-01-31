<template>
  <main>
    <client-only>
      <l-map
        id="map"
        ref="map"
        :zoom="zoom"
        :center="center"
        :options="{ tap: false }"
      >
        <l-tile-layer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png" />
        <l-polygon
          v-for="(intersection, index) in intersections"
          ref="isochrones"
          :key="intersection.travelTime"
          :lat-lngs="intersection.polygon"
          :fill-color="['blue', 'purple', 'red'][index]"
          :color="['blue', 'purple', 'red'][index]"
          :weight="1"
        >
          <l-popup :content="`${intersection.travelTime} minutes`" />
        </l-polygon>
        <l-marker
          v-for="place in places"
          :key="place.fsq_id"
          :lat-lng="place.geocodes.main | foursquareObjectToLeafletObject"
          :name="place.name"
        >
          <l-popup>{{ place.name }}</l-popup>
        </l-marker>
      </l-map>
    </client-only>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import '@nuxt/types'
import flattenDeep from 'lodash/flattenDeep'
import isEmpty from 'lodash/isEmpty'

import {
  stringToArray,
  leafletLatLngToString,
  foursquareObjectToLeafletObject
} from '@/lib/geometry'

export default Vue.extend({
  name: 'ResultsPage',
  filters: { foursquareObjectToLeafletObject },
  validate ({ query }) {
    const validTravelModes = ['cycling', 'driving', 'public_transport', 'walking']
    const validVenueTypes = ['coffee-shops', 'restaurants', 'bars']
    const requiredParams = [
      'points',
      'labels',
      'travelTime',
      'travelMode'
    ]

    return requiredParams.every(param => query[param]) &&
      validTravelModes.includes(query.travelMode as string) &&
      validVenueTypes.includes(query.venueType as string) &&
      query.points.length >= 2
  },
  async asyncData ({ query, $travelTime }) {
    const {
      points: pointStrings,
      labels,
      travelMode,
      arrivalTime
    } = query as {
      points: string[],
      labels: string[],
      travelMode: 'cycling' | 'driving' | 'public_transport' | 'walking',
      arrivalTime: string
    }

    const origins = pointStrings.map((pointString, index) => ({
      point: stringToArray(pointString),
      label: labels[index] || `Location ${index + 1}`
    }))

    const requests = [45, 30, 20].map(async (travelTime) => {
      const opts = { origins, travelMode, travelTime, arrivalTime }
      const polygon = await $travelTime.getIntersection(opts)
      return { travelTime, polygon }
    })
    const intersections = await Promise.all(requests)

    return { intersections }
  },
  data () {
    return {
      zoom: 12,
      timeMaps: {},
      intersections: [],
      places: []
    }
  },
  computed: {
    center () {
      return stringToArray(this.$route.query.points[0]).reverse() // lat,lng for leaflet
    },
    nonEmptyIntersections () {
      return this.intersections.filter(
        intersection => !isEmpty(flattenDeep(intersection.polygon))
      )
    }
  },
  watchQuery: ['points', 'travelTime', 'travelMode'],
  methods: {
    fitBounds () {
      const map = this.$refs.map.mapObject
      const isochroneEls = this.$refs.isochrones

      const intersection = isochroneEls && isochroneEls.find(isochrone => isochrone.name === 'intersection')
      if (intersection) {
        map.fitBounds(intersection.mapObject.getBounds())
      }
    },
    // async fetchPlaces () {
    //   const map = this.$refs.map.mapObject
    //   const bounds = map.getBounds()
    //   const ne = leafletLatLngToString(bounds.getNorthEast())
    //   const sw = leafletLatLngToString(bounds.getSouthWest())
    //   const category = this.$route.query.venueType

    //   const data = await this.$foursquare.search({ category, ne, sw })
    //   this.places = data.results
    // }
  }
})
</script>

<style>
#map g {
  opacity: 0.4;
}
</style>
