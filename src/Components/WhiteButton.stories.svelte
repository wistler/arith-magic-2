<!-- Button.stories.svelte -->
<script lang="ts">
  import { Meta, Story } from "@storybook/addon-svelte-csf";

  import WhiteButton from "./WhiteButton.svelte";
</script>

<Meta title="Button" component={WhiteButton} />

<Story name="Primary">
  <WhiteButton>Normal</WhiteButton>
  <WhiteButton disabled>Disabled</WhiteButton>
  <WhiteButton flat>Flat</WhiteButton>
  <WhiteButton flat disabled>Flat Disabled</WhiteButton>
  <WhiteButton>Icon?</WhiteButton>
</Story>
