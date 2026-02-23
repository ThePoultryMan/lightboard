<script lang="ts">
  import Footer from "$components/Footer.svelte";
  import Header from "$components/Header.svelte";
  import Leaderboard from "$components/Leaderboard.svelte";
  import type { PageProps } from "./$types";

  const data: PageProps = $props();
</script>

<div class="flex min-h-screen flex-col text-slate-200">
  <header>
    <Header embedMode />
  </header>
  <div class="bg-background-500 flex-1 px-5 py-3">
    <Leaderboard data={data.data} />
  </div>
  <footer>
    <Footer />
  </footer>
</div>
