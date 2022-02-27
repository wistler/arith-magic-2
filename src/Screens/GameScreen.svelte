<script lang="ts">
  import { Coord, getNextSelectionIndex } from "../lib/game";

  import BoardTile from "../Components/BoardTile.svelte";
  import Screen from "../Components/Screen.svelte";
  import { gameState } from "../store/game";

  $: rowCount = $gameState.board.length;
  $: colCount = rowCount == 0 ? 0 : $gameState.board[0].length;

  let isDragging = false;

  function handleMouseMove(event: PointerEvent) {
    if (isDragging) {
      const target = document.elementFromPoint(event.clientX, event.clientY);
      // console.debug({ pointermove: event, target });
      const dataset = (target as HTMLElement).parentElement.dataset;
      const { row, col } = dataset;
      if (row !== undefined && col !== undefined) {
        // console.debug({ row, col });

        const next: Coord = { row: +row, col: +col };
        if ($gameState.board[+row][+col].selectionIndex >= 0) {
          return;
        }

        const nextSelectionIndex = getNextSelectionIndex(
          $gameState,
          next,
          "linear"
        );
        if (nextSelectionIndex === -1) return;

        // TODO: implement logic to handle selection into global store
        switch ($gameState.board[+row][+col].hilite) {
          case "normal":
          case "hint":
            $gameState.board[+row][+col] = {
              ...$gameState.board[+row][+col],
              hilite: "selected",
              selectionIndex: nextSelectionIndex,
            };
            break;
        }
      }
    }
  }
  function handleMouseUp() {
    isDragging = false;

    for (let i = 0; i < $gameState.board.length; i++) {
      const row = $gameState.board[i];
      for (let j = 0; j < row.length; j++) {
        if ($gameState.board[i][j].selectionIndex >= 0) {
          $gameState.board[i][j] = {
            ...$gameState.board[i][j],
            selectionIndex: -1,
            hilite: "normal",
          };
        }
      }
    }
  }
</script>

<Screen let:back {...$$restProps}>
  <board
    on:pointerleave={handleMouseUp}
    on:pointerdown={() => (isDragging = true)}
    on:pointerup={handleMouseUp}
    on:pointermove={handleMouseMove}
    style="--rows: {rowCount}; --cols: {colCount};"
  >
    {#each $gameState.board as row, i}
      {#each row as tile, j}
        <div data-row={i} data-col={j}>
          <BoardTile hilite={tile.hilite}>{tile.label}</BoardTile>
        </div>
      {/each}
    {/each}
  </board>
  <button on:click={back}>Back</button>
</Screen>

<style>
  button,
  board {
    margin: 0.25em;
    padding: 0.25em;
  }
  board {
    display: grid;
    /* grid-template-rows: repeat(var(--rows), minmax(auto, 2em)); */
    grid-template-columns: repeat(var(--cols), minmax(auto, 3em));
    gap: 0.2em;
  }
  board > div {
    aspect-ratio: 1;
  }
  /* board > :global(button) {
    margin: 0.1em;
  } */
</style>
