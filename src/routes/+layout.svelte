<script lang="ts">
  import "../app.css";

  let { children } = $props();
</script>

<svelte:head>
  <title>Lightboard</title>
</svelte:head>

{@render children()}
