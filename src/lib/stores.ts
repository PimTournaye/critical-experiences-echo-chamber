import { writable, type Writable } from "svelte/store";
import type { GameState, Location } from "./sockets";


export const locationsStore: Writable<Location[]> = writable();
export const gameStateStore: Writable<GameState> = writable();
export const timerStore: Writable<number> = writable();