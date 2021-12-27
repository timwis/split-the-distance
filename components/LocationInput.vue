<template>
  <b-autocomplete
    v-bind="$attrs"
    :value="value && value.properties && value.properties.name"
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
import { geocode } from '@/lib/travel-time'

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
        const response = await this.$axios(geocode(query))
        this.features = response.data.features
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
