import find from 'lodash/find'
import { Plugin } from '@nuxt/types'
import { NuxtAxiosInstance } from '@nuxtjs/axios'

import { geojsonArrayToObject, isochroneToPolygon } from '~/lib/geometry'

interface Location {
  label: string
  point: number[]
}

interface GetIntersectionParams {
  origins: Location[],
  travelMode: 'cycling' | 'driving' | 'public_transport' | 'walking',
  travelTime: number
  arrivalTime?: string
}

class TravelTime {
  private client: NuxtAxiosInstance
  
  constructor ($axios: NuxtAxiosInstance) {
    const currentBaseURL = $axios.defaults.baseURL
    this.client = $axios.create({
      baseURL: currentBaseURL + 'traveltime/'
    })
  }

  async getIntersection ({
    origins,
    travelMode,
    travelTime,
    arrivalTime = (new Date()).toISOString()
  }: GetIntersectionParams) {
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

const plugin: Plugin = function ({ $axios }, inject) {
  const travelTime = new TravelTime($axios)
  inject('travelTime', travelTime)
}

declare module 'vue/types/vue' {
  interface Vue {
    $travelTime: TravelTime
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $travelTime: TravelTime
  }
  interface Context {
    $travelTime($axios: NuxtAxiosInstance): void
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $travelTime: TravelTime
  }
}

export default plugin
