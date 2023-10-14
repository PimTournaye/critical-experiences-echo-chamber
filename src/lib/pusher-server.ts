import Pusher from 'pusher';
import {PUSHER_KEY, PUSHER_SECRET, PUSHER_APP_ID} from '$env/static/private';

export const pusher = new Pusher({
  appId: PUSHER_APP_ID,
  key: PUSHER_KEY,
  secret: PUSHER_SECRET,
  cluster: "eu",
  useTLS: true
});