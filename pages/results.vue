<template>
  <main>
    <client-only>
      <l-map
        id="map"
        ref="map"
        :zoom="zoom"
        :center="center"
        :options="{ tap: false }"
        @ready="fitBounds"
        @update:bounds="fetchPlaces"
      >
        <l-tile-layer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png" />
        <l-polygon
          v-for="(timeMap, key, index) in timeMaps"
          ref="isochrones"
          :key="key"
          :lat-lngs="timeMap"
          :fill-color="['blue', 'red', 'purple'][index]"
          :color="['blue', 'red', 'purple'][index]"
          :name="key"
          :weight="1"
        />
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

<script>
import { stringToArray, isochroneToPolygon, leafletLatLngToString, foursquareObjectToLeafletObject } from '@/lib/geometry'

export default {
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
      validTravelModes.includes(query.travelMode) &&
      validVenueTypes.includes(query.venueType) &&
      query.points.length >= 2
  },
  async asyncData ({ query, $travelTime }) {
    const {
      points: pointsStrings,
      labels,
      travelTime,
      travelMode
    } = query

    const points = pointsStrings.map(stringToArray)

    const data = await $travelTime.timeMap({ points, labels, travelMode, travelTime })

    const timeMaps = data.results.reduce((accum, isochrone) => {
      accum[isochrone.search_id] = isochroneToPolygon(isochrone)
      return accum
    }, {})
    return { timeMaps }
  },
  data () {
    return {
      center: stringToArray(this.$route.query.points[0]).reverse(), // lat,lng for leaflet
      zoom: 12,
      timeMaps: {},
      places: []
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
    async fetchPlaces () {
      const map = this.$refs.map.mapObject
      const bounds = map.getBounds()
      const ne = leafletLatLngToString(bounds.getNorthEast())
      const sw = leafletLatLngToString(bounds.getSouthWest())
      const category = this.$route.query.venueType

      const data = await this.$foursquare.search({ category, ne, sw })
      this.places = data.results
    }
  }
}
</script>
