import { Card } from "../deck";

export interface Runtime {
  cardPlayed(card: Card);
  cardDrawn(player: number);
  discardedPickedUp(discarded: Card[], player: number);
  discardedCleared(discarded: Card[]);
  turnMoved(player: number);
  gameOver(winner: number);
}

export const DEFAULT_RUNTIME = {
  cardPlayed(card: Card) {},
  cardDrawn(player: number) {},
  discardedPickedUp(discarded: Card[], player: number) {},
  discardedCleared(discarded: Card[]) {},
  turnMoved(player: number) {},
  gameOver(winner: number) {},
};
