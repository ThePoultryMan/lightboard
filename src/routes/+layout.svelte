<script lang="ts">
  import Header from "$components/Header.svelte";
  import "../app.css";
  let { children } = $props();
</script>

<header>
  <Header />
</header>
{@render children()}
