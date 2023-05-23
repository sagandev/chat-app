import React from 'react';
import { socket } from '../socket';

export function ConnectionManager({roomId}) {
  function connect() {
    socket.on('connect', () => {
      socket.emit('join', roomId)
    });
  }

  return (
    <>
    </>
  );
}