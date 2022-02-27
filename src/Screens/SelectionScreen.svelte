<script lang="ts" context="module">
  export const SELECTION_SCREEN = "SelectionScreen";
</script>

<script lang="ts">
  import Images, { OperatorIcons } from "../assets/images";
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
        <row>
          <operators>
            {#each operators as op}
              <img
                src={OperatorIcons[op][levelUnlocked > 0 ? "active" : "grey"]}
                alt={op}
              />
            {/each}
          </operators>
          <WhiteButton disabled={levelUnlocked <= 1}>
            <img src={Images.grid} alt="grid" style="width: 1em" />
          </WhiteButton>
          <WhiteButton
            disabled={levelUnlocked == 0}
            on:click={() => {
              newGame(operators, levelUnlocked);
              navigateTo("GameScreen");
            }}
          >
            Lv {levelUnlocked} >
          </WhiteButton>
        </row>
      {/each}
    </list>
  </list-box>
  <div>
    <!-- <WhiteButton on:click={() => navigateTo("GameScreen")}>Start</WhiteButton> -->
    <WhiteButton on:click={back}>Back</WhiteButton>
  </div>
</Screen>

<style>
  /* * {
    margin: 0.25em;
    padding: 0.25em;
  } */
  list-box {
    flex: 1;
    height: 100%;
    /* max-width: 17em; */
    /* min-width: 13em; */
    overflow: hidden;
    /* padding-left: 20px; */
  }
  list {
    font-size: 0.8em;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    /* max-height: 60%; */
    overflow-y: scroll;
    scroll-behavior: smooth;
    /* TODO: Hide scrollbar in Desktop Mode */
    box-sizing: content-box;
    padding-right: 50px;
  }
  row {
    margin: 0.3em;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 0.5em;
  }
  operators {
    /* margin: 0.4em; */

    /* background-color: rgba(0, 0, 0, 0.3); */
    padding: 0.3em 0em 0em 0.2em;
    border-radius: 0.4em;
    text-align: center;
  }
  operators img {
    width: 2em;
  }
</style>
