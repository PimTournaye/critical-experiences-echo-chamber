import { io } from 'socket.io-client';
import { countdownStore, currentPromptStore, locationsStore, gameStateStore } from './stores';
export const socket = io('https://echo-chamber-socket-server.glitch.me/');

// Location data socket logic
socket.on('locations', (data: Array<string | {lat:number,lng:number}>) => {
    console.log('locations', data);
    locationsStore.set(data);
});

// Countdown socket logic
socket.on('update-countdown', (data: number) => {
    console.log('update-countdown', data);
    countdownStore.set(data);
});

// Prompt socket logic
socket.on('update-prompt', (data: string[]) => {
    console.log('update-prompt', data);
    currentPromptStore.set(data);
});

socket.on('state', (data: any) => {
    console.log('state', data);
    gameStateStore.set(data);
});