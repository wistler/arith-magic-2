<script lang="ts" context="module">
  export const SELECTION_SCREEN = "SelectionScreen";

  export const drawerOpen = writable(undefined);
</script>

<script lang="ts">
  import _ from "lodash";
  import { writable } from "svelte/store";
  import { createEventDispatcher } from "svelte";

  import type { Operators } from "../lib/game";
  import Images, { OperatorIcons } from "../assets/images";
  import WhiteButton from "./WhiteButton.svelte";
  import TileBoard from "./TileBoard.svelte";
  import Tile from "./Tile.svelte";

  export let operators: Operators[];
  export let levelUnlocked: number;

  let me: HTMLElement;

  const dispatcher = createEventDispatcher();
</script>

<drawer bind:this={me}>
  <row>
    <operators>
      {#each operators as op}
        <img
          src={OperatorIcons[op][levelUnlocked > 0 ? "active" : "grey"]}
          alt={op}
        />
      {/each}
    </operators>
    <div>
      <WhiteButton
        disabled={levelUnlocked <= 1}
        on:click={() => {
          if ($drawerOpen === me) {
            $drawerOpen = undefined;
          } else {
            $drawerOpen = me;
          }
        }}
      >
        <img src={Images.grid} alt="grid" style="width: 1em" />
      </WhiteButton>
    </div>
    <div>
      <WhiteButton
        disabled={levelUnlocked == 0}
        on:click={() => {
          dispatcher("startGame", { level: levelUnlocked });
        }}
      >
        Lv {levelUnlocked} >
      </WhiteButton>
    </div>
  </row>
  {#if $drawerOpen === me}
    <TileBoard rowCount={levelUnlocked / 5} colCount={5}>
      {#each _.range(1, levelUnlocked + 1) as level}
        <div on:click={() => dispatcher("startGame", { level })}>
          <Tile>
            {level}
          </Tile>
        </div>
      {/each}
    </TileBoard>
  {/if}
</drawer>

<style>
  row {
    display: grid;
    width: 100%;
    grid-template-columns: auto auto auto;
    align-items: center;
    justify-content: space-between;
  }
  drawer {
    background-color: rgba(255, 255, 255, 0.5);
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);

    border-radius: 0.5em;
    margin: 0.3em;

    display: flex;
    flex-direction: column;
    align-items: center;
    /* width: 100%; */
    /* margin-right: -0.3em; */
    padding: 0;
  }
  operators {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-left: 0.25em;
    text-align: left;
  }
  operators img {
    width: 2em;
  }
</style>
