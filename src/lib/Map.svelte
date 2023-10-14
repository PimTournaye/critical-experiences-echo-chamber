<script lang="ts">
	// Imports
	import * as d3 from 'd3';
	import { onMount } from 'svelte';
	import * as topojson from 'topojson-client';

	const locations = [
		{ lat: 37.772, lng: -122.214 },
		{ lat: 21.291, lng: -157.821 },
		{ lat: -18.142, lng: 178.431 },
		{ lat: -27.467, lng: 153.027 }
	];

	onMount(() => {
		const element = document.getElementById('map')!;
		// Get the dimensions of the container
		const width = element.offsetWidth!;
		const height = element.offsetHeight!;
		const svg = d3
			.select(element)
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.attr('viewBox', [0, 0, width, height])
			.attr('margin', 'auto');

		// Load and draw GeoJSON data
		d3.json('https://unpkg.com/world-atlas@1.1.4/world/110m.json').then((data) => {
			const countries = topojson.feature(data, data.objects.countries);
			const projection = d3
				.geoMercator()
				.center([0, 0])
				.translate([width / 2, height / 2]);
			// projection.scale(width / 8);
			// Create a path generator based on this projection
			const path = d3.geoPath().projection(projection);
			// Draw the world map
			svg
				.selectAll('path')
				.data(countries.features)
				.enter()
				.append('path')
				.attr('class', 'country')
				.attr('d', path)
				.attr('stroke', '#b8b8b880')
				.attr('fill', '#b8b8b860');

			// Draw the dots
			svg
				.append('g')
				.selectAll('circle')
				.data(locations)
				.enter()
				.append('circle')
				.attr('cx', (d) => projection([d.lng, d.lat])?.[0] ?? 0)
				.attr('cy', (d) => projection([d.lng, d.lat])?.[1] ?? 0)
				.attr('r', 5)
				.attr('fill', 'red')
				.attr('opacity', '0.8')
				.attr('clip-path', 'url(#clip)');

			// Now we need to clip the dots so they don't appear outside the map
			svg
				.append('defs')
				.append('clipPath')
				.attr('id', 'clip')
				.append('rect')
				.attr('width', width)
				.attr('height', height);
		});
	});
</script>

<div id="map" />

<style lang="postcss">
	#map {
		width: 100vw;
		/* height: 100vh; */
		@apply grow;
	}
</style>
