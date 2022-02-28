<script lang="ts">
  import PuzzleBox from "./PuzzleBox.svelte";

  import TileBoard from "../Components/TileBoard.svelte";
  import { Coord, getNextSelectionIndex } from "../lib/game";
  import BoardTile from "../Components/BoardTile.svelte";
  import Screen from "../Components/Screen.svelte";
  import { activeSelection, gameState } from "../store/game";
  import WhiteButton from "../Components/WhiteButton.svelte";

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

        switch ($gameState.board[+row][+col].hilite) {
          case "normal":
          case "hint":
            $gameState.board[+row][+col].selectionIndex = nextSelectionIndex;
            $activeSelection = [
              ...$activeSelection,
              +$gameState.board[+row][+col].label,
            ];
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
    $activeSelection = [];
  }
</script>

<Screen let:back {...$$restProps}>
  <spacer />
  <!-- <targetArea>
    <BoardTile hilite="target">
      {$gameState.targets[0]}
    </BoardTile>
  </targetArea> -->
  <PuzzleBox />
  <board>
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
            >
              {tile.label}
            </BoardTile>
          </div>
        {/each}
      {/each}
    </TileBoard>
  </board>
  <spacer />
  <footer>
    <WhiteButton on:click={back}>Back</WhiteButton>
  </footer>
</Screen>

<style>
  board {
    margin-top: 1em;
  }
  spacer {
    flex-grow: 1;
  }
  footer {
    width: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0.25em;
  }
</style>
