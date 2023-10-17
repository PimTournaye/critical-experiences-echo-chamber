import { socket } from '$lib/sockets';
import type { LayoutLoad } from './$types';

export const load = (async () => {
    // Immediately load the game state by connecting to the socket server
    socket.connect();


    return {};
}) satisfies LayoutLoad;