<script lang="ts">
	import Countdown from '$lib/Countdown.svelte';
	import Map from '$lib/Map.svelte';
	import Prompts from '$lib/Prompts.svelte';
	import { socket } from '$lib/sockets';
	import { gameStateStore } from '$lib/stores';

	// Input logic
	let input: string = '';
	let lockedInput: boolean = false;
	const submitResponse = () => {
		lockedInput = true;
		socket.emit('submit-response', input);
	};

	// Reactive logic and statements
	$: started = $gameStateStore.started;
	$: if ($gameStateStore.stage === 'submit') {
		// Reset input
		lockedInput = false;
		input = '';
	}
	$: if ($gameStateStore.stage === 'cooldown') {
		// Reset input
		lockedInput = false;
		input = '';
	}
</script>

<main class="flex flex-col justify-between h-screen pt-16">
	<div class="w-screen flex flex-col justify-center px-16 space-y-8 grow-0">
		<Prompts />
		{#if started}
			<div class="flex flex-row justify-center mx-auto">
				<input
					type="text"
					class="border rounded-l border-gray-700 px-8 py-4 bg-black text-white"
					placeholder="..."
					disabled={lockedInput || $gameStateStore.stage !== 'submit'}
					bind:value={input}
				/>
				<button
					class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r"
					disabled={lockedInput || $gameStateStore.stage !== 'submit'}
					on:click|preventDefault={submitResponse}>Lock in</button
				>
			</div>
			<Countdown />
		{/if}
	</div>
	<Map />
</main>
