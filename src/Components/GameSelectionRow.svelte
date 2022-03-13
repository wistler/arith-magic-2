<script lang="ts" context="module">
  export const SELECTION_SCREEN = "SelectionScreen";

  export const drawerOpen = writable(undefined);
</script>

<script lang="ts">
  import _ from "lodash";
  import { writable } from "svelte/store";
  import { createEventDispatcher } from "svelte";

  import type { Operators } from "../lib/game";
  import { OperatorIcons } from "../assets/Images";
  import WhiteButton from "./WhiteButton.svelte";
  import TileBoard from "./TileBoard.svelte";
  import Tile from "./Tile.svelte";
  import {
    EnterArrowIcon,
    GridAltIcon,
    GridIcon,
    HackIcon,
  } from "../lib/icons";
  import { IS_DEV } from "../lib/dev";
  import { unlockLevel } from "../store/profile";

  export let operators: Operators[];
  export let levelUnlocked: number;

  let me: HTMLElement;

  const dispatcher = createEventDispatcher();
</script>

<drawer
  bind:this={me}
  class:disabled={levelUnlocked <= 1}
  class:expanded={$drawerOpen === me}
>
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
        flat
        disabled={levelUnlocked <= 1}
        on:click={() => {
          if ($drawerOpen === me) {
            $drawerOpen = undefined;
          } else {
            $drawerOpen = me;
          }
        }}
      >
        {#if $drawerOpen === me}
          <GridAltIcon style="margin-bottom: -0.2em;" />
        {:else}
          <GridIcon style="margin-bottom: -0.2em;" />
        {/if}
      </WhiteButton>
    </div>
    <div>
      {#if IS_DEV}
        <WhiteButton
          tight
          flat
          on:click={() => {
            unlockLevel(operators, levelUnlocked + 1);
          }}
          ><HackIcon
            style="margin-bottom:-0.2em; font-size: medium; color: red;"
          /></WhiteButton
        >
      {/if}

      <WhiteButton
        flat
        disabled={levelUnlocked == 0}
        on:click={() => {
          dispatcher("startGame", { level: levelUnlocked });
        }}
      >
        Lv {levelUnlocked}
        <EnterArrowIcon style="margin-bottom: -0.2em;" />
      </WhiteButton>
    </div>
  </row>

  <TileBoard rowCount={levelUnlocked / 5} colCount={Math.min(levelUnlocked, 5)}>
    {#each _.range(1, levelUnlocked + 1) as level, i}
      <div on:click={() => dispatcher("startGame", { level })}>
        <Tile outlined>
          {level}
        </Tile>
      </div>
    {/each}
  </TileBoard>
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
    max-height: 2.5em;
    transition: max-height 0.25s ease-out;
    overflow: hidden;
    flex-shrink: 0;
  }
  drawer.expanded {
    max-height: 25em;
    transition: max-height 0.25s ease-out;
    /* overflow: hidden; */
  }
  drawer.disabled {
    opacity: 50%;
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

  @media (prefers-color-scheme: dark) {
    drawer {
      background-color: rgba(255, 255, 255, 0.2);
    }
    operators img {
      filter: brightness(60%) contrast(200%);
    }
  }
</style>
