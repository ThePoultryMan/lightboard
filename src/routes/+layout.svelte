<script lang="ts">
  import "../app.css";

  import Footer from "$components/Footer.svelte";
  import Header from "$components/Header.svelte";
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { sessionData } from "$lib/index.svelte";

  let { children } = $props();

  onMount(() => {
    let eventCode = page.url.searchParams.get("e");
    if (eventCode) {
      sessionData.eventCode = eventCode;
    }
  });
</script>

<svelte:head>
  <title>Lightboard</title>
</svelte:head>

<div class="flex min-h-screen flex-col text-slate-200">
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
