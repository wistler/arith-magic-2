<script lang="ts">
  import {
    addToSelection,
    gameState,
    isGameOver,
    isSelectionCorrect,
    removeFromSelection,
    isSelectionInProgress,
  } from "../store/game";
  import PuzzleBox from "../Components/PuzzleBox.svelte";
  import TileBoard from "../Components/TileBoard.svelte";
  import Tile from "../Components/Tile.svelte";
  import Screen from "../Components/Screen.svelte";
  import WhiteButton from "../Components/WhiteButton.svelte";
  import { getActiveSelection } from "../lib/game";
  import Popup from "../Components/Popup.svelte";
  import { ConfettiExplosion } from "svelte-confetti-explosion";
  import { delay } from "../util/delay";
  import { onMount } from "svelte";
  import {
    EnterArrowIcon,
    ExitSessionIcon,
    HackIcon,
    PauseIcon,
  } from "../lib/icons";
  import { IS_DEV } from "../lib/dev";

  $: ({ board } = $gameState);
  $: rowCount = board.length;
  $: colCount = rowCount == 0 ? 0 : board[0].length;

  function handlePointerMove(event: PointerEvent) {
    if (!$isSelectionInProgress || $isSelectionCorrect.complete) {
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
    $isSelectionInProgress = false;
  }

  // local component ui states
  let showConfetti = false;
  let showGameOverPopup = false;
  // let showPauseMenuPopup = false;
  let mounted = false;
  let isPaused = false;

  async function animateGameOver() {
    if (!mounted) {
      // console.debug("Skipping animation before onMount.");
      return;
    }
    // console.debug("animating GameOver!");
    await delay(1000);
    showConfetti = true;
    await delay(1500);
    showGameOverPopup = true;
    await delay(500);
    showConfetti = false;
  }
  $: {
    // console.debug("reactive scope tripped ..");
    if ($isGameOver) {
      animateGameOver();
    }
  }
  onMount(() => {
    if ($isGameOver) {
      showGameOverPopup = true;
    }
    mounted = true;
  });
</script>

<Screen let:back {...$$restProps}>
  <spacer />
  <!-- <targetArea>
    <Tile hilite="target">
      {$gameState.targets[0]}
    </Tile>
  </targetArea> -->
  {#if showConfetti}
    <ConfettiExplosion duration={4000} />
  {/if}
  <PuzzleBox />
  <spacer />
  <TileBoard
    on:pointerdown={() => {
      $isSelectionInProgress = true;
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
  <spacer />
  <footer>
    <WhiteButton on:click={() => (isPaused = true)}>
      <PauseIcon style="margin-bottom:-0.2em;" /> Pause
    </WhiteButton>
    {#if IS_DEV}
      <WhiteButton
        on:click={() => {
          $gameState = {
            ...$gameState,
            solved: $gameState.targets,
          };
        }}><HackIcon style="margin-bottom:-0.2em;" />EndGame</WhiteButton
      >
    {/if}
  </footer>
  {#if isPaused}
    <Popup>
      <h1>Pause Menu</h1>
      <WhiteButton on:click={() => (isPaused = false)}>
        <EnterArrowIcon style="margin-bottom:-0.2em;" /> Resume
      </WhiteButton>
      <WhiteButton on:click={back}>
        <ExitSessionIcon style="margin-bottom:-0.2em;" /> Abandon
      </WhiteButton>
    </Popup>
  {/if}
  {#if showGameOverPopup}
    <Popup>
      <h1>Puzzle Complete</h1>
      <WhiteButton on:click={back}><ExitSessionIcon /> Done</WhiteButton>
    </Popup>
  {/if}
</Screen>

<style>
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
