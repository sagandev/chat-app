import React, { useState, useEffect } from "react";
import { socket } from "../../socket";
import { ConnectionState } from "../../components/ConnectionState";
import { ConnectionManager } from "../../components/ConnectionManager";
import { MyForm } from "../../components/MyForm";
import {Events} from "../../components/Events"
export default function RoomPage() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState([]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onFooEvent(value) {
        console.log(fooEvents)
      setFooEvents((previous) => [...previous, value]);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("chat message", onFooEvent);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("chat message", onFooEvent);
    };
  }, []);
  return (
    <div className="App">
      <ConnectionState isConnected={isConnected} />
      <Events events={fooEvents} />
      <ConnectionManager />
      <MyForm />
    </div>
  );
}
