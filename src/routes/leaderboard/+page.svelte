<script lang="ts">
  import type { Event, Participant } from "$lib";
  import { sessionData } from "$lib/index.svelte.js";
  import { getTeamScores, sortLeaderboard } from "$lib/scoring/util";
  import { onMount } from "svelte";

  let data: Event | undefined = $state(undefined);
  let mergedParticipants = $derived.by(() => {
    if (!data) return [];
    const participants: Participant[] = [];
    data?.teams.forEach((team) => {
      if (team.participants) {
        participants.push(...team.participants);
      }
    });
    return participants;
  });

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
  <h1 class="mb-3.5 text-2xl font-semibold">{data.metaData.displayName}</h1>
  <div class="gap-3 md:flex">
    {#each data.teams as team}
      <div class="mb-2.5 flex-1 rounded-lg bg-red-900 p-2">
        <!--Team Header-->
        <div class="mb-3 flex justify-between">
          <p class="text-xl">{team.meta.displayName}</p>
          <div class="text-right">
            <p class="m-1 text-lg leading-2 font-semibold">0</p>
            <p class="mr-1 text-sm">Team Points</p>
          </div>
        </div>
        <!--Section Display-->
        <div
          class="flex h-44 items-end justify-evenly rounded-lg border-1 border-red-500 p-2.5 pb-0"
        >
          {#each data.metaData.sections as section}
            <div class="flex gap-3">
              <div class="text-right">
                <p>{section.displayName}</p>
                <p class="font-bold">0</p>
              </div>
              <div class="w-5 rounded-t-md bg-red-500" style="height: 48px;"></div>
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>
  <!--Leader Board-->
  <div class="rounded-lg bg-indigo-900 p-3">
    <h2 class="mb-1.5 text-lg">Leaderboard</h2>
    <ol class="list-decimal list-inside">
      {#each sortLeaderboard(getTeamScores(mergedParticipants, 0)) as sectionScore}
        <li>{sectionScore.name}</li>
      {/each}
    </ol>
  </div>
{/if}
