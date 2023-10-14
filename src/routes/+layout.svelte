<script lang="ts">
	import { pusher } from '$lib/pusher-client';
	import '../app.postcss';
	let showOverlay = true;
	let location: string | { lat: number, lng: number };
	let disableButtons = false;
	
	function getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				location = {
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				}
				publishLocation();
				showOverlay = false;
			});
		} else {
			alert("Geolocation is not supported by this browser. Please input your location manually.");
		}
	}
	
	function submitLocation() {
		if (location === '') {
			alert("Please input your location.");
			return;
		}
		publishLocation();
		showOverlay = false;
	}

	async function publishLocation() {
		await fetch('/location', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify({
      location: location 
    })
		// Disable buttons after pressing them
		
  });
	}

	// Pusher stuff
	const channel = pusher.subscribe('private-location');
	channel.bind('new-location', (data) => {
		
	});
</script>

{#if showOverlay}
	<div class="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
		<div class="bg-lightgrey rounded-lg p-8">
			<h2 class="text-2xl font-bold mb-4">Share your location directly or indirectly.</h2>
			<div class="flex justify-between">
				<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" disabled={disableButtons} on:click|preventDefault={getLocation}>Share location</button>
				<p class="align-center py-2 px-4">or</p>
				<div class="flex">
					<input type="text" class="border rounded-l px-2 py-1" placeholder="In a windy place..." bind:value={location} />
					<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r" disabled={disableButtons} on:click|preventDefault={submitLocation}>Submit</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<slot />

<style>

</style>
