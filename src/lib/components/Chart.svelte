<!-- This is effectively a wrapper around chart.js. -->
<!-- Registration is manual based on what I need. -->

<script lang="ts">
  import {
    Chart,
    type BubbleDataPoint,
    type ChartData,
    type ChartOptions,
    type ChartTypeRegistry,
    type Point,
  } from "chart.js/auto";
  import { onMount } from "svelte";

  type Props = {
    data: ChartData<
      keyof ChartTypeRegistry,
      (number | Point | [number, number] | BubbleDataPoint | null)[],
      unknown
    >;
    type: keyof ChartTypeRegistry;
    options?: ChartOptions;
    fontColor?: string;
    gridColor?: string;
  };

  const { data, type, options, fontColor, gridColor }: Props = $props();

  var canvas: HTMLCanvasElement | undefined = $state();
  const chart = $derived.by(() => {
    if (canvas) {
      const fixedOptions = options;

      if (fontColor) {
        // it doesn't matter to me to figure out a better way of setting the
        // color because it will always be the same.
        Chart.defaults.color = fontColor;
      }

      return new Chart(canvas, {
        type,
        data,
        options: fixedOptions,
      });
    }
  });

  $effect(() => {
    chart?.render();
  });

  onMount(() => {
    // change default font size to 14 because 12 is so tiny omg
    Chart.defaults.font.size = 14;
  });
</script>

<canvas bind:this={canvas}></canvas>
