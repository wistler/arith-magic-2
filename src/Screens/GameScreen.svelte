<script lang="ts">
  import TileBoard from "../Components/TileBoard.svelte";
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
            $gameState.board[+row][+col].selectionIndex = nextSelectionIndex;
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
          $gameState.board[i][j].selectionIndex = -1;
        }
      }
    }
  }
</script>

<Screen let:back {...$$restProps}>
  <TileBoard
    on:pointerleave={handleMouseUp}
    on:pointerdown={() => (isDragging = true)}
    on:pointerup={handleMouseUp}
    on:pointermove={handleMouseMove}
    {rowCount}
    {colCount}
  >
    {#each $gameState.board as row, i}
      {#each row as tile, j}
        <div data-row={i} data-col={j}>
          <BoardTile
            hilite={tile.selectionIndex >= 0 ? "selected" : tile.hilite}
            >{tile.label}</BoardTile
          >
        </div>
      {/each}
    {/each}
  </TileBoard>
  <button on:click={back}>Back</button>
</Screen>

<style>
  button {
    margin: 0.25em;
    padding: 0.25em;
  }
</style>
