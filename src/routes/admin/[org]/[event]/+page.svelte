<script lang="ts">
  import EditableCard from "$components/EditableCard.svelte";
  import OpenableCard from "$components/OpenableCard.svelte";
  import type { Event } from "$lib";
  import { getEventData } from "$lib/firebase";
  import { getUserInfo, type UserInfo } from "$lib/firebase/admin";
  import { sessionData } from "$lib/index.svelte";
  import { ScoreType, ScoreTypes } from "$lib/scoring";
  import Icon from "@iconify/svelte";
  import { onMount } from "svelte";

  let {
    data,
  }: {
    data: {
      org: string;
      event: string;
    };
  } = $props();

  let currentUserInfo: Promise<UserInfo> = $derived.by(async () => {
    if (sessionData.user) {
      return await getUserInfo(sessionData.user.user.uid);
    } else {
      return {
        admins: [],
      };
    }
  });
  let eventData: Event | undefined = $state();

  onMount(async () => {
    eventData = await getEventData(data.org, data.event);
  });
</script>

{#if sessionData.user}
  {#await currentUserInfo then userInfo}
    {#if userInfo.admins.includes(`${data.org}/${data.event}`)}
      {#if eventData}
        <h1 class="mb-5 text-2xl font-semibold">
          <span class="text-slate-400">{data.org}</span> <span class="text-slate-300">&gt;</span>
          {eventData.metaData.displayName}
        </h1>
        <div class="flex gap-3">
          <div class="basis-1/5 rounded-lg bg-neutral-800 p-2">
            <h3 class="text-lg">Metadata</h3>
            <div>
              <!--Sections-->
              <h4 class="sticky top-0 mb-2">Sections</h4>
              {#each eventData.metaData.sections as section}
                <EditableCard
                  title={section.displayName}
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
              <!--Divisions-->
              <h4 class="sticky top-0 mb-2">Divisions</h4>
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
          <div class="basis-3/5 rounded-lg bg-neutral-800 p-2">
            <h2 class="text-lg">Scores</h2>
            <table class="w-full border">
              <thead>
                <tr>
                  <th>Name</th>
                  {#each eventData.metaData.sections as section}
                    <th>{section.displayName}</th>
                  {/each}
                </tr>
              </thead>
              <tbody>
                {#each eventData.teams as team}
                  {#each team.participants as participant, index}
                    <tr>
                      <td>{participant.name}</td>
                      {#each participant.scores as score}
                        <td>
                          <EditableCard>
                            <div>
                              <label for={"score" + participant.name + index}>Score: </label>
                              <input
                                type="text"
                                id={"score" + participant.name + index}
                                class="editable-input"
                                bind:value={score.score}
                                readonly
                              />
                            </div>
                            <div>
                              <label for={"division" + participant.name + index}>Division: </label>
                              <select
                                id={"division" + participant.name + index}
                                bind:value={score.division}
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
                                bind:value={score.scoreType}
                                disabled
                              >
                                {#each ScoreTypes as scoreType}
                                  <option>{scoreType}</option>
                                {/each}
                              </select>
                            </div>
                          </EditableCard>
                        </td>
                      {/each}
                    </tr>
                  {/each}
                {/each}
              </tbody>
            </table>
          </div>
          <div class="basis-1/5 rounded-lg bg-neutral-800 p-2">
            <h2 class="text-lg">Teams</h2>
            {#each eventData.teams as team}
              <OpenableCard class="rounded-lg border border-slate-200 not-last:mb-2">
                <EditableCard
                  bind:title={team.meta.displayName}
                  titleEditable
                  titleName="Team Name"
                >
                  <div class="flex gap-3">
                    <p>Members:</p>
                    <button
                      class="flex h-6 w-6 items-center justify-center rounded-lg bg-neutral-700"
                      onclick={() => team.participants.push({ name: "New Member", scores: [] })}
                    >
                      <Icon icon="material-symbols:add-2-rounded" />
                    </button>
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
        </div>
      {/if}
    {:else}
      <p>This event does not exist, or you do not have permission to edit this event.</p>
    {/if}
  {/await}
{:else}
  <p>You are not logged in!</p>
{/if}

<style>
  .list-dash {
    list-style-type: "- ";
  }
</style>
