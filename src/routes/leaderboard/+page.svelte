<script lang="ts">
  import { onMount } from "svelte";

  import { setUp, isSetup, getAllTeams } from "$lib/firebase.ts";

  import TeamDisplay from "$components/TeamDisplay.svelte";

  let teams = [];

  onMount(async () => {
    if (!isSetup()) setUp("fnl-24");
    teams = await getAllTeams();
  });
</script>

<div class="flex gap-3 m-3">
  {#each teams as team}
    <TeamDisplay name={team.name} />
  {/each}
</div>
