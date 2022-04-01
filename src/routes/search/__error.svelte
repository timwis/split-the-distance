<script context="module">
  /** @type {import('@sveltejs/kit').ErrorLoad} */
  export function load ({ error, status }) {
    return {
      props: { status, error }
    }
  }
</script>

<script>
  export let status
  export let error
</script>

<section class="section">
  <div class="container content">
    {#if status == 429}
      <h1>Usage limit reached</h1>
      <h5>Try refreshing in a minute or so.</h5>
      <p>
        This application performs complex geospatial
        analysis using mapping and public transport data
        from around the world, powered by the TravelTime
        API. They've generously donated a number of 
        API credits for this application to use,
        but if too many people use the application at the
        same time, we hit the limit.
        <b>Try refreshing in a minute or so.</b>
      </p>
      <p>
        If you have any ideas for how we could cover the
        cost of running this application, to remove the
        limit, do
        <a href="mailto:tim@timwis.com">reach out</a>.
      </p>
    {:else}
      <h1>Error {status}</h1>
      <p>{error.message}</p>
    {/if}
  </div>
</section>
