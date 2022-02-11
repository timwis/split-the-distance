<script lang="ts">
	import '../app.scss'
	import Navbar from '$lib/Navbar.svelte'
</script>

<div id="app">
	<header>
		<Navbar />
	</header>
	<main>
		<slot />
	</main>
</div>

<style lang="scss">
	#app {
		display: grid;
		grid-template-rows: 52px calc(100vh - 52px);
		grid-template-areas: "header" "main";
	}
</style>
