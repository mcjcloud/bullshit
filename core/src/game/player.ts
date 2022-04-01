import { Agent } from "../interface/agent";
import { Card, Rank, Suit } from "../deck";

export class Player {
  private agent: Agent;
  private hand: Card[];
  private faceDown: Card[];
  private faceUp: Card[];

  constructor(agent: Agent, faceDown: Card[], faceUp: Card[], hand: Card[]) {
    this.agent = agent;
    this.faceDown = faceDown;
    this.faceUp = faceUp;
    this.hand = hand;
  }

  deal(cards: Card[]) {
    for (const card of cards) {
      this.hand.push(card);
    }
  }

  getRemainingFaceDown(): number {
    return this.faceDown.length;
  }

  getFaceUp(): Card[] {
    return [...this.faceUp];
  }

  getHand(): Card[] {
    return [...this.hand];
  }

  getRemainingHand(): number {
    return this.hand.length;
  }

  getTotalRemainder(): number {
    return this.hand.length + this.faceUp.length + this.faceDown.length;
  }

  takeTurn(top: Card | undefined): Card | undefined {
    let move;
    do {
      move = this.agent.playCard(
        this.getHand(),
        this.getFaceUp(),
        this.getRemainingFaceDown()
      );
      if (!move) {
        return undefined;
      }
    } while (!this.moveIsValid(top, move));

    if (isNa(move)) {
      move = this.faceDown.shift();
    }
    this.hand = this.hand.filter((c) => !match(c, move));
    this.faceUp = this.faceUp.filter((c) => !match(c, move));
    this.faceDown = this.faceDown.filter((c) => !match(c, move));

    return move;
  }

  private moveIsValid(top: Card | undefined, move: Card | undefined): boolean {
    // if the hand and faceup aren't empty, ensure the move from undefined
    if ((isNa(move) && this.hand.length > 0) || this.faceUp.length > 0) {
      return false;
    }
    // if the hand isn't empty, ensure the move is from the hand
    if (
      move &&
      this.hand.length > 0 &&
      !this.hand.some((c) => match(c, move))
    ) {
      return false;
    }
    // if the faceup isn't empty, ensure the move is from faceup
    if (
      move &&
      this.faceUp.length > 0 &&
      !this.faceUp.some((c) => match(c, move))
    ) {
      return false;
    }
    if (move && move.rank < top.rank) {
      return false;
    }
    return true;
  }
}

function match(c1: Card, c2: Card): boolean {
  return c1.rank === c2.rank && c1.suit === c2.suit;
}

function isNa(c: Card): boolean {
  return c.rank === Rank.NA || c.suit === Suit.NA;
}
