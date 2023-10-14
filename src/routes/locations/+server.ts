import type { RequestHandler } from './$types';
import { pusher } from '$lib/pusher-server';

const locations: Array<string | {lat: number, lng: number}> = [];
let currentPrompt = '';

export const GET: RequestHandler = async () => {
    return new Response();
};

export const POST: RequestHandler = async ({ request }) => {
    const { location } = await request.json();

    locations.push(location);

  pusher.trigger('location', 'new-location', {
    locations: locations
  });
    return new Response();
};