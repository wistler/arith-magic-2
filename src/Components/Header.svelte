<script lang="ts">
  $: count = 3;
  const increment = () => {
    count += 2;
  };
</script>

<header>ArithMagic</header>

<style>
  header {
    width: 100%;
    padding: 1em;
    /* font-size: 1em; */
    background-color: rgba(255, 255, 255, 0.3);
    color: black;
  }
</style>
