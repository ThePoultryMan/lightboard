<script lang="ts">
  import type { EventData, Participant } from "$lib";
  import { sessionData, type EventCode } from "$lib/state.js";
  import {
    getScoreStats,
    getSortableScores,
    getTeamScores,
    type SummedSectionScoreStats,
  } from "$lib/scoring/util";
  import { participantsIncludes } from "$lib/util";
  import type { PageProps } from "./$types";
  import { getEventData } from "$lib/api";
  import { onMount } from "svelte";
  import Chart from "$components/Chart.svelte";
  import type { SummedSectionScores } from "$lib/scoring";

  const { data }: PageProps = $props();
  let eventCode: EventCode | undefined = $state();
  sessionData.subscribe((sessionData) => {
    eventCode = sessionData.eventCode;
  });
  let eventData: EventData | undefined = $state();
  let promisedData: Promise<EventData> | undefined = $state();
  $effect(() => {
    promisedData?.then((value) => {
      eventData = value;
    });
  });
  let mergedParticipants = $derived.by(() => {
    if (!eventData) return [];
    const participants: Participant[] = [];
    eventData?.teams.forEach((team) => {
      if (team.participants) {
        participants.push(...team.participants);
      }
    });
    return participants;
  });
  let division = $state(0);
  let section = $state(0);
  // this is a nightmare type, i need to rewrite it asap.
  let summedSectionScores: SummedSectionScores = $derived.by(() => {
    if (!eventData?.metaData.sections || !eventData.metaData.divisions) return {};
    const summedSectionScores: any = {};
    eventData?.teams.forEach((team) => {
      for (const section of eventData?.metaData.sections!) {
        if (team.participants) {
          let sum = 0;
          let bonusPoints = 0;
          for (const division of eventData?.metaData.divisions!) {
            getTeamScores(
              getSortableScores(mergedParticipants, section.index, division),
              division,
            ).forEach((teamScore) => {
              if (participantsIncludes(team.participants, teamScore)) {
                sum += teamScore.adjustedScore;
                bonusPoints += teamScore.bonusPoints;
              }
            });
          }
          summedSectionScores[team.meta.displayName] = summedSectionScores[team.meta.displayName]
            ? summedSectionScores[team.meta.displayName]
            : {};
          summedSectionScores[team.meta.displayName][section.index] = summedSectionScores[
            team.meta.displayName
          ][section.index]
            ? summedSectionScores[team.meta.displayName][section.index]
            : {};
          summedSectionScores[team.meta.displayName][section.index].score = sum;
          summedSectionScores[team.meta.displayName][section.index].bonusPoints = bonusPoints;
        } else {
          summedSectionScores[team.meta.displayName] = {};
          summedSectionScores[team.meta.displayName][section.index] = 0;
        }
      }
    });
    return summedSectionScores;
  });
  const scoreStats: SummedSectionScoreStats = $derived.by(() => {
    const stats = getScoreStats(summedSectionScores);

    // add padding to the vertical range so the graphs look better.
    stats.highest += 10;
    if (stats.lowest - 10 >= 0) {
      stats.lowest -= 10;
    }

    return stats;
  });
  const teamPoints: Record<string, Number> = $derived.by(() => {
    if (summedSectionScores) {
      const result: Record<string, number> = {};
      for (const team of Object.keys(summedSectionScores)) {
        let sum = 0;
        for (const section of Object.keys(summedSectionScores[team])) {
          sum +=
            summedSectionScores[team][section].score +
            summedSectionScores[team][section].bonusPoints;
        }
        result[team] = sum;
      }
      return result;
    } else {
      return {};
    }
  });
  const graphData = $derived.by(() => {
    const result: Record<string, number[]> = {};
    if (summedSectionScores) {
      for (const team of Object.keys(summedSectionScores)) {
        result[team] = [];

        for (const section of Object.keys(summedSectionScores[team])) {
          result[team].push(summedSectionScores[team][section].score);
        }
      }
    }
    return result;
  });

  $effect(() => {
    eventCode = { org: data.org, event: data.event };
  });

  onMount(() => {
    if (eventCode) {
      promisedData = getEventData(eventCode.org, eventCode.event);
    } else {
      promisedData = getEventData("example", "example-event-1");
    }
  });
</script>

{#if eventData}
  <h1 class="mb-3.5 text-2xl font-semibold">{eventData.metaData.displayName}</h1>
  <!--Team Display-->
  <div class={`mb-4 sm:flex sm:flex-wrap sm:justify-center md:gap-3`}>
    {#each eventData.teams as team}
      <div
        class={`mb-2.5 rounded-lg bg-red-900 p-2 max-md:last:mb-4 md:mb-0 ${eventData.teams.length >= 5 ? "md:w-<-1/3" : "md:w-<-1/2"}`}
      >
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
          class="position-relative h-50 w-full items-end gap-4 rounded-lg border-1 border-red-500 p-1"
          style="--color-surface-content: 220 13% 68%;"
        >
          <Chart
            type="line"
            data={{
              labels: eventData.metaData.sections.map((section) => section.displayName),
              datasets: [
                {
                  label: "Points",
                  data: graphData[team.meta.displayName],
                  backgroundColor: "rgba(255, 255, 255, 0.75)",
                  borderColor: "rgba(255, 255, 255, 0.75)",
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  min: scoreStats.lowest,
                  max: scoreStats.highest,
                },
              },
            }}
            fontColor="#000"
          />
        </div>
      </div>
    {/each}
  </div>
  <!--Leader Board-->
  <div class="rounded-lg bg-indigo-900 p-3">
    <div class="mb-1.5 flex gap-3">
      <h2 class="text-lg">Leaderboard</h2>
      <select bind:value={section} class="rounded-md bg-indigo-950 px-1.5 py-1">
        {#each eventData.metaData.sections as section}
          <option value={section.index}>{section.displayName}</option>
        {/each}
      </select>
      <select bind:value={division} class="rounded-md bg-indigo-950 px-1.5 py-1">
        {#each eventData.metaData.divisions as division}
          <option value={division.index}>{division.displayName}</option>
        {/each}
      </select>
    </div>
    <ol class="list-inside list-decimal">
      {#each getTeamScores(getSortableScores(mergedParticipants, section, eventData.metaData.divisions[division]), eventData.metaData.divisions[division]) as teamScore}
        <li>
          {teamScore.name}: {teamScore.score} <span class="mx-3">-</span>
          {teamScore.adjustedScore} Team Points {teamScore.bonusPoints
            ? `(+${teamScore.bonusPoints} Bonus point${teamScore.bonusPoints > 1 ? "s" : ""})`
            : ""}
        </li>
      {/each}
    </ol>
  </div>
{:else}
  <p>loading...</p>
{/if}

<style>
  @media (width >= 48rem) {
    .md\:w-\<-1\/2 {
      width: calc(50% - 6px);
    }

    .md\:-w-1\<-\/3 {
      width: calc(33% - 6px);
    }
  }
</style>
