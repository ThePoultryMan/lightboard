<script lang="ts">
  import Footer from "$components/Footer.svelte";
  import Header from "$components/Header.svelte";
  import "../app.css";
  let { children } = $props();
</script>

<svelte:head>
  <title>Lightboard</title>
</svelte:head>

<div class="flex flex-col min-h-screen">
  <header>
    <Header />
  </header>
  <div class="flex-1">
    {@render children()}
  </div>
  <footer>
    <Footer />
  </footer>
</div>
