import { Machine, actions, spawn } from 'xstate';
import timeMachine from './timeMachine';
const { assign, send } = actions;

const memoryGameMachine = Machine({
  id: 'memory-game',
  context: {
    cards: [1, 2, 3, 4],
    clock: null,
  },
  initial: 'idle',
  states: {
    idle: {
      entry: assign({
        clock: (context, event) => spawn(timeMachine, { sync: true }),
      }),
      on: {
        PLAY: 'playing',
      },
    },
    playing: {
      entry: send('START', { to: (context) => context.clock }),
      on: {
        TICK: {
          actions: (ctx, e) => console.log(ctx, e),
        },
        REVEAL: 'revealing',
      },
    },
    revealing: {},
    win: {},
    lost: {},
  },
});

export default memoryGameMachine;
