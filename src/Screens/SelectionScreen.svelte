<script lang="ts" context="module">
  export const SELECTION_SCREEN = "SelectionScreen";
</script>

<script lang="ts">
  import GameSelectionRow from "../Components/GameSelectionRow.svelte";

  import Screen from "../Components/Screen.svelte";
  import WhiteButton from "../Components/WhiteButton.svelte";
  import { newGame } from "../store/game";
  import { getListing } from "../store/profile";

  let listing = getListing();
</script>

<!-- TODO: Re-imaging layout for tablet setups -->
<!-- TODO: Re-imaging layout for PC/keyboard/mouse setups -->
<Screen let:navigateTo let:back {...$$restProps}>
  <list-box>
    <list>
      {#each listing as { operators, levelUnlocked }}
        <GameSelectionRow
          {operators}
          {levelUnlocked}
          on:startGame={({ detail: { level } }) => {
            newGame(operators, level);
            navigateTo("GameScreen");
          }}
        />
      {/each}
    </list>
  </list-box>
  <div>
    <WhiteButton on:click={back}>Back</WhiteButton>
  </div>
</Screen>

<style>
  list-box {
    flex: 1;
    height: 100%;
    overflow: hidden;

    /* TODO width 100% works for portrait, not for landscape */
    width: 100%;
    /* max-width: 20em; */
  }
  list {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    scroll-behavior: smooth;

    /* TODO: Hide scrollbar in Desktop Mode */
    /* box-sizing: content-box;
    margin-right: -25px;
    margin-left: 7px;
    padding-right: 25px; */
  }
</style>
