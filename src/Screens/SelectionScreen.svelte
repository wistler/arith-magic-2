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
  }
  list {
    font-size: 0.8em;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    scroll-behavior: smooth;
    /* TODO: Hide scrollbar in Desktop Mode */
    box-sizing: content-box;
    padding-right: 50px;
  }
</style>
