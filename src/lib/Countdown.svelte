<script lang="ts">
	import { timerStore, gameStateStore } from "$lib/stores";
  
  // Calculate the percentage of time left, maxed timer at 30 seconds and currentTimer counting down
  const percentage = Math.max(0, Math.min(100, ($timerStore / 30) * 100)); 
</script>

{#if $gameStateStore.stage === 'submit'}
<div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
  <div class="bg-blue-600 h-2.5 rounded-full" style="width: {percentage}%"></div>
</div>
{/if}

{#if $gameStateStore.stage === 'cooldown'}
  <button>Get someone's perspective</button>
{/if}