<script lang="ts">
  export let flexOne = true;
  export let name;

  let points = 0;
</script>

<div class="bg-blue-300 p-2 mb-3 rounded-lg" class:flex-1={flexOne}>
  <div class="flex justify-between">
    <span>{name}</span>
    <div class="text-right">
      <p class="text-lg font-semibold">{points}</p>
      <p class="text-sm">Team Points</p>
    </div>
  </div>
</div>
