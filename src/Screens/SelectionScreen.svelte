<script lang="ts" context="module">
  export const SELECTION_SCREEN = "SelectionScreen";
</script>

<script lang="ts">
  import { ExitSessionIcon } from "../lib/icons";
  import GameSelectionRow from "../Components/GameSelectionRow.svelte";

  import Screen from "../Components/Screen.svelte";
  import WhiteButton from "../Components/WhiteButton.svelte";
  import { newGame } from "../store/game";
  import { getListing, levels } from "../store/profile";
  import { onDestroy } from "svelte";

  let listing = getListing();
  const unsubscribe = levels.subscribe(() => {
    console.debug("Levels store changed, updating listing..");
    listing = getListing();
  });

  onDestroy(() => {
    unsubscribe();
  });
</script>

<!-- TODO: Re-imaging layout for tablet setups -->
<!-- TODO: Re-imaging layout for PC/keyboard/mouse setups -->
<Screen let:navigateTo let:back {...$$restProps}>
  <list-box>
    <list>
      {#each listing
        .slice()
        .sort( (a, b) => (a.levelUnlocked > 0 && b.levelUnlocked ? a.levelUnlocked - b.levelUnlocked : b.levelUnlocked - a.levelUnlocked) ) as { operators, levelUnlocked }}
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
  <footer>
    <WhiteButton on:click={back}><ExitSessionIcon /></WhiteButton>
  </footer>
</Screen>

<style>
  list-box {
    flex: 1;
    height: 100%;
    overflow: hidden;

    /* TODO width 100% works for portrait, not for landscape */
    width: 100%;
    max-width: 25em;
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
  footer {
    width: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0.25em;
  }
  footer > :global(*) {
    min-width: 5em;
  }
</style>
