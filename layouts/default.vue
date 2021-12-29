<template>
  <div id="app">
    <header>
      <NavBar />
    </header>
    <Nuxt class="main" keep-alive :keep-alive-props="{ exclude: ['ResultsPage'] }" />
  </div>
</template>

<script>
export default {
  name: 'DefaultLayout'
}
</script>

<style>
#app {
  display: grid;
  grid-template-rows: 52px calc(100vh - 52px);
  grid-template-areas: "header" ".main";
}
</style>
