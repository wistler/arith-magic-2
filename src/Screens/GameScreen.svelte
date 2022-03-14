<script lang="ts">
  import {
    addToSelection,
    gameState,
    isGameOver,
    isSelectionCorrect,
    removeFromSelection,
    isSelectionInProgress,
    DEV_HACKS,
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
    CheckMarkIcon,
    EnterArrowIcon,
    ExitSessionIcon,
    HackIcon,
    PauseIcon,
    PerfectIcon,
    WaypointIcon,
  } from "../lib/icons";
  import { IS_DEV } from "../lib/dev";
  import selectionStrategy from "./SelectionStrategy";
  import ProgressWay from "../Components/ProgressWay.svelte";

  $: ({ board, targets, solved, errors } = $gameState);
  $: rowCount = board.length;
  $: colCount = rowCount == 0 ? 0 : board[0].length;

  $: steps = targets.map((t, i) =>
    i < solved.length
      ? {
          icon: errors[i] === true ? CheckMarkIcon : PerfectIcon,
        }
      : {
          icon: WaypointIcon,
        }
  );

  $: {
    console.log({ targets, solved, current: solved.length });
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
  <!-- <targetArea>
    <Tile hilite="target">
      {$gameState.targets[0]}
    </Tile>
  </targetArea> -->
  <stepsDiv>
    <ProgressWay {steps} current={solved.length} />
    {#if IS_DEV}
      <WhiteButton
        tight
        flat
        on:click={() => {
          DEV_HACKS.targetSolved();
        }}
      >
        <HackIcon style="margin-bottom:-0.2em; color: red;" />
      </WhiteButton>
    {/if}
  </stepsDiv>
  {#if showConfetti}
    <ConfettiExplosion duration={4000} />
  {/if}
  <puzzleBoxDiv>
    <PuzzleBox />
  </puzzleBoxDiv>
  <instruction>{selectionStrategy.instruction}</instruction>
  <tileBoardContainer
    use:selectionStrategy.strategy
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
          <tileDiv data-row={i} data-col={j}>
            <Tile
              negative={+tile.label < 0}
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
          </tileDiv>
        {/each}
      {/each}
    </TileBoard>
  </tileBoardContainer>
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
            errors: $gameState.targets.map(() => false),
          };
        }}
      >
        <HackIcon style="margin-bottom:-0.2em; color: red;" />
      </WhiteButton>
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
  stepsDiv {
    padding-top: 0.2em;
    display: flex;
    flex-direction: row;
    width: 80%;
  }
  tileBoardContainer {
    flex: 1;
    aspect-ratio: 1;
    max-width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.4em;
    margin: 0.2em;
    display: flex;
    flex-direction: column;

    display: flex;
    flex-direction: row;
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
