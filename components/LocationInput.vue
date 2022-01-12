<template>
  <b-autocomplete
    v-bind="$attrs"
    :value="value && value.text"
    :data="features"
    :loading="isLoading"
    field="text"
    keep-first
    @typing="search"
    @select="option => $emit('input', option)"
  >
    <template #default="{ option }">
      <div>{{ option.place_name }}</div>
    </template>
  </b-autocomplete>
</template>

<script>
import debounce from 'lodash/debounce'

export default {
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      features: [],
      selected: null,
      isLoading: false
    }
  },
  methods: {
    search: debounce(async function (query) {
      if (!query.length) {
        this.features = []
        return
      }

      this.isLoading = true
      try {
        const response = await this.$mapbox.geocoding.forwardGeocode({
          query,
          types: ['postcode', 'district', 'place', 'locality', 'neighborhood',
            'address'],
          autocomplete: true
        }).send()
        this.features = response.body.features
      } catch (error) {
        this.features = []
        throw error
      }
      this.isLoading = false
    }, 500)
  }
}
</script>

<style>
.autocomplete .dropdown-item {
  white-space: inherit;
}
</style>
