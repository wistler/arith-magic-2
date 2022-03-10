<script lang="ts">
  export let rowCount: number;
  export let colCount: number;

  // HACK: Yuck ! Sizing !! Almost like media queries !!!
  export let width = 95;
  $: minWidth = colCount <= 2 ? 5 : colCount <= 4 ? 8 : colCount <= 6 ? 11 : 12;
  $: maxWidth =
    colCount <= 2 ? 8 : colCount <= 4 ? 16 : colCount <= 6 ? 20 : 25;
</script>

<board
  style="--rows: {rowCount}; --cols: {colCount}; --width: {width}%; --min-width: {minWidth}em;--max-width: {maxWidth}em;"
>
  <slot />
</board>

<style>
  board {
    margin: 0.25em;
    padding: 0.25em;
    /* min-width: 12em; */
    min-width: var(--min-width);
    max-width: var(--max-width);
    width: var(--width);
  }
  board {
    display: grid;
    grid-template-columns: repeat(var(--cols), 1fr);
    gap: 0.3em;
  }
  board > :global(div) {
    aspect-ratio: 1;
  }
</style>
