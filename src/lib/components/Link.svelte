<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    children,
    href,
    class: className,
    target,
  }: { children: Snippet; href: string; class?: string; target?: string } = $props();
</script>

<a
  {href}
  class={className}
  rel={"noopener" + (target === "_blank" ? " noreferrer" : "")}
  target={target ? target : undefined}
>
  {@render children()}
</a>
