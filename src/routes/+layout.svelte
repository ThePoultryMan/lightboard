<script>
  import '../app.pcss';

  import Header from "$components/Header.svelte";
  import Footer from "$components/Footer.svelte";
</script>

<Header />
<div class="flex-1 w-full">
  <slot />
</div>
<Footer />
