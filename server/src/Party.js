class Card {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
  isMatching(card) {
    return this.name === card.name;
  }
}
class Party {
  static REVEAL_RESPONSE = {
    WIN: 1,
    ALREADY_REVEALED: 2,
    MATCH: 3,
    NOT_MATCH: 4,
    REVEALED: 5,
  };
  constructor(cards) {
    this.id = parseInt(Math.random() * 10000);
    this.cards = Object.keys(cards).reduce(
      (acc, cardId) => ({
        ...acc,
        [cardId]: new Card(cardId, cards[cardId].name),
      }),
      {},
    );
    this.revealedCards = {};
    this.lastRevealedCard = null;
    this.started = false;
    this.stopped = false;
    this.startedTime = 0;
    this.stoppedTime = 0;
  }

  start() {
    this.started = true;
    this.startedTime = Date.now();
  }

  stop() {
    this.started = false;
    this.stoppedTime = Date.now();
    this.stopped = true;
  }

  get elapsedTime() {
    return this.stoppedTime - this.startedTime;
  }

  getCard(cardId) {
    return this.cards[cardId];
  }

  reveal(cardId) {
    const currentCard = this.cards[cardId];
    if (currentCard) {
      if (this.revealedCards[cardId]) {
        return Party.REVEAL_RESPONSE.ALREADY_REVEALED;
      }
      this.revealedCards[cardId] = true;
      if (this.lastRevealedCard) {
        if (this.lastRevealedCard.isMatching(this.cards[cardId])) {
          if (this.isOver()) {
            return Party.REVEAL_RESPONSE.WIN;
          }
          this.lastRevealedCard = null;
          return Party.REVEAL_RESPONSE.MATCH;
        } else {
          this.revealedCards[this.lastRevealedCard.id] = false;
          this.revealedCards[cardId] = false;
          this.lastRevealedCard = null;
          return Party.REVEAL_RESPONSE.NOT_MATCH;
        }
      } else {
        this.lastRevealedCard = currentCard;
        this.revealedCards[cardId] = true;
        return Party.REVEAL_RESPONSE.REVEALED;
      }
    }
    return 'WAT IS THIS ID ?';
  }

  isOver() {
    return !Object.keys(this.cards).some(
      (cardId) => !this.revealedCards[cardId],
    );
  }

  toJSON() {
    return {
      id: this.id,
      cards: this.cards,
    };
  }
}

module.exports = Party;
