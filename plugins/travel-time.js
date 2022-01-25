import find from 'lodash/find'

import { geojsonArrayToObject, isochroneToPolygon } from '~/lib/geometry'

/**
 * A location
 * @typedef {Object} Location
 * @property {string} label
 * @property {number[]} point
 */

export default function ({ $axios }, inject) {
  const travelTime = new TravelTime($axios)
  inject('travelTime', travelTime)
}

class TravelTime {
  constructor ($axios) {
    const currentBaseURL = $axios.defaults.baseURL
    this.client = $axios.create({
      baseURL: currentBaseURL + 'traveltime/'
    })
  }

  /**
   * Gets polygon of areas where origin isochrones intersect
   * @param {Object} params
   * @param {Location[]} params.origins
   * @param {string} travelMode
   * @param {number} travelTime
   * @param {string?} arrivalTime
   * @returns {Polygon}
   */
  async getIntersection ({
    origins,
    travelMode,
    travelTime,
    arrivalTime = (new Date()).toISOString()
  }) {
    const opts = {
      arrival_searches: origins.map(origin => ({
        id: origin.label,
        coords: geojsonArrayToObject(origin.point),
        transportation: { type: travelMode },
        arrival_time: arrivalTime,
        travel_time: travelTime * 60
      })),
      intersections: [
        {
          id: 'intersection',
          search_ids: origins.map(origin => origin.label)
        }
      ]
    }
    const data = await this.client.$post('/time-map', opts)
    const intersection = find(data.results, ['search_id', 'intersection'])
    return isochroneToPolygon(intersection)
  }
}
