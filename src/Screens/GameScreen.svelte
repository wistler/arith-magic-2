<script lang="ts">
  import BoardTile from "../Components/BoardTile.svelte";
  import Screen from "../Components/Screen.svelte";
  import { gameState } from "../store/game";

  $: rowCount = $gameState.board.length;
  $: colCount = rowCount == 0 ? 0 : $gameState.board[0].length;

  let isDragging = false;

  function handleMouseMove(event: MouseEvent) {
    if (isDragging) {
      const dataset = (event.target as HTMLElement).parentElement.dataset;
      const { row, col } = dataset;
      if (row !== undefined && col !== undefined) {
        console.debug({ row, col });
        // TODO: implement logic to handle selection into global store
        switch ($gameState.board[+row][+col].hilite) {
          case "normal":
          case "hint":
            $gameState.board[+row][+col].hilite = "selected";
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
        switch ($gameState.board[i][j].hilite) {
          case "selected":
            $gameState.board[i][j].hilite = "normal";
            break;
        }
      }
    }
  }
</script>

<Screen let:back {...$$restProps}>
  <board
    on:mouseleave={handleMouseUp}
    on:mousedown={() => (isDragging = true)}
    on:mouseup={handleMouseUp}
    on:mousemove|capture|stopPropagation={handleMouseMove}
    on:click|capture|stopPropagation={() => {
      console.debug("board captured click..");
    }}
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
    grid-template-rows: repeat(var(--rows), 2em);
    grid-template-columns: repeat(var(--cols), 2em);
    gap: 0.2em;
  }
  /* board > :global(button) {
    margin: 0.1em;
  } */
</style>
