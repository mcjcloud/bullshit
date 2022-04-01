import { Card, Deck, Rank, Suit } from ".";

export class CardDeck implements Deck {
  private stack: Card[];
  private discarded: Card[];

  constructor(shuffled = true) {
    this.stack = [];

    for (const suit of Object.keys(Suit)) {
      for (let rank = 1; rank <= 13; rank++) {
        this.stack.push({
          suit: Suit[suit],
          rank,
        } as Card);
      }
    }

    if (shuffled) {
      this.shuffle();
    }
  }

  draw(n: number): Card[] {
    let result = [];
    for (let i = 0; i < n; i++) {
      if (this.getRemainder() <= 0) {
        this.stack = [...this.discarded];
        this.shuffle();
      }
      if (this.getRemainder() <= 0) {
        break;
      }
      result.push(this.stack.shift());
    }
    return result;
  }

  discard(card: Card) {
    this.discarded.push(card);
  }

  getDiscarded(): Card[] {
    return [...this.discarded];
  }

  clearDiscarded(): void {
    this.discarded = [];
  }

  shuffle(): void {
    let currentIndex = this.stack.length,
      randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [this.stack[currentIndex], this.stack[randomIndex]] = [
        this.stack[randomIndex],
        this.stack[currentIndex],
      ];
    }
  }
  getRemainder(): number {
    return this.stack.length;
  }
}
