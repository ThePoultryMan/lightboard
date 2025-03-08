<script lang="ts">
  let {
    thisBind = $bindable(),
    name,
    points,
    bonusPoints,
  }: { thisBind?: any; name: string; points?: number; bonusPoints?: number } = $props();
</script>

<div class="shrink-0">
  <p>
    {bonusPoints ? `+ ${bonusPoints} Bonus Point${bonusPoints > 1 ? "s" : ""}` : ""}
  </p>
  <hr class="mb-1" />
  <div class="flex w-28 gap-3" bind:this={thisBind}>
    <div class="text-right">
      <p>{name}</p>
      <p class="font-bold">
        {points ? points : 0}
      </p>
    </div>
    <!--Point bar-->
    <div class="w-5 shrink-0 rounded-t-md bg-red-500" style="height: 48px;"></div>
  </div>
</div>
