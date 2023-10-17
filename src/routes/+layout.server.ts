import { socket } from '$lib/sockets';
import { gameStateStore } from '$lib/stores';
import type { LayoutLoad } from './$types';

export const load = (async () => {
    // Wait until we know we have received the gamestate from the server, otherwise we will have no idea what to render
    socket.on('gamestate', (gameState) => {
        gameStateStore.set(gameState);
    });
    return {};
}) satisfies LayoutLoad;