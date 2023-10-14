<script lang="ts">
	// import { createMap } from '$lib/map';
	import Map from '$lib/Map.svelte';
	import { pusher } from '$lib/pusher-client';
	let text = '';
	let countdown = 60;



	// Input stuff
	let input: string = '';

</script>

<main class="flex flex-col justify-between h-screen pt-16">
	<div class="w-screen flex flex-col justify-center px-16 space-y-8 grow-0 ">
		<h1 class="text-6xl font-bold m-auto">QUESTION</h1>
		<input type="text" class=" max-w-6xl w-96 px-8 py-4 border-2 border-slate-600 bg-gray-900 mx-auto rounded-lg" bind:value={input} />
		<div id="countdown"></div>
	</div>
    <Map />
</main>
