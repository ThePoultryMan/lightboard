<script lang="ts">
  import type { Event, Participant } from "$lib";
  import { getEventData } from "$lib/firebase";
  import { sessionData, type EventCode } from "$lib/state.js";
  import { getTeamScores, sortLeaderboard } from "$lib/scoring/util";
  import { participantsIncludes } from "$lib/util";

  let eventCode: EventCode | undefined = $state();
  sessionData.subscribe((data) => {
    eventCode = data.eventCode;
  });
  let data: Event | undefined = $state();
  let promisedData = $derived.by(() => {
    if (eventCode) {
      return getEventData(eventCode.org, eventCode.event);
    } else {
      return getEventData("example", "example-event-1");
    }
  });
  $effect(() => {
    promisedData.then((value) => {
      data = value;
    });
  });
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
  let division = $state(0);
  let section = $state(0);
  let summedSectionScores = $derived.by(() => {
    if (!data?.metaData.sections || !data.metaData.divisions) return {};
    const summedSectionScores: any = {};
    const allParticipant: Participant[] = [];
    for (const team of data?.teams) {
      allParticipant.push(...team.participants);
    }
    data?.teams.forEach((team) => {
      for (const section of data?.metaData.sections!) {
        if (team.participants) {
          let sum = 0;
          for (const division of data?.metaData.divisions!) {
            getTeamScores(allParticipant, section.index, division).forEach((teamScore) => {
              if (participantsIncludes(team.participants, teamScore)) {
                sum += teamScore.adjustedScore;
              }
            });
          }
          summedSectionScores[team.meta.displayName] = summedSectionScores[team.meta.displayName]
            ? summedSectionScores[team.meta.displayName]
            : {};
          summedSectionScores[team.meta.displayName][section.index] = sum;
        } else {
          summedSectionScores[team.meta.displayName] = {};
          summedSectionScores[team.meta.displayName][section.index] = 0;
        }
      }
    });
    return summedSectionScores;
  });
  const teamPoints: Record<string, Number> = $derived.by(() => {
    if (summedSectionScores) {
      const result: Record<string, number> = {};
      for (const team of Object.keys(summedSectionScores)) {
        let sum = 0;
        for (const section of Object.keys(summedSectionScores[team])) {
          sum += summedSectionScores[team][section];
        }
        result[team] = sum;
      }
      // console.log(Object.keys(summedSectionScores))
      return result;
    } else {
      return {};
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
            <p class="m-1 text-lg leading-2 font-semibold">
              {teamPoints ? teamPoints[team.meta.displayName] : 0}
            </p>
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
                <p class="font-bold">
                  {summedSectionScores[team.meta.displayName][section.index]
                    ? summedSectionScores[team.meta.displayName][section.index]
                    : 0}
                </p>
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
    <div class="mb-1.5 flex gap-3">
      <h2 class="text-lg">Leaderboard</h2>
      <select bind:value={section} class="rounded-md bg-indigo-950 px-1.5 py-1">
        {#each data.metaData.sections as section}
          <option value={section.index}>{section.displayName}</option>
        {/each}
      </select>
      <select bind:value={division} class="rounded-md bg-indigo-950 px-1.5 py-1">
        {#each data.metaData.divisions as division}
          <option value={division.index}>{division.displayName}</option>
        {/each}
      </select>
    </div>
    <ol class="list-inside list-decimal">
      {#each sortLeaderboard(getTeamScores(mergedParticipants, section, data.metaData.divisions[division])) as sectionScore}
        <li>
          {sectionScore.name}: {sectionScore.scoreData.score} <span class="mx-3">-</span>
          {sectionScore.adjustedScore} Team Points
        </li>
      {/each}
    </ol>
  </div>
{/if}
