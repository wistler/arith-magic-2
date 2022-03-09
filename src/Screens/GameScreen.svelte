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
  import selectionStrategy from "./SelectionStrategy";

  $: ({ board } = $gameState);
  $: rowCount = board.length;
  $: colCount = rowCount == 0 ? 0 : board[0].length;

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
  <tileBoardContainer
    use:selectionStrategy
    on:selectionInProgress={({ detail: { inProgress } }) => {
      $isSelectionInProgress = inProgress;
    }}
    on:selectTile={({ detail: { add } }) => {
      addToSelection(add);
    }}
    on:deselectTile={({ detail: { remove } }) => {
      removeFromSelection(remove);
    }}
  >
    <TileBoard {rowCount} {colCount}>
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
  </tileBoardContainer>
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
        }}
        ><HackIcon
          style="margin-bottom:-0.2em; color: red;"
        />EndGame</WhiteButton
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
  tileBoardContainer {
    height: 100vmin;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    /* background-color: rgba(0, 0, 0, 0.5); */
    border-radius: 0.4em;
    margin: 0.2em;
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
