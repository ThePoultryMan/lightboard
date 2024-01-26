<script lang="ts">
  import { onMount } from "svelte";

  export let flexOne = true;
  export let data;

  let points = 0;
  let showMembers = false;
  let memberList;
  let memberHeight = 1000;

  $: {
    if (memberList) {
      const clone = memberList.cloneNode(true);

      Object.assign(clone.style, {
          overflow: 'visible',
          height: 'auto',
          maxHeight: 'none',
          opacity: '0',
          visibility: 'hidden',
          display: 'block',
      });

      memberList.after(clone);
      memberHeight = clone.scrollHeight;
      clone.remove();
    }
  };
</script>

<div class="bg-blue-300 p-3 mb-3 rounded-lg" class:flex-1={flexOne}>
  <div class="flex justify-between">
    <span class="text-xl">{data.name}</span>
    <div class="float-right text-right">
      <p class="text-lg font-semibold">{points}</p>
      <p class="text-sm">Team Points</p>
    </div>
  </div>
  <div class="w-fit px-2 text-md bg-blue-200 rounded-lg open">
    <button on:click={() => (showMembers = !showMembers)}>{!showMembers ? "Show Members" : "Hide Members"}</button>
    <ul bind:this={memberList} class="overflow-hidden open" style:max-height={showMembers ? memberHeight + "px" : "0px"}>
      {#each data.members as member}
        <li class="inline mr-3 last:mr-0">{member}</li>
      {/each}
    </ul>
  </div>
</div>

<style>
  .open {
    transition: max-height 0.35s ease-in-out, width 0.35s ease-in-out;
  }
</style>
