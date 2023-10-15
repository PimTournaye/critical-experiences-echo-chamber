import { writable } from "svelte/store";

export let locationsStore = writable();
export let currentPromptStore = writable();
export let countdownStore = writable(0);
export let gameStateStore = writable();