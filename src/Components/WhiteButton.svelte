<script lang="ts">
</script>

<button on:click><slot /></button>

<style>
  button {
    padding: 0.25em 0.5em 0.25em 0.5em;

    margin: 0.4em;
    background-color: white;
    border: none;
    border-radius: 0.4em;
    box-shadow: 10px 10px 25px rgba(0, 0, 0, 0.5);

    transition: all 50ms ease-out;
  }

  button:active {
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 1);
  }

  button:disabled {
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
    background-color: whitesmoke;
    color: darkgray;
  }
</style>
