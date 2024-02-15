<script lang="ts">
  import { onMount } from "svelte";

  import { setUp, isSetup, getAllTeams, getDivision, getDivisionNames, getEventData, getScores } from "$lib/firebase.ts";

  import TeamDisplay from "$components/TeamDisplay.svelte";

  let eventData;
  let teams = [];
  let divisions = [];
  let scores = [];

  let current = [];
  let scoreData = {};
  let selectedWeek = 0;
  $: selectedWeek, calculateCurrent();
  let selectedDivision = 0;
  $: selectedDivision, calculateCurrent();

  onMount(async () => {
    if (!isSetup()) setUp("fnl-24");
    eventData = await getEventData();
    teams = await getAllTeams();
    divisions = await getDivisionNames();
    scores = await getScores();

    await calculateCurrent();
  });

  async function calculateCurrent() {
    if (!eventData) return;
    let divisionData = await getDivision(eventData, divisions[selectedDivision]);
    scoreData = {start: divisionData.start, decrease: divisionData.decrease};
    current = [];
    for (const [name, data] of Object.entries(scores[selectedWeek])) {
      if (divisions[selectedDivision] === data.division) {
        current.push({name: name, score: data.score, breaker: data.breaker});   
      }
    }
    sortScores();
  }

  function sortScores() {
    const temp = [];
    current.forEach((data, index) => {
      if (temp.length > 0) {
        for (const t of temp) {
          if (t.score > data.score) {
            temp.splice(index, 0, data.name);
            break;
          } else if (t.breaker > data.breaker) {
            temp.splice(index, 0, data.name);  
            break;  
          } else {
            temp.splice(index + 1, 0, data.name);
            break;
          }
        }
      } else {
        temp.push(data.name);
      }
    });
    current = temp;
  }
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
      <label for="week-select">Week:</label>
      <select id="week-select" class="mr-2" bind:value={selectedWeek}>
        {#each scores as _, week}
          <option value={week}>{week + 1}</option>
        {/each}
      </select>
      <label for="division-select">Division:</label>
      <select id="division-select" bind:value={selectedDivision}>
        {#each divisions as division, index}
          <option value={index}>{division}</option>
        {/each}
      </select>
      <div>
        <ol class="list-decimal list-inside">
          {#each current as name, index}
            <li>{name} - {scoreData.start - index * scoreData.decrease}</li>
          {/each}
        </ol>
      </div>
    </div>
  {/if}
</div>
