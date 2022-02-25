<script lang="ts">
  import { getContext, onDestroy, onMount } from "svelte";
  import { fly, fade } from "svelte/transition";
  import type { ScreenProps } from "./@types/Screen";
  import {
    ScreenStackNavigatorCxt,
    STACK_NAVIGATOR_CXT_KEY,
  } from "./@types/ScreenStackNavigator";

  export let props: ScreenProps = {};
  export let screenKey: string = undefined;
  // export let screenIndex: number = undefined;
  export let onTop: boolean = undefined;

  const navigatorCxt = getContext(
    STACK_NAVIGATOR_CXT_KEY
  ) as ScreenStackNavigatorCxt;

  let style = "";
  if (props.bgImageURL) {
    style += `background-image: url(${props.bgImageURL});`;
  }

  let blanketStyle = "";
  if (props.blanketImageURL) {
    blanketStyle += `background-image: url(${props.blanketImageURL});`;
    style += `background-color: rgba(0, 0, 0, 0); `;
  }

  // $: {
  //   blanketStyle += `opacity: ${onTop ? 1 : 0};`;
  // }

  let screen: HTMLElement;

  $: {
    if (onTop) {
      prepareToUnhide();
    } else {
      hidden();
    }
  }

  function prepareToUnhide() {
    // resume any animations
    console.debug(`${screenKey} prepareToUnhide..`);
    console.debug(`${screenKey} resuming animations..`);
    screen
      ?.querySelectorAll("[data-animation]")
      .forEach((e: HTMLElement) => (e.style.animationPlayState = "running"));
  }

  function hidden() {
    // pause any animations
    console.debug(`${screenKey} hidden..`);
    screen
      .querySelectorAll("[data-animation]")
      .forEach((e: HTMLElement) => (e.style.animationPlayState = "paused"));
    console.debug(`${screenKey} paused animations..`);
  }

  onMount(() => {
    console.debug(`${screenKey} mounted..`);
  });

  onDestroy(() => {
    console.debug(`${screenKey} destroyed..`);
  });
</script>

<!--
  Blanket is used for shadowing underlying screen as this screen transitions in/out.
  Blanket will be fully hidden by screen after transition complete.
 -->
<blanket
  {onTop}
  style={blanketStyle}
  in:fly={{ y: 50 }}
  out:fly={{ y: 50, delay: 250, duration: 400 }}
>
  <screen
    bind:this={screen}
    {style}
    in:fly={{ y: 50, delay: 250, duration: 200 }}
    out:fly={{ y: 50, delay: 0 }}
  >
    <slot class="content" {...navigatorCxt} />
  </screen>
</blanket>

<style>
  blanket {
    position: absolute;
    /* background-color: rgba(0, 0, 0, 0.8); */
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    height: 100%;
    width: 100%;

    overflow: hidden;
    box-sizing: border-box;
    user-select: none;

    text-align: center;
    margin: 0 auto;

    display: flex;
    flex-direction: column;

    transition: all 250ms ease-in-out;
  }

  blanket[onTop="false"] {
    background-color: white;
    border-radius: 1em;
    opacity: 0;
    transform: scale(0.9) translateY(10%);
  }

  screen {
    /* background-color: white; */
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    width: 100%;
    height: 100%;

    overflow: hidden;
    box-sizing: border-box;

    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .content {
    overflow: hidden;
    box-sizing: border-box;
  }
</style>
