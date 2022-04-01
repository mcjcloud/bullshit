import { Card } from "../deck";

export interface Agent {
  // returning undefined means no move was available
  playCard(hand: Card[], faceUp: Card[], numFaceDown: number): Card | undefined;
}
