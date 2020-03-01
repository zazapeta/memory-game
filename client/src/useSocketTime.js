import React from 'react';
import useSocketOn from './useSocketOn';

function useSocketTime() {
  const [time] = useSocketOn('time', 0);
  return [time];
}

export const SocketTime = () => {
  const [time] = useSocketTime();
  return <div>{parseInt(time / 1000)}</div>;
};

export default useSocketTime;
