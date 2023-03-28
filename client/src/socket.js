import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = "http://192.168.0.15:3001";

export const socket = io(URL);