<script lang="ts">
  import type { Event } from "$lib";
  import { sessionData } from "$lib/index.svelte.js";
  import { onMount } from "svelte";

  let data: Event;

  onMount(async () => {
    if (sessionData.eventCode) {
      fetch(
        `/api/event-data/?org=${sessionData.eventCode.org}&event=${sessionData.eventCode.event}`,
      ).then((response) => response.json().then((json) => (data = json)));
    } else {
      fetch(`/api/event-data/?org=example&event=example-event-1`).then((response) =>
        response.json().then((json) => (data = json)),
      );
    }
  });
</script>

{#if data}
  <h1 class="text-2xl mb-3.5 font-semibold">{data.metaData?.displayName}</h1>
  <div class="md:flex gap-3">
    {#each data.teams as team}
      <div class="flex-1 rounded-lg bg-red-900 mb-2.5 p-2">
        <div class="flex justify-between">
          <p class="text-xl">{team.meta.displayName}</p>
          <div class="text-right">
            <p class="text-lg m-1 leading-2 font-semibold">0</p>
            <p class="text-sm mr-1">Team Points</p>
          </div>
        </div>
      </div>
    {/each}
  </div>
{/if}
