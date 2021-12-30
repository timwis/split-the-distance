<template>
  <main>
    <client-only>
      <l-map
        id="map"
        ref="map"
        :zoom="zoom"
        :center="center"
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
          :key="place.id"
          :lat-lng="place.center.slice().reverse()"
          :name="place.text"
        >
          <l-popup>{{ place.place_name }}</l-popup>
        </l-marker>
      </l-map>
    </client-only>
  </main>
</template>

<script>
import { timeMap } from '@/lib/travel-time'
import { stringToArray, isochroneToPolygon, objectToGeojsonArray } from '@/lib/geometry'

export default {
  name: 'ResultsPage',
  validate ({ query }) {
    const validTravelModes = ['cycling', 'driving', 'public_transport', 'walking']
    const requiredParams = [
      'points',
      'labels',
      'travelTime',
      'travelMode'
    ]

    return requiredParams.every(param => query[param]) &&
      validTravelModes.includes(query.travelMode) &&
      query.points.length >= 2
  },
  async asyncData ({ query, $axios }) {
    const {
      points: pointsStrings,
      labels,
      travelTime,
      travelMode
    } = query

    const points = pointsStrings.map(stringToArray)

    const request = timeMap({ points, labels, travelMode, travelTime })
    const response = await $axios(request)

    const timeMaps = response.data.results.reduce((accum, isochrone) => {
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

      const intersection = isochroneEls.find(isochrone => isochrone.name === 'intersection')
      if (intersection) {
        map.fitBounds(intersection.mapObject.getBounds())
      }
    },
    async fetchPlaces () {
      const map = this.$refs.map.mapObject
      const bounds = map.getBounds()
      const bbox = stringToArray(bounds.toBBoxString())
      const center = objectToGeojsonArray(bounds.getCenter())

      const response = await this.$mapbox.geocoding.forwardGeocode({
        query: 'coffee',
        limit: 10,
        types: ['poi'],
        proximity: center,
        bbox
      }).send()
      this.places = response.body.features
    }
  }
}
</script>
