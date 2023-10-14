import { pusher } from '$lib/pusher-server';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  console.log('POST /pusher/auth');
  console.log('request', request.body);
  
  
  const { socketID, channel } = request.body;
  console.log('socketID', socketID);
  console.log('channel', channel);
  
  const authResponse = pusher.authorizeChannel(socketID, channel);
  return new Response(JSON.stringify(authResponse));
};