import React, { useState, useEffect, useReducer } from 'react';
import logo from './logo.svg';
import './App.css';
import { SocketTime } from './useSocketTime';
import useSocket from './useSocket';
import useSocketOn from './useSocketOn';
import { Game } from './machine/Game';

const REVEAL_RESPONSE = {
  WIN: 1,
  ALREADY_REVEALED: 2,
  MATCH: 3,
  NOT_MATCH: 4,
  REVEALED: 5,
};

const Card = ({ back, flipped, onClick }) => {
  return (
    <div className={`flip-card ${flipped ? 'flipped' : ''}`} onClick={onClick}>
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <img
            src="./front.jpg"
            alt="Avatar"
            style={{
              display: 'block',
              background: 'lightgray',
              width: '8rem',
            }}
          />
        </div>
        <div className="flip-card-back">
          <img
            src={back}
            alt="Avatar Back"
            style={{
              display: 'block',
              background: 'pink',
              width: '8rem',
              height: '8rem',
            }}
          />
        </div>
      </div>
    </div>
  );
};

const initialState = {
  cards: {},
  revealedCards: {},
  lastRevealedCard: null,
  time: 0,
  isCreated: false,
  isStarted: false,
  isEnded: false,
  isWon: false,
  isLost: false,
  isChecking: false,
};

function reducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case 'create':
      return {
        ...initialState,
        isCreated: true,
        cards: payload,
        revealedCards: Object.keys(payload).reduce(
          (acc, cardId) => ({ ...acc, [cardId]: false }),
          {},
        ),
      };
    case 'start':
      return { ...state, isStarted: true };
    case 'time':
      return { ...state, time: payload };
    case 'flip':
      return {
        ...state,
        lastRevealedCard: payload,
        revealedCards: {
          ...state.revealedCards,
          [payload]: true,
        },
      };
    case 'unflip':
      return {
        ...state,
        lastRevealedCard:
          state.lastRevealedCard === payload ? null : state.lastRevealedCard,
        revealedCards: {
          ...state.revealedCards,
          [payload]: false,
        },
      };
    case 'win':
      return {
        ...state,
        isWon: true,
      };
    case 'lost':
      return {
        ...state,
        isLost: true,
      };
    default:
      throw new Error();
  }
}

function App() {
  const [state, _dispatch] = useReducer(reducer, initialState);
  const dispatch = (type, payload) => _dispatch({ type, payload });
  const [socket] = useSocket();
  useEffect(() => {
    const onTime = (time) => dispatch('time', time);
    socket.on('time', onTime);
    return () => socket.off('time', onTime);
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <button
          onClick={() => {
            socket.emit('create', ({ cards }) => dispatch('create', cards));
          }}
        >
          {!state.isCreated ? 'Create Party' : 'Cancel & Create new'}
        </button>
        {parseInt(state.time / 1000)}
        <div className="grid">
          {Object.keys(state.cards).map((cardId, i) => (
            <Card
              key={i}
              back={'./' + state.cards[cardId].name + '.png'}
              flipped={state.revealedCards[cardId]}
              onClick={() => {
                if (!state.revealedCards[cardId] && state.isStarted) {
                  dispatch('flip', cardId);

                  socket.emit('reveal', cardId, (reveal) => {
                    switch (reveal) {
                      case REVEAL_RESPONSE.WIN:
                        dispatch('win');
                        break;
                      case REVEAL_RESPONSE.REVEALED:
                        dispatch('flip', cardId);
                        break;
                      case REVEAL_RESPONSE.MATCH:
                        dispatch('flip', cardId);
                        break;
                      case REVEAL_RESPONSE.NOT_MATCH:
                        setTimeout(() => {
                          dispatch('unflip', state.lastRevealedCard);
                          dispatch('unflip', cardId);
                        }, 1000);
                        break;
                    }
                  });
                }
              }}
            />
          ))}
        </div>
        {state.isCreated && !state.isStarted && (
          <button
            onClick={() => {
              socket.emit('start');
              dispatch('start');
            }}
          >
            Start
          </button>
        )}
      </header>
      <hr />
      <hr />
      <hr />
      <hr />
      <hr />
      <Game />
    </div>
  );
}

export default App;
