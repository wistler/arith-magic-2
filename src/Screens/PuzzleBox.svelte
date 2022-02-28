<script lang="ts">
  import BoardTile from "../Components/BoardTile.svelte";
  import { activeSelection, gameState } from "../store/game";
  import { OperatorIcons } from "../assets/images";
</script>

<puzzleBox>
  <div>
    <BoardTile>
      {$activeSelection[0] || "?"}
    </BoardTile>
  </div>

  <img
    src={OperatorIcons[$gameState.operators[0]][
      $activeSelection.length >= 1 ? "active" : "grey"
    ]}
    alt={$gameState.operators[0]}
  />

  <BoardTile>
    {$activeSelection[1] || "?"}
  </BoardTile>

  <img
    src={OperatorIcons[$gameState.operators[1]][
      $activeSelection.length >= 2 ? "active" : "grey"
    ]}
    alt={$gameState.operators[1]}
  />

  <BoardTile>
    {$activeSelection[2] || "?"}
  </BoardTile>

  <img
    src={OperatorIcons["="][$activeSelection.length >= 3 ? "active" : "grey"]}
    alt="="
  />

  <BoardTile hilite="target">
    {$gameState.targets[0]}
  </BoardTile>
</puzzleBox>

<style>
  puzzleBox {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    padding: 0.25em;

    width: 80%;
    contain: content;
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
