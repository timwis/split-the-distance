<template>
  <b-autocomplete
    v-bind="$attrs"
    :value="value.properties && value.properties.name"
    :data="features"
    :loading="isLoading"
    field="properties.name"
    keep-first
    @typing="search"
    @select="option => $emit('input', option)"
  >
    <template #default="{ option }">
      <div>{{ option.properties.name }}</div>
    </template>
  </b-autocomplete>
</template>

<script>
import debounce from 'lodash/debounce'

export default {
  props: {
    value: {
      type: Object,
      required: true
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
      const url = '/traveltime/geocoding/search'
      const params = { query }
      try {
        const data = await this.$axios.$get(url, { params })
        this.features = data.features
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
