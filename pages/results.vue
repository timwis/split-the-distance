<template>
  <main>
    <client-only>
      <l-map id="map" ref="map" :zoom="zoom" :center="center" @ready="fitBounds">
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
          @add="fitBounds"
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
      validTravelModes.includes(query.travelMode)
  },
  data () {
    return {
      center: [51.5072, -0.1276],
      zoom: 12,
      timeMaps: {}
    }
  },
  async fetch () {
    const {
      points: pointsStrings,
      labels,
      travelTime,
      travelMode
    } = this.$route.query

    const points = pointsStrings.map(stringToArray)

    const request = timeMap({ points, labels, travelMode, travelTime })
    try {
      const response = await this.$axios(request)
      this.timeMaps = response.data.results.reduce((accum, isochrone) => {
        accum[isochrone.search_id] = isochroneToPolygon(isochrone)
        return accum
      }, {})
      this.fitBounds()
    } catch (err) {
      console.error(err)
    }
  },
  methods: {
    fitBounds () {
      if (process.server || !this.$refs.isochrones) { return }
      this.$nextTick(() => {
        const map = this.$refs.map.mapObject

        const bounds = this.$L.latLngBounds()
        this.$refs.isochrones.forEach((isochrone) => {
          bounds.extend(isochrone.mapObject.getBounds())
        })
        map.flyToBounds(bounds)
      })
    }
  }
}
</script>
