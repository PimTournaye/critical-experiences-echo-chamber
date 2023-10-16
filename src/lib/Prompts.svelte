<script lang="ts">
  import { gameStateStore } from '$lib/stores';
	import { onMount } from 'svelte';
  import { gsap } from "gsap";
  import { TextPlugin } from "gsap/TextPlugin";
  gsap.registerPlugin(TextPlugin);

  let started: boolean = false;
  let prompts: boolean = false;
  let submit: boolean = false;
  let cooldown: boolean = false;

  $: started = $gameStateStore.started;
  $: prompts = $gameStateStore.stage === 'prompts';
  $: submit = $gameStateStore.stage === 'submit';
  $: cooldown = $gameStateStore.stage === 'cooldown';


let currentPrompt: HTMLElement;
onMount(() => {
  currentPrompt = document.querySelector("#current-prompt")!;
});

$: if (currentPrompt) {
  gsap.to(currentPrompt, {
    duration: 0.5,
    text: $gameStateStore.currentString,
    ease: "none"
  });
}

</script>

{#if started}
  {#if prompts}
    <h1 class="font-bold text-6xl mx-auto" id="current-prompt">{$gameStateStore.currentString}</h1>
  {:else}
    <div class="flex flex-col">
      {#each $gameStateStore.currentPrompt as prompt}
        <p class="font-bold text-2xl mx-auto">{prompt}</p>
      {/each}
    </div>
  {/if}
{:else}
<h1 class="font-bold text-6xl mx-auto">
  Waiting for others...
</h1>
{/if}
