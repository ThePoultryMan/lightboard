<!--TODO: split this into smaller components-->
<script lang="ts">
  import AdminButton from "$components/AdminButton.svelte";
  import EditableCard from "$components/EditableCard.svelte";
  import OpenableCard from "$components/OpenableCard.svelte";
  import { ScoreData, type EventData, type Participant } from "$lib";
  import { Warning } from "$lib/admin";
  import { type UserInfo } from "$lib/server/firebase/admin";
  import { sessionData } from "$lib/state";
  import { ScoreTypes } from "$lib/scoring";
  import Icon from "@iconify/svelte";
  import { onMount } from "svelte";
  import { getEventData, getUserInfo, saveEventData } from "$lib/api";

  const DIVISIONS_TAB: number = 0;
  const SECTIONS_TAB: number = 1;
  const SCORES_TAB: number = 2;
  const TEAMS_TAB: number = 3;

  let {
    data,
  }: {
    data: {
      org: string;
      event: string;
    };
  } = $props();

  let user: UserInfo = $state({ admins: [] });
  sessionData.subscribe(async (data) => {
    if (data.user) {
      user = await getUserInfo(data.user.user.uid);
    }
  });

  let currentTab = $state(SCORES_TAB);

  let eventData: EventData | undefined = $state();
  let mergedParticipantNames = $derived.by(() => {
    if (eventData) {
      let participantNames = [];
      for (const team of eventData.teams) {
        for (const participant of team.participants) {
          participantNames.push(participant.name);
        }
      }
      return participantNames;
    } else {
      return [];
    }
  });
  let information: "saving" | "saving-failure" | "saved" | "peak-error" | undefined = $state();
  let saveError: string | undefined = $state();
  let newestScore: string | undefined = $state();
  // TODO: Make warning system not god awful like it is now.
  let warnings: Warning[] = $derived.by(() => {
    const warnings: Warning[] = [];
    if (new Set(mergedParticipantNames).size !== mergedParticipantNames.length) {
      warnings.push(Warning.DuplicateMembers);
    } else {
      const index = warnings.indexOf(Warning.DuplicateMembers);
      if (index > -1) {
        warnings.splice(index, 1);
      }
    }

    if (eventData) {
      const seenIndexes: number[] = [];
      let foundIndexWarning = false;
      for (const section of eventData.metaData.sections) {
        if (seenIndexes.includes(section.index)) {
          warnings.push(Warning.DuplicateSectionIndexes);
          foundIndexWarning = true;
          break;
        } else {
          seenIndexes.push(section.index);
        }
      }
      if (!foundIndexWarning) {
        const index = warnings.indexOf(Warning.DuplicateSectionIndexes);
        if (index > -1) {
          warnings.splice(index, 1);
        }
      }

      const seenDisplayNames: string[] = [];
      let foundNameWarning = false;
      for (const section of eventData.metaData.sections) {
        if (seenDisplayNames.includes(section.displayName)) {
          warnings.push(Warning.DuplicateSectionNames);
          foundNameWarning = true;
          break;
        } else {
          seenDisplayNames.push(section.displayName);
        }
      }
      if (!foundNameWarning) {
        const index = warnings.indexOf(Warning.DuplicateSectionNames);
        if (index > -1) {
          warnings.splice(index, 1);
        }
      }
    }

    return warnings;
  });

  onMount(async () => {
    eventData = await getEventData(data.org, data.event);
  });

  async function save() {
    information = "saving";
    const result = await saveEventData(data.org, data.event, eventData);
    if (result.saved) {
      information = "saved";
    } else {
      information = "saving-failure";
      saveError = result.error;
    }
  }

  function dismiss() {
    information = undefined;
  }

  function addNewScore(participant: Participant, section: number) {
    participant.scores[section] = ScoreData.empty(section);
    newestScore = participant.name + section;
  }
</script>

