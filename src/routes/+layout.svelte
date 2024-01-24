<script>
  import '../app.pcss';

  import { onMount } from "svelte";
  import { setUp } from "$lib/firebase.ts";

  import Header from "$components/Header.svelte";
  import Footer from "$components/Footer.svelte";

  onMount(() => {
    setUp("fnl-24");
  });
</script>

<Header />
<div class="flex-1 w-full">
  <slot />
</div>
<Footer />
