import { io } from 'socket.io-client';
import { locationsStore, gameStateStore, timerStore } from './stores';
export const SOCKET_SERVER_URL = 'http://localhost:3000';
export const socket = io(SOCKET_SERVER_URL, { transports: ['websocket', 'polling', 'flashsocket'] });

export type GameState = {
    started: boolean;
    currentSet: string[][];
    currentPrompt: string[];
    currentString: string;
    currentTimer: number;
    currentPromptIndex: number;
    stage: string;
}

export type Location = { lat?: number; lng?: number; string?: string }

// Location data socket logic
socket.on('locations', (data: Location[]) => {
    locationsStore.set(data);
});

// Game state socket logic
socket.on('state', (data: GameState) => {
    gameStateStore.set(data);
});

socket.on('submitTimer', (data: number) => {
    timerStore.set(data);
});