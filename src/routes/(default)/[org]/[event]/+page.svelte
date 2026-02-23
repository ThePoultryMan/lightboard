<script lang="ts">
  import type { PageProps } from "./$types";
  import Leaderboard from "$components/Leaderboard.svelte";

  const { data }: PageProps = $props();
</script>

<Leaderboard {data} />
