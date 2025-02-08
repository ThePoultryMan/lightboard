<script>
  import Link from "$components/Link.svelte";
</script>

<div class="bg-secondary-500 sticky top-0 flex items-center gap-5 px-3 py-2">
  <span class="text-lg"><Link href="/">Lightboard</Link></span>
  <nav class="flex justify-between">
    <div class="*:mx-3">
      <Link href="/">
        Home
      </Link>
      <Link href="/leaderboard">
        Leaderboard
      </Link>
    </div>
  </nav>
</div>
