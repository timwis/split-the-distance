<script lang="ts">
  import Fa from 'svelte-fa'
  import { faSearch } from '@fortawesome/free-solid-svg-icons'
</script>

<svelte:head>
  <title>Split the Distance</title>
</svelte:head>

<section class="section">
  <div class="container">
    <p>Find mutually convenient places to meet</p>

    <a class="button is-primary" href="/search">
      <span>Search</span>
      <span class="icon">
        <Fa icon={faSearch} />
      </span>
    </a>
  </div>
</section>
