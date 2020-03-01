import { useState, useEffect } from 'react';
import io from 'socket.io-client';
const sharedSocket = io('http://localhost:3001/memory-game').connect();

const useSocket = () => {
  const [socket] = useState(() => sharedSocket);
  useEffect(() => {
    return () => {
      socket.removeAllListeners();
      socket.close();
    };
  }, [socket]);
  return [socket];
};

export default useSocket;
