<script lang="ts">
  import Link from "$components/Link.svelte";
  import { sessionData } from "$lib/state";

  const { embedMode }: { embedMode?: boolean } = $props();

  let user = $state();

  sessionData.subscribe((data) => {
    user = data.user;
  });
</script>

<div class="bg-secondary-500 sticky top-0 flex items-center gap-5 px-3 py-2">
  <span class="text-lg">
    {#if embedMode}
      Leaderboard
    {:else}
      <Link href="/">Lightboard</Link>
    {/if}
  </span>
  <nav class="flex w-full justify-between">
    <div class="*:mx-3">
      {#if !embedMode}
        <Link href="/">Home</Link>
        <Link href="/leaderboard">Leaderboard</Link>
      {/if}
    </div>
    <div>
      <Link href="/account">
        {#if user}
          Account
        {:else}
          Sign In
        {/if}
      </Link>
    </div>
  </nav>
</div>
