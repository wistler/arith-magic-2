<script lang="ts">
  export let rowCount: number;
  export let colCount: number;

  $: width = rowCount <= 4 ? 60 : rowCount <= 6 ? 80 : 92;
</script>

<board
  on:pointerleave
  on:pointerdown
  on:pointerup
  on:pointermove
  style="--rows: {rowCount}; --cols: {colCount}; --width: {width}vw;"
>
  <slot />
</board>

<style>
  board {
    margin: 0.25em;
    padding: 0.25em;
    min-width: 12em;
    max-width: 25em;
    width: var(--width);
  }
  board {
    display: grid;
    grid-template-columns: repeat(var(--cols), 1fr);
    gap: 0.2em;
  }
  board > :global(div) {
    aspect-ratio: 1;
  }
</style>
