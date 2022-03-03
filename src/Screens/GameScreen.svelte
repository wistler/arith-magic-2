<script lang="ts">
  import {
    addToSelection,
    gameState,
    isSelectionCorrect,
    removeFromSelection,
    selectionMade,
    validateSelection,
  } from "../store/game";
  import PuzzleBox from "../Components/PuzzleBox.svelte";
  import TileBoard from "../Components/TileBoard.svelte";
  import Tile from "../Components/Tile.svelte";
  import Screen from "../Components/Screen.svelte";
  import WhiteButton from "../Components/WhiteButton.svelte";
  import { getActiveSelection } from "../lib/game";

  $: ({ board } = $gameState);
  $: rowCount = board.length;
  $: colCount = rowCount == 0 ? 0 : board[0].length;

  let isDragging = false;

  function handlePointerMove(event: PointerEvent) {
    if (!isDragging || $isSelectionCorrect.complete) {
      return;
    }

    const target = document.elementFromPoint(event.clientX, event.clientY);
    // TODO only process target if we swype through the center

    // console.debug({ pointermove: event, target });
    const dataset = (target as HTMLElement).parentElement.dataset;
    const { row, col } = dataset;
    if (row !== undefined && col !== undefined) {
      if (board[row][col].selectionIndex == -1) {
        addToSelection({ row: +row, col: +col });
      } else {
        let irow = +row;
        let icol = +col;

        const chain = getActiveSelection(board);
        if (chain.length < 2) return;

        const lastButOne = chain.at(-2);
        const last = chain.at(-1);

        // console.debug({ row, col, lastButOne, last });
        if (lastButOne.row === irow && lastButOne.col === icol) {
          removeFromSelection({ ...last });
        }
      }
    }
  }

  function handlePointerUp() {
    if (isDragging && !$selectionMade) {
      isDragging = false;
      $selectionMade = true;
    }
  }
</script>

<Screen let:back {...$$restProps}>
  <spacer />
  <!-- <targetArea>
    <Tile hilite="target">
      {$gameState.targets[0]}
    </Tile>
  </targetArea> -->
  <PuzzleBox />
  <board>
    <TileBoard
      on:pointerdown={() => {
        if ($selectionMade === false) {
          isDragging = true;
        }
      }}
      on:pointermove={handlePointerMove}
      on:pointerup={handlePointerUp}
      on:pointerleave={handlePointerUp}
      {rowCount}
      {colCount}
    >
      {#each board as row, i}
        {#each row as tile, j}
          <div data-row={i} data-col={j}>
            <Tile
              hilite={tile.selectionIndex == -1
                ? tile.hilite
                : $isSelectionCorrect.complete === false
                ? "selected"
                : $isSelectionCorrect.correct
                ? "target"
                : "incorrect"}
            >
              {tile.label}
            </Tile>
          </div>
        {/each}
      {/each}
    </TileBoard>
  </board>
  <spacer />
  <footer>
    <WhiteButton on:click={back}>Exit</WhiteButton>
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
