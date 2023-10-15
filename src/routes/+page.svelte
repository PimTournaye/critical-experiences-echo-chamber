<script lang="ts">
	import Map from '$lib/Map.svelte';

	// Input logic
	let input: string = '';

	let readyToSend: boolean = false;
	let keyHeldDuration: number = 5000; // 5 seconds in milliseconds

	let timer: NodeJS.Timeout;

	function handleKeyHold(event: KeyboardEvent, keyToCheck: string, lengthOverride: number = 5000) {
		if (event.code === keyToCheck) {
			if (event.type === 'keydown') {
				timer = setTimeout(() => {
					readyToSend = true;
				}, lengthOverride);
			} else if (event.type === 'keyup') {
				clearTimeout(timer);
				readyToSend = false;
			}
		}
	}

	// Example usage with arrow up key
	document.addEventListener('keydown', (event) => {
		handleKeyHold(event, 'ArrowUp', keyHeldDuration);
	});

	document.addEventListener('keyup', (event) => {
		handleKeyHold(event, 'ArrowUp');
	});

	// Example usage with arrow down key
	// document.addEventListener('keydown', (event) => {
	//   handleKeyHold(event, 'ArrowDown', keyHeldDuration);
	// });

	// document.addEventListener('keyup', (event) => {
	//   handleKeyHold(event, 'ArrowDown');
	// });
</script>

<main class="flex flex-col justify-between h-screen pt-16">
	<div class="w-screen flex flex-col justify-center px-16 space-y-8 grow-0">
		<h1 class="text-6xl font-bold m-auto">QUESTION</h1>
		<input
			type="text"
			class=" max-w-6xl w-96 px-8 py-4 border-2 border-slate-600 bg-gray-900 mx-auto rounded-lg"
			bind:value={input}
		/>
		<div id="countdown" />
	</div>
	<Map />
</main>
