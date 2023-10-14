import Pusher from 'pusher-js';
import * as PusherTypes from 'pusher-js';
import { PUSHER_KEY } from '$env/static/private';

// Enable pusher logging - don't include this in production
Pusher.logToConsole = true;

export const pusher = new Pusher(PUSHER_KEY, {
  cluster: 'eu',
  channelAuthorization: {
    endpoint: "/pusher/auth",
    transport: 'ajax'
  }
});