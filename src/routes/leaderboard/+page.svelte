<script lang="ts">
  import { onMount } from "svelte";

  import { setUp, isSetup, getAllTeams, getEventData } from "$lib/firebase.ts";

  import TeamDisplay from "$components/TeamDisplay.svelte";

  let eventData;
  let teams = [];

  onMount(async () => {
    if (!isSetup()) setUp("fnl-24");
    eventData = await getEventData();
    teams = await getAllTeams();
  });
</script>

<div class="m-3">
  {#if eventData}
    <h1 class="mb-2 text-xl font-semibold">{eventData.meta.name}</h1>
    <div class="flex items-start gap-3">
      {#each teams as team}
        <TeamDisplay data={team} />
      {/each}
    </div>
    <div class="p-2 bg-sky-300 rounded-lg">
      <label for="week-select">Week</label>
      <select id="week-select">
        <option>1</option>
      </select>
    </div>
  {/if}
</div>
