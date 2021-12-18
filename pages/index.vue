<template>
  <main class="container">
    <p>Find mutually convenient places to meet</p>
    <b-button
      tag="nuxt-link"
      to="/search"
      type="is-primary"
      icon-right="magnify"
    >
      Search
    </b-button>
  </main>
</template>

<script>
export default {
  name: 'IndexPage'
}
</script>