{#if user}
  {#if user.admins.includes(`${data.org}/${data.event}`)}
    {#if eventData}
      <!--Information Cover-->
      {#if information}
        <div
          class="absolute top-0 left-0 z-20 flex h-dvh w-dvw items-center justify-center bg-[rgba(30,41,57,.7)]"
        >
          {#if information === "saving"}
            <Icon icon="line-md:loading-twotone-loop" class="h-24 w-24" />
          {:else if information === "saved"}
            <div class="rounded-lg bg-gray-800 p-5 text-center">
              <p class="mb-3 text-2xl">Saved!</p>
              <button onclick={dismiss} class="rounded-lg bg-neutral-700 px-3 py-1.5">
                Dismiss
              </button>
            </div>
          {:else}
            <div class="rounded-lg bg-gray-800 p-5 text-center">
              <p class="mb-3 text-2xl">Failed to Save</p>
              {#if information === "peak-error"}
                <p class="mb-3">{saveError}</p>
              {/if}
              <button
                onclick={() => (information = "peak-error")}
                class="mr-2 rounded-lg bg-neutral-700 px-3 py-1.5"
              >
                View Error
              </button>
              <button onclick={dismiss} class="rounded-lg bg-neutral-700 px-3 py-1.5">
                Dismiss
              </button>
            </div>
          {/if}
        </div>
      {/if}

      <p>
        Click <a href={`/admin/old/${data.org}/${data.event}`} class="underline">here</a> to go to the
        old interface.
      </p>

      <div class="mb-5 flex items-center justify-between gap-5">
        <h1 class="my-2 text-2xl leading-none font-semibold">
          <span class="text-slate-400">{data.org}</span> <span class="text-slate-300">&gt;</span>
          {eventData.metaData.displayName}
        </h1>
        <!--Warnings-->
        {#if warnings.length >= 1}
          <div class="flex items-center gap-3">
            <Icon icon="ion:warning" class="h-6 w-6 text-yellow-400" />
            <ul>
              {#each warnings as warning}
                <li>{Warning.toString(warning)}</li>
              {/each}
            </ul>
          </div>
        {/if}
      </div>

      <!--Buttons-->
      <div class="mb-3 flex items-center justify-between">
        <!--Tabs Buttons-->
        <div>
          <button
            onclick={() => (currentTab = DIVISIONS_TAB)}
            class={"rounded-lg px-3 py-1 transition-colors " +
              (currentTab === DIVISIONS_TAB ? "bg-neutral-500" : "bg-neutral-700")}
            >Divisions</button
          >
          <button
            onclick={() => (currentTab = SECTIONS_TAB)}
            class={"rounded-lg px-3 py-1 transition-colors " +
              (currentTab === SECTIONS_TAB ? "bg-neutral-500" : "bg-neutral-700")}>Sections</button
          >
          <button
            onclick={() => (currentTab = SCORES_TAB)}
            class={"rounded-lg px-3 py-1 transition-colors " +
              (currentTab === SCORES_TAB ? "bg-neutral-500" : "bg-neutral-700")}>Scores</button
          >
          <button
            onclick={() => (currentTab = TEAMS_TAB)}
            class={"rounded-lg px-3 py-1 transition-colors " +
              (currentTab === TEAMS_TAB ? "bg-neutral-500" : "bg-neutral-700")}>Teams</button
          >
        </div>
        <!--Save Button-->
        <button
          class="rounded-lg bg-neutral-600 px-5 py-2 disabled:bg-neutral-800 disabled:text-slate-500"
          disabled={warnings.length >= 1}
          onclick={save}
        >
          Save
        </button>
      </div>

      {#if currentTab === DIVISIONS_TAB}
        <div class="basis-1/5 rounded-lg bg-neutral-800 p-2">
          <h3 class="mb-1 text-lg">Divisions</h3>
          <div>
            <!--Divisions-->
            {#each eventData.metaData.divisions as division}
              <EditableCard
                title={division.displayName}
                titleName="Display Name"
                titleEditable={true}
                class="rounded-lg border border-slate-200 p-1 not-last:mb-2"
              >
                <div>
                  <label for={"divisionIndex" + division.index} class="p-1">Index: </label>
                  <input
                    type="number"
                    pattern="[0-9]"
                    id={"divisionIndex" + division.index}
                    class="editable-input"
                    bind:value={division.index}
                    readonly
                  />
                </div>
                <div>
                  <label for={"scoreStart" + division.index}>Score Start: </label>
                  <input
                    type="number"
                    pattern="[0-9]"
                    id={"scoreStart" + division.index}
                    class="editable-input"
                    bind:value={division.scoreStart}
                    readonly
                  />
                </div>
                <div>
                  <label for={"scoreDecrease" + division.index}>Score Decrease: </label>
                  <input
                    type="number"
                    pattern="[0-9]"
                    id={"scoreDecrease" + division.index}
                    class="editable-input"
                    bind:value={division.scoreDecrease}
                    readonly
                  />
                </div>
              </EditableCard>
            {/each}
          </div>
        </div>
      {:else if currentTab === SECTIONS_TAB}
        <div class="basis-1/5 rounded-lg bg-neutral-800 p-2">
          <h3 class="mb-1 text-lg">Sections</h3>
          <div>
            <!--Sections-->
            {#each eventData.metaData.sections as section}
              <EditableCard
                bind:title={section.displayName}
                titleName="Display Name"
                titleEditable={true}
                class="rounded-lg border border-slate-200 p-1 not-last:mb-2"
              >
                <div>
                  <label for={"index" + section.index} class="p-1">Index: </label>
                  <input
                    type="number"
                    pattern="[0-9]"
                    id={"index" + section.index}
                    class="editable-input"
                    bind:value={section.index}
                    readonly
                  />
                </div>
              </EditableCard>
            {/each}
          </div>
        </div>
      {:else if currentTab === SCORES_TAB}
        <div class="basis-3/5 overflow-scroll rounded-lg bg-neutral-800 p-2">
          <h2 class="text-lg">Scores</h2>
          <div class="overflow-scroll">
            <table class="w-full border">
              <thead>
                <tr>
                  <th class="w-40 p-1.5">Name</th>
                  {#each eventData.metaData.sections as section}
                    <th class="w-56 max-w-56 min-w-56 p-1.5">{section.displayName}</th>
                  {/each}
                </tr>
              </thead>
              <tbody>
                {#each eventData.teams as team}
                  {#each team.participants as participant}
                    <tr class="odd:bg-neutral-900">
                      <td class="p-1.5">{participant.name}</td>
                      {#each eventData.metaData.sections as section, index}
                        {#if participant.scores[index]}
                          <td class="p-1.5">
                            <OpenableCard
                              min-height="1.5rem"
                              class="rounded-lg border border-slate-200 p-1.5"
                              start-open={newestScore === participant.name + index}
                            >
                              <EditableCard>
                                <div>
                                  <label for={"score" + participant.name + index}>Score: </label>
                                  <input
                                    type="text"
                                    id={"score" + participant.name + index}
                                    class="editable-input w-20"
                                    bind:value={participant.scores[index].score}
                                    readonly
                                  />
                                </div>
                                <div>
                                  <label for={"bonusPoints" + participant.name + index}
                                    >Bonus points:
                                  </label>
                                  <input
                                    type="number"
                                    id={"bonusPoints" + participant.name + index}
                                    class="editable-input w-14"
                                    bind:value={participant.scores[index].bonusPoints}
                                    readonly
                                  />
                                </div>
                                <div>
                                  <label for={"division" + participant.name + index}
                                    >Division:</label
                                  >
                                  <select
                                    id={"division" + participant.name + index}
                                    bind:value={participant.scores[index].division}
                                    disabled
                                  >
                                    {#each eventData.metaData.divisions as division}
                                      <option value={division.index}>{division.displayName}</option>
                                    {/each}
                                  </select>
                                </div>
                                <div>
                                  <label for={"scoreType" + participant.name + index}
                                    >Score Type:
                                  </label>
                                  <select
                                    id={"scoreType" + participant.name + index}
                                    bind:value={participant.scores[index].scoreType}
                                    disabled
                                  >
                                    {#each ScoreTypes as scoreType}
                                      <option>{scoreType}</option>
                                    {/each}
                                  </select>
                                </div>
                              </EditableCard>
                            </OpenableCard>
                          </td>
                        {:else}
                          <td class="p-1.5">
                            <AdminButton
                              type="add"
                              onclick={() => addNewScore(participant, section.index)}
                              class="mx-auto"
                            />
                          </td>
                        {/if}
                      {/each}
                    </tr>
                  {/each}
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {:else if currentTab === TEAMS_TAB}
        <div class="basis-1/5 rounded-lg bg-neutral-800 p-2">
          <h2 class="text-lg">Teams</h2>
          {#each eventData.teams as team}
            <OpenableCard class="rounded-lg border border-slate-200 not-last:mb-2">
              <EditableCard
                bind:title={team.meta.displayName}
                titleEditable
                titleName="Team Name"
                update={team.participants.length}
              >
                <div class="flex gap-3">
                  <p>Members:</p>
                  <AdminButton
                    type="add"
                    onclick={() => team.participants.push({ name: "New Member", scores: [] })}
                  ></AdminButton>
                </div>
                <ul class="list-dash ml-2 list-inside">
                  {#each team.participants as participant}
                    <li>
                      <input
                        type="text"
                        class="editable-input"
                        readonly
                        bind:value={participant.name}
                      />
                    </li>
                  {/each}
                </ul>
              </EditableCard>
            </OpenableCard>
          {/each}
        </div>
      {/if}
    {/if}
  {:else}
    <p>This event does not exist, or you do not have permission to edit this event.</p>
  {/if}
{:else}
  <p>You are not logged in!</p>
{/if}

<style>
  .list-dash {
    list-style-type: "- ";
  }
</style>
