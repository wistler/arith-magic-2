<script lang="ts">
  import _ from "lodash";
  import { setContext } from "svelte";
  import {
    ScreenStackNavigatorCxt,
    STACK_NAVIGATOR_CXT_KEY,
  } from "./@types/ScreenStackNavigator";

  export let screenList: Array<{ key: string; screen: any }> = [];
  export let rootScreenKey: string;
  export let stack: string[] = [rootScreenKey];

  function findEntry(key: string) {
    return screenList.find((e) => e.key === key);
  }

  async function navigateTo(screenKey: string) {
    if (getCurrentScreenKey() !== screenKey) {
      stack = [...stack, screenKey];
    }
    return true;
  }

  async function back() {
    stack = stack.slice(0, -1);
    return true;
  }

  function getCurrentScreenKey() {
    return stack[stack.length - 1];
  }

  setContext(STACK_NAVIGATOR_CXT_KEY, {
    getCurrentScreenKey,
    navigateTo,
    back,
  } as ScreenStackNavigatorCxt);
</script>

<main>
  {#each stack as screenKey, screenIndex}
    {@const screenProp = {
      screenKey,
      onTop: screenIndex === stack.length - 1,
    }}
    <svelte:component this={findEntry(screenKey).screen} {...screenProp} />
  {/each}
</main>

<style>
  main {
    user-select: none;
    height: 100%;
    width: 100%;
    overflow: hidden;
    text-align: center;
    margin: 0 auto;

    position: relative;

    flex: 1;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }
</style>
