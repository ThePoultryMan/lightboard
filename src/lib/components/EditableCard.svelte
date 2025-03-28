<script lang="ts">
  import Icon from "@iconify/svelte";
  import { type Snippet } from "svelte";
  import AdminButton from "./AdminButton.svelte";

  let {
    children,
    class: className,
    title = $bindable(),
    titleName,
    titleEditable = false,
    update = $bindable(),
  }: {
    children?: Snippet;
    class?: string;
    title?: string;
    titleName?: string;
    titleEditable?: boolean;
    update?: any;
  } = $props();
  let div: Element | undefined;

  let readOnly = $state(true);
  let editableInputs: HTMLInputElement[] = $derived.by(() => {
    const ignored = update;
    const inputs: HTMLInputElement[] = [];
    div?.querySelectorAll(":scope input").forEach((element) => {
      inputs.push(element as HTMLInputElement);
    });
    return inputs;
  });
  let editableSelects: HTMLSelectElement[] = $derived.by(() => {
    const ignored = update;
    const selects: HTMLSelectElement[] = [];
    div?.querySelectorAll(":scope select").forEach((element) => {
      selects.push(element as HTMLSelectElement);
    });
    return selects;
  });

  $effect(() => {
    editableInputs.forEach((element) => {
      let isTitle = title && element.id === "displayName" + title.replaceAll(" ", "");
      if (isTitle) {
        element.readOnly = titleEditable ? readOnly : true;
      } else {
        element.readOnly = readOnly;
      }
    });
    editableSelects.forEach((element) => {
      element.disabled = readOnly;
    });
  });
</script>

<div class={"relative" + (className ? " " + className : "")} bind:this={div}>
  {#if title}
    <div>
      {#if !readOnly && titleEditable}
        <label for={"displayName" + title.replaceAll(" ", "")}>{titleName}: </label>
      {/if}
      <input
        type="text"
        id={"displayName" + title.replaceAll(" ", "")}
        class="editable-input"
        readonly
        bind:value={title}
      />
    </div>
  {/if}
  {#if children}
    {@render children()}
  {/if}
  <AdminButton
    type={readOnly ? "edit" : "confirm"}
    onclick={() => (readOnly = !readOnly)}
    class="absolute bottom-0 right-0"
  />
</div>
