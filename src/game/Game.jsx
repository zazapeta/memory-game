import React from 'react';
import { useMachine } from '@xstate/react';
import front from './front.jpg';
import memoryGameMachine from './gameMachine';
import {
  leaderboard,
  row,
  name,
  score,
  button,
  usernameContainer,
} from './game.module.css';

// @see : https://www.w3schools.com/howto/howto_css_flip_card.asp
const Card = ({ back, flipped, onClick }) => {
  return (
    <div className={`flip-card ${flipped ? 'flipped' : ''}`} onClick={onClick}>
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <img
            src={front}
            alt="Avatar"
            style={{
              display: 'block',
              background: 'lightgray',
              width: '100px',
            }}
          />
        </div>
        <div className="flip-card-back">
          <div className={back} />
        </div>
      </div>
    </div>
  );
};

const Leaderboard = ({ parties }) => (
  <>
    <h2>Leaderboard</h2>
    <div className={leaderboard}>
      {parties.map((p, i) => (
        <div className={row} key={i}>
          <div className={name}>{p.username}</div>
          <div className={score}>{p.seconds}</div>
        </div>
      ))}
    </div>
  </>
);
const Progress = ({ value }) => (
  <div style={{ background: '#f1f1f1' }}>
    <div style={{ color: 'white', background: 'green', width: value + '%' }}>
      {value}
    </div>
  </div>
);

export const Game = () => {
  const [state, send] = useMachine(memoryGameMachine);
  let gameRender = () => null;
  let timeRender = () => 0;
  switch (state.value) {
    case 'idle': {
      return <div>Chargement ...</div>;
    }
    case 'requestFailed': {
      return (
        <div>
          <p>Une erreur est survenue ! {state.context.error}</p>
        </div>
      );
    }
    case 'partiesLoaded': {
      gameRender = () => (
        <div className={usernameContainer}>
          <label>
            Pseudo :{' '}
            <input
              type="text"
              value={state.context.username}
              onChange={(e) => send('TYPING', { username: e.target.value })}
              required
            />
          </label>
          <br />
          <button className={button} onClick={() => send('PLAY')}>
            Jouer
          </button>
        </div>
      );
      break;
    }
    case 'playing':
    case 'revealingFirst':
    case 'revealingSecond':
      const { cards, revealedCards } = state.context;
      const { maximum, seconds } = state.context.clock.state.context;
      timeRender = () => <span>{maximum - seconds}</span>;
      gameRender = () => (
        <div>
          <div className="grid">
            {Object.values(cards).map((card, i) => (
              <Card
                key={i}
                back={'card-' + card.name}
                flipped={revealedCards[card.id]}
                onClick={() => {
                  if (!revealedCards[card.id]) {
                    send('REVEAL', card);
                  }
                }}
              />
            ))}
          </div>
        </div>
      );
      break;
    case 'winning':
    case 'waitWinning': {
      gameRender = () => (
        <div>Winner ! Sauvegarde de la partie en cours ...</div>
      );
      break;
    }
    case 'won':
      gameRender = () => (
        <div>
          Well done ! <br />
          <button className={button} onClick={() => send('RETRY')}>
            Recommencer ?
          </button>
        </div>
      );
      break;
    case 'lost':
      gameRender = () => (
        <div>
          Times Up! Perdu ... :( <br />
          <button className={button} onClick={() => send('RETRY')}>
            Recommencer ?
          </button>
        </div>
      );
      break;
  }
  return (
    <div className="game-container">
      <div className="leaderboard">
        <Leaderboard parties={state.context.parties} />
      </div>
      <div className="timer">
        <div className="time">{timeRender()} </div>
        <div className="progress">
          <Progress value={state.context.progress} />
        </div>
      </div>
      <div className="game">{gameRender()}</div>
    </div>
  );
};
