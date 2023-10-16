<script lang="ts">
	import Countdown from '$lib/Countdown.svelte';
	import Map from '$lib/Map.svelte';
	import Prompts from '$lib/Prompts.svelte';
	import { gameStateStore } from '$lib/stores';
	import type { GameState } from '$lib/sockets';

	// Input logic
	let input: string = '';
	let lockedInput: boolean = false;
	let cooldown, submit, prompts: boolean;

	console.log($gameStateStore);
	
	$: started = $gameStateStore.started;
	
</script>

<main class="flex flex-col justify-between h-screen pt-16">
	<div class="w-screen flex flex-col justify-center px-16 space-y-8 grow-0">
		<Prompts />
		<div class="flex flex-row justify-center mx-auto">
			<input
						type="text"
						class="border rounded-l border-gray-700 px-8 py-4 bg-black text-white"
						placeholder="..."
					/>
					<button
						class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r"
						disabled={lockedInput}
						on:click|preventDefault={() => lockedInput = !lockedInput}>Lock in</button
					>
		</div>
		<Countdown />
	</div>
	<Map />
</main>
