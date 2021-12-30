import mbxClient from '@mapbox/mapbox-sdk'
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding'

export default function ({ $config: { mapboxApiKey } }, inject) {
  const client = mbxClient({ accessToken: mapboxApiKey })
  const mapbox = {
    geocoding: mbxGeocoding(client)
  }
  inject('mapbox', mapbox)
}
