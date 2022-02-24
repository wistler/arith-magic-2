<script lang="ts">
  import { getContext } from "svelte";
  import { fly, fade } from "svelte/transition";
  import type { ScreenProps } from "./@types/Screen";
  import {
    ScreenStackNavigatorCxt,
    STACK_NAVIGATOR_CXT_KEY,
  } from "./@types/ScreenStackNavigator";

  const navigatorCxt = getContext(
    STACK_NAVIGATOR_CXT_KEY
  ) as ScreenStackNavigatorCxt;

  export let props: ScreenProps = {};
  let style = "";
  if (props.bgImageURL) {
    style += `background-image: url(${props.bgImageURL});`;
  }
</script>

<!--
  Blanket is used for shadowing underlying screen as this screen transitions in/out.
  Blanket will be fully hidden by screen after transition complete.
 -->
<blanket in:fade out:fade={{ delay: 250, duration: 400 }}>
  <screen
    {style}
    in:fly={{ y: 50, delay: 250, duration: 200 }}
    out:fly={{ y: 50, delay: 0 }}
  >
    <slot {...navigatorCxt} />
  </screen>
</blanket>

<style>
  blanket {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.8);

    user-select: none;
    height: 100%;
    width: 100%;
    overflow: hidden;

    text-align: center;
    margin: 0 auto;

    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 100%;
    align-items: center;
    justify-content: space-between;
  }

  screen {
    background-color: white;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
