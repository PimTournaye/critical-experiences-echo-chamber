<script lang="ts">
	import { gameStateStore } from '$lib/stores';
	import { socket } from '$lib/sockets';
	import { onMount } from 'svelte';

	let started: boolean = false;
	let prompts: boolean = false;
	let submit: boolean = false;
	let cooldown: boolean = false;
	let gotResponse: boolean = false;

	$: started = $gameStateStore.started;
	$: prompts = $gameStateStore.stage === 'prompt';
	$: submit = $gameStateStore.stage === 'submit';
	$: cooldown = $gameStateStore.stage === 'cooldown';
	$: if (!cooldown) gotResponse = false;

	let currentPrompt: HTMLElement;
	onMount(() => {
		currentPrompt = document.querySelector('#current-prompt')!;
	});

	const getResponse = () => {
		socket.emit('response-request');
		socket.on('response-request', (response: string) => {
			gotResponse = true;
			// Fill in the response in the reponse div
			const responseDiv = document.querySelector('#response')!;
			responseDiv.innerHTML = response;
		});
	};

	$: console.log($gameStateStore.currentString);
	$: console.log($gameStateStore.stage);
</script>

<svelte:head>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/TextPlugin.min.js"></script>
</svelte:head>

{#if started}
	{#if prompts}
		<h1 class="font-bold text-6xl mx-auto" id="current-prompt">{$gameStateStore.currentString}</h1>
	{:else if submit}
		<div class="flex flex-col">
			{#each $gameStateStore.currentPrompt as prompt}
				<p class="font-bold text-2xl mx-auto">{prompt}</p>
			{/each}
		</div>
	{:else if cooldown}
		<div class="flex flex-col space-y-4">
			<button
				class="font-bold text-6xl mx-auto"
				on:submit={getResponse}
				disabled={gotResponse}
				id="response-request"
			>
				View another's perspective.
			</button>
			<div class="text-6xl font-bold mx-auto" id="response"/>
		</div>
	{/if}
{:else}
	<h1 class="font-bold text-6xl mx-auto">Waiting for others...</h1>
{/if}
