<script lang="ts">
  import type { Event, Participant } from "$lib";
  import { getEventData } from "$lib/firebase";
  import { sessionData, type EventCode } from "$lib/state.js";
  import { getSortableScores, getTeamScores } from "$lib/scoring/util";
  import { participantsIncludes } from "$lib/util";
  import type { PageProps } from "./$types";
  import PointBar from "$components/PointBar.svelte";

  const { data }: PageProps = $props();
  let eventCode: EventCode | undefined = $state();
  sessionData.subscribe((sessionData) => {
    eventCode = sessionData.eventCode;
  });
  let eventData: Event | undefined = $state();
  let promisedData = $derived.by(() => {
    if (eventCode) {
      return getEventData(eventCode.org, eventCode.event);
    } else {
      return getEventData("example", "example-event-1");
    }
  });
  $effect(() => {
    promisedData.then((value) => {
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
  let summedSectionScores = $derived.by(() => {
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
  let teamDisplay: HTMLElement | undefined = $state();
  const isScrollable = $derived(
    teamDisplay ? teamDisplay.scrollWidth > teamDisplay.clientWidth : false,
  );

  $effect(() => {
    eventCode = { org: data.org, event: data.event };
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
          class={"flex h-44 items-end gap-4 overflow-x-scroll rounded-lg border-1 border-red-500 p-2.5 pb-0 " +
            (isScrollable ? "justify-normal" : "justify-between")}
        >
          {#each eventData.metaData.sections as section, index}
            <!--We have to use this twice so we only bind the first display-->
            {#if index === 0}
              <PointBar
                name={section.displayName}
                points={summedSectionScores[team.meta.displayName][section.index].score}
                bonusPoints={summedSectionScores[team.meta.displayName][section.index].bonusPoints}
                bind:thisBind={teamDisplay}
              />
            {:else}
              <PointBar
                name={section.displayName}
                points={summedSectionScores[team.meta.displayName][section.index].score}
                bonusPoints={summedSectionScores[team.meta.displayName][section.index].bonusPoints}
              />
            {/if}
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
