<script lang="ts">
  import Header from "$components/Header.svelte";
  import "../app.css";
  let { children } = $props();
</script>

<svelte:head>
  <title>Lightboard</title>
</svelte:head>

<header>
  <Header />
</header>
{@render children()}
