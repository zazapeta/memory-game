import React, { useEffect, useState } from 'react';
import useSocket from './useSocket';

function useSocketOn(event, initialData) {
  const [socket] = useSocket();
  const [data, setData] = useState(initialData);
  useEffect(function() {
    socket.on(event, setData);
    return () => socket.off(event);
  }, []);
  return [data, socket];
}

export default useSocketOn;
