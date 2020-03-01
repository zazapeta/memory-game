import React from 'react';
import { useMachine } from '@xstate/react';
import memoryGameMachine from './gameMachine';

export const Game = () => {
  const [state, send] = useMachine(memoryGameMachine);
  const seconds = state.context.clock.state.context.seconds;
  return (
    <div>
      <h5>{seconds} secondes</h5>
      <button onClick={() => send('PLAY')}>
        {state.value === 'idle'
          ? 'Click to START'
          : 'Active! Click to deactivate'}
      </button>
    </div>
  );
};
