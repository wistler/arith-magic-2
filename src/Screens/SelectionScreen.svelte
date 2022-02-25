<script lang="ts" context="module">
  export const SELECTION_SCREEN = "SelectionScreen";
</script>

<script lang="ts">
  import Screen from "../Components/Screen.svelte";
  import WhiteButton from "../Components/WhiteButton.svelte";

  import operatorPlus from "../assets/Images/operator-plus.png";
  import operatorPlusGrey from "../assets/Images/operator-plus-grey.png";
  import operatorMinus from "../assets/Images/operator-minus.png";
  import operatorMinusGrey from "../assets/Images/operator-minus-grey.png";
  import grid from "../assets/Images/grid.png";

  const operatorIcons = {
    "+": { active: operatorPlus, grey: operatorPlusGrey },
    "-": { active: operatorMinus, grey: operatorMinusGrey },
  };

  let listing = [
    {
      operators: ["+", "+"],
      levelUnlocked: 2,
    },
    {
      operators: ["+", "-"],
      levelUnlocked: 1,
    },
    {
      operators: ["-", "-"],
      levelUnlocked: 0,
    },
    {
      operators: ["-", "+"],
      levelUnlocked: 0,
    },
    {
      operators: ["-", "+"],
      levelUnlocked: 0,
    },
    {
      operators: ["-", "+"],
      levelUnlocked: 0,
    },
  ];
</script>

<Screen let:navigateTo let:back {...$$restProps}>
  <list>
    {#each listing as { operators, levelUnlocked }}
      <row>
        <operators>
          {#each operators as op}
            <img
              src={operatorIcons[op][levelUnlocked > 0 ? "active" : "grey"]}
              alt={op}
            />
          {/each}
        </operators>
        <WhiteButton>
          <img src={grid} alt="grid" style="width: 1em" />
        </WhiteButton>
        <WhiteButton>Lv {levelUnlocked} ></WhiteButton>
      </row>
    {/each}
  </list>
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
  list {
    font-size: 0.8em;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 20em;
    overflow-y: scroll;
    scroll-behavior: smooth;
    /* TODO: Hide scrollbar in Desktop Mode */
    box-sizing: content-box;
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
