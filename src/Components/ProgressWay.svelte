<script lang="ts">
  import { writable } from "svelte/store";
  import { flip } from "svelte/animate";

  export let steps = [];
  export let current = 0;
</script>

<waypoints>
  {#each steps as step, si}
    <waypoint
      class:completed={current > si}
      class:current={current === si}
      class:future={current < si}
    >
      <svelte:component this={step.icon} {...step.iconProps} />
    </waypoint>
    {#if si < steps.length - 1}
      <bar
        class:completed={si < current - 1}
        class:current={si === current - 1}
        class:future={si > current - 1}
      />
    {/if}
  {/each}
</waypoints>

<style>
  waypoints {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    /* padding: 0.5em; */

    max-height: 3em;

    justify-content: center;
    align-items: center;
    border-radius: 0.4em;

    width: 100%;
  }

  waypoint {
    flex: 0;
    min-width: 2em;
    max-width: 3em;
    margin: -0.3em;
    transition: color 200ms ease-in-out;
  }

  bar {
    flex: 1;
    flex-grow: 1;
    min-width: 0.5em;
    max-width: 2em;
    height: 0.1em;
    margin-bottom: 0em;
    transition: color 200ms ease-in-out;
  }

  waypoint.completed {
    color: #f00;
  }
  waypoint.current {
    color: #fff;
    animation: bounce ease-out 1s infinite;
  }

  waypoint.future {
    color: #0008;
  }

  bar.completed {
    background-color: #fff;
  }
  bar.current {
    background-color: #fff8;
  }
  bar.future {
    background-color: #0008;
  }

  @keyframes bounce {
    40%,
    60% {
      transform: translate3d(0, -0.3em, 0);
    }
  }

  @media (prefers-color-scheme: dark) {
    waypoint.completed {
      color: #9f9;
    }
    waypoint.current {
      color: #999;
    }

    waypoint.future {
      color: #0008;
    }

    bar.completed {
      background-color: #999;
    }
    bar.current {
      background-color: #9998;
    }
    bar.future {
      background-color: #0008;
    }
  }
</style>
