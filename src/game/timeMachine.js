import { Machine, actions, sendParent } from 'xstate';
const { assign } = actions;

const isMax = (context) => context.seconds >= context.maximum;

const timeMachine = Machine({
  id: 'watch',
  context: {
    maximum: 10,
    seconds: 0,
  },
  initial: 'idle',
  states: {
    idle: {
      on: {
        START: 'started',
      },
    },
    started: {
      entry: assign({ seconds: 0 }),
      invoke: {
        id: 'tick',
        src: (context, event) => (callback, onReceive) => {
          const id = setInterval(() => callback('TICK'), 1000);
          // Perform cleanup
          return () => clearInterval(id);
        },
      },
      on: {
        TICK: [
          { target: 'end', cond: isMax },
          {
            target: '',
            actions: [
              assign({ seconds: (context) => context.seconds + 1 }),
              sendParent('CLOCK_TICK'),
            ],
          },
        ],
        STOP: 'end',
      },
    },
    end: {
      type: 'final',
      entry: sendParent('CLOCK_END'),
    },
  },
});

export default timeMachine;
