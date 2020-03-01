import { Machine, actions, spawn } from 'xstate';
import timeMachine from './timeMachine';
const { assign, send } = actions;

// taken on : https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
function shuffle(array) {
  let counter = array.length;
  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);
    // Decrease counter by 1
    counter--;
    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

// more on fetch: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
// TODO: handle status code >= 400 as an error

// GET /parties
const fetchParties = (ctx) =>
  fetch('http://localhost:3001/parties').then((res) => res.json());

// POST /parties
const updateParty = (ctx) => {
  return fetch('http://localhost:3001/parties', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: ctx.username,
      seconds: ctx.clock.state.context.seconds,
    }),
  }).then((res) => res.json());
};

// in seconds
const MAX_TIME = 120;

// 10 items as it will be doubled : 10 * 2 = 20 = 5 row * 4 cols
const getCards = () =>
  shuffle(
    [
      'pomme',
      'banane',
      'pommeVert',
      'fraise',
      'abricot',
      'grenade',
      'citron',
      'citronVert',
      'peche',
      'raisin',
      // 'pasteque',
      // 'prune',
      // 'poire',
      // 'cerise',
      // 'framboise',
      // 'mangue',
      // 'mirabelle',
      // 'pomme',
    ]
      // doubling items
      .reduce((acc, cardName) => acc.concat(cardName, cardName), []),
  )
    // transorm array to map {<cardIndex>:<card>}
    .reduce(
      (acc, cardName, cardIndex) => ({
        ...acc,
        [cardIndex]: { name: cardName, id: cardIndex },
      }),
      {},
    );

const memoryGameMachine = Machine({
  id: 'memory-game',
  context: {
    parties: [],
    cards: getCards(),
    lastRevealedCardId: null,
    revealedCards: {},
    clock: null,
    progress: 0,
    username: '',
    error: '',
  },
  initial: 'idle',
  states: {
    idle: {
      entry: assign({
        cards: getCards(),
        revealedCards: {},
        clock: null,
        progress: 0,
        username: '',
        error: '',
        lastRevealedCardId: null,
      }),
      invoke: {
        id: 'fetch-parties',
        src: fetchParties,
        onDone: 'partiesLoaded',
        onError: 'requestFailed',
      },
    },
    requestFailed: {
      entry: assign({
        error: (context, event) => 'Une triste erreur est survenue !',
      }),
      on: {
        RETRY: 'idle',
      },
    },
    partiesLoaded: {
      entry: [
        assign({
          parties: (ctx, e) => e.data,
          clock: (context, event) =>
            spawn(timeMachine.withContext({ maximum: MAX_TIME }), {
              sync: true,
            }),
        }),
      ],
      on: {
        TYPING: {
          actions: assign({
            username: (ctx, e) => e.username,
          }),
        },
        PLAY: {
          target: 'playing',
          actions: send('START', { to: (context) => context.clock }),
        },
      },
    },
    playing: {
      on: {
        CLOCK_END: 'lost',
        REVEAL: 'revealingFirst',
      },
    },
    revealingFirst: {
      entry: assign({
        lastRevealedCardId: (ctx, e) => e.id,
        revealedCards: (ctx, e) => ({
          ...ctx.revealedCards,
          [e.id]: true,
        }),
      }),
      on: {
        REVEAL: 'revealingSecond',
      },
    },
    revealingSecond: {
      entry: assign({
        revealedCards: (ctx, e) => ({
          ...ctx.revealedCards,
          [e.id]: true,
        }),
      }),
      invoke: {
        id: 'check-revealed-cards',
        src: (ctx, e) => (callback, onReceive) => {
          const lastRevealedCard = ctx.cards[ctx.lastRevealedCardId];
          const currentRevealedCard = ctx.cards[e.id];
          // const revealedCards = { ...ctx.revealedCards, [e.id]: true };
          if (
            Object.values(ctx.revealedCards).filter((revealed) => revealed)
              .length === Object.keys(ctx.cards).length
          ) {
            return callback('WIN');
          }
          if (lastRevealedCard.name === currentRevealedCard.name) {
            return callback('MATCH');
          }
          const timeout = setTimeout(
            () => callback({ type: 'NOT_MATCH', ...currentRevealedCard }),
            650,
          );
          return () => clearTimeout(timeout);
        },
      },
      on: {
        WIN: {
          target: 'winning',
          actions: assign({
            progress: 100,
          }),
        },
        MATCH: {
          target: 'playing',
          actions: assign({
            progress: (ctx) =>
              parseInt(
                (Object.values(ctx.revealedCards).filter((revealed) => revealed)
                  .length *
                  100) /
                  Object.keys(ctx.cards).length,
              ),
            lastRevealedCardId: () => null,
          }),
        },
        NOT_MATCH: {
          target: 'playing',
          actions: assign({
            lastRevealedCardId: (ctx, e) => null,
            revealedCards: (ctx, e) => {
              return {
                ...ctx.revealedCards,
                [ctx.lastRevealedCardId]: false,
                [e.id]: false,
              };
            },
          }),
        },
      },
    },
    winning: {
      entry: send('STOP', { to: (context) => context.clock }),
      invoke: {
        id: 'save-party',
        src: updateParty,
        onDone: 'waitWinning',
        onError: 'requestFailed',
      },
    },
    waitWinning: {
      after: {
        // after 1.5 second, transition to won
        1500: 'won',
      },
    },
    won: {
      on: {
        RETRY: 'idle',
      },
    },
    lost: {
      on: {
        RETRY: 'idle',
      },
    },
  },
});

export default memoryGameMachine;
