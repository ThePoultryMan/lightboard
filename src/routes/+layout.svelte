<script>
  import '../app.pcss';

  import { onMount } from "svelte";
  import { setUp, getAllTeams } from "$lib/firebase.ts";

  import Header from "$components/Header.svelte";
  import Footer from "$components/Footer.svelte";

  let teams;

  onMount(async () => {
    setUp("fnl-24");

    teams = await getAllTeams()
  });
</script>

<Header />
<div class="flex-1 w-full">
  <slot />
</div>
<Footer />
