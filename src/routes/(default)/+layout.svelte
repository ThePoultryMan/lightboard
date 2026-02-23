<script lang="ts">
  import Footer from "$components/Footer.svelte";
  import Header from "$components/Header.svelte";
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { sessionData } from "$lib/state";

  let { children } = $props();

  onMount(() => {
    let eventCode = page.url.searchParams.get("e");
    if (eventCode) {
      const split = eventCode.split("/");
      sessionData.update((sessionData) => {
        sessionData.eventCode = { org: split[0], event: split[1] };
        return sessionData;
      });
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
  <div class="bg-background-500 flex-1 px-5 py-3">
    {@render children()}
  </div>
  <footer>
    <Footer />
  </footer>
</div>
