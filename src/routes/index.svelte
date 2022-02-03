<script lang="ts">
  import Fa from 'svelte-fa'
  import { faSearch } from '@fortawesome/free-solid-svg-icons'
  import LocationInput from '$lib/LocationInput.svelte'
</script>

<svelte:head>
  <title>Split the Distance</title>
</svelte:head>

<section class="section">
  <div class="container">
    <p>Find mutually convenient places to meet</p>

    <LocationInput name="yourLocation" id="yourLocation" required />
    <a class="button is-primary" href="/search">
      <span>Search</span>
      <span class="icon">
        <Fa icon={faSearch} />
      </span>
    </a>
  </div>
</section>
