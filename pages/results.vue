<template>
  <main>
    <client-only>
      <l-map id="map" ref="map" :zoom="zoom" :center="center">
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
      </l-map>
    </client-only>
  </main>
</template>

<script>
import { timeMap } from '@/lib/travel-time'
import { stringToArray, isochroneToPolygon } from '@/lib/geometry'

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
      timeMaps: {}
    }
  },
  watchQuery: ['points', 'travelTime', 'travelMode'],
  mounted () {
    this.fitBounds()
  },
  methods: {
    fitBounds () {
      if (process.server || !this.$refs.isochrones) { return }
      this.$nextTick(() => {
        const map = this.$refs.map.mapObject

        const intersection = this.$refs.isochrones.find(isochrone => isochrone.name === 'intersection')
        if (intersection) {
          map.flyToBounds(intersection.mapObject.getBounds())
        }
      })
    }
  }
}
</script>
