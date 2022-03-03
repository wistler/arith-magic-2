<script lang="ts">
  import { writable } from "svelte/store";
  import { ConfettiExplosion } from "svelte-confetti-explosion";
  import Tile from "./Tile.svelte";
  import {
    activeSelection,
    gameState,
    isSelectionCorrect,
    selectionMade,
    target,
    TileHiliteType,
    validateSelection,
  } from "../store/game";
  import { OperatorIcons } from "../assets/Images";

  $: ({ operators } = $gameState);

  let complete = false;
  let correct = false;

  $: ({ correct } = $isSelectionCorrect);

  const showConfetti = writable(false);

  function calcHilite(value: number, correct: boolean): TileHiliteType {
    return value === undefined ? "normal" : correct ? "target" : "selected";
  }

  let afterAnimation: () => void;
  $: {
    const sm = $selectionMade;
    if (sm) {
      ({ complete, correct, afterAnimation } = validateSelection());
      console.debug({ sm, complete, correct, afterAnimation });
      if (complete) {
        if (correct) {
          $showConfetti = true;
          setTimeout(() => {
            $showConfetti = false;
            afterAnimation();
          }, 3000);
        } else {
          setTimeout(() => {
            afterAnimation();
          }, 1000);
        }
      }
    }
  }

  /**
   * Note: dependencies should not get burried within the fn.
   */
  $: hilite_1 = calcHilite($activeSelection[0], correct);
  $: hilite_2 = calcHilite($activeSelection[1], correct);
  $: hilite_3 = calcHilite($activeSelection[2], correct);
</script>

{#if $showConfetti}
  <ConfettiExplosion duration={4000} />
{/if}
<puzzleBox>
  <div>
    <Tile hilite={hilite_1}>
      {$activeSelection[0] || "?"}
    </Tile>
  </div>

  <img
    src={OperatorIcons[operators[0]][
      // $activeSelection.length >= 1 ? "active" : "grey"
      "active"
    ]}
    alt={operators[0]}
  />

  <Tile hilite={hilite_2}>
    {$activeSelection[1] || "?"}
  </Tile>

  <img
    src={OperatorIcons[operators[1]][
      // $activeSelection.length >= 2 ? "active" : "grey"
      "active"
    ]}
    alt={operators[1]}
  />

  <Tile hilite={hilite_3}>
    {$activeSelection[2] || "?"}
  </Tile>

  <img
    src={OperatorIcons["="][$isSelectionCorrect ? "active" : "grey"]}
    alt="="
  />

  <Tile hilite="target">
    {$target}
  </Tile>
</puzzleBox>

<style>
  puzzleBox {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    padding: 0.25em;

    width: 80%;
    /* contain: content; */
    max-height: 3em;

    min-width: 12em;
    max-width: 25em;
    width: 92vw;

    justify-content: space-evenly;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 0.4em;
  }

  puzzleBox > :global(*) {
    height: 2.5em;
    width: 2.5em;
    aspect-ratio: 1;
  }

  puzzleBox > img {
    aspect-ratio: 1;
    height: 1.7em;
    width: 1.7em;
  }
</style>
