<script lang="ts">
  export let rowCount: number;
  export let colCount: number;
</script>

<board
  on:pointerleave
  on:pointerdown
  on:pointerup
  on:pointermove
  style="--rows: {rowCount}; --cols: {colCount};"
>
  <slot />
</board>

<style>
  board {
    margin: 0.25em;
    padding: 0.25em;
    min-width: 12em;
    max-width: 25em;
    width: 60vw;
  }
  board {
    display: grid;
    /* grid-template-rows: repeat(var(--rows), minmax(auto, 2em)); */
    grid-template-columns: repeat(var(--cols), 1fr /*minmax(auto, 3em)*/);
    gap: 0.2em;
  }
  board > :global(div) {
    aspect-ratio: 1;
  }
</style>
