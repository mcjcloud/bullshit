import { Agent } from "../interface/agent";
import { Deck, Rank } from "../deck";
import { CardDeck } from "../deck/card-deck";
import { Player } from "./player";
import { DEFAULT_RUNTIME, Runtime } from "../interface/runtime";

export class Bullshit {
  private deck: Deck;
  private players: Player[];
  private turn: number;
  private runtime: Runtime;
  private winner: number | undefined = undefined;

  constructor(
    numPlayers: number,
    agents: Agent[],
    runtime: Runtime = DEFAULT_RUNTIME
  ) {
    // TODO: later make it such that extra players just reduce
    // the number of cards in hand
    if (numPlayers > 4) {
      throw new Error("Max 4 players");
    }
    if (agents.length !== numPlayers) {
      throw new Error("number of agents must match number of players");
    }

    this.runtime = runtime;
    this.deck = new CardDeck();

    this.players = [];
    for (let i = 0; i < numPlayers; i++) {
      this.players.push(
        new Player(
          agents[i],
          this.deck.draw(4),
          this.deck.draw(4),
          this.deck.draw(5)
        )
      );
    }

    this.turn = 0;
  }

  takeTurn() {
    const player = this.players[this.turn];
    const discarded = this.deck.getDiscarded();
    const move = player.takeTurn(discarded[discarded.length - 1]);
    if (!move) {
      player.deal(discarded);
      this.deck.clearDiscarded();
      this.runtime.discardedPickedUp(discarded, this.turn);
      this.moveTurn();
      return;
    }

    // discard the move
    this.deck.discard(move);
    this.runtime.cardPlayed(move);

    // If a 10 is played, clear the pile
    if (move.rank === Rank.TEN) {
      this.deck.clearDiscarded();
      this.runtime.discardedCleared([...discarded, move]);
    }

    // If four of the same rank are played in sequence, clear pile
    const lastFour = discarded.slice(discarded.length - 4);
    let matches = true;
    for (let i = 1; i < 4; i++) {
      if (lastFour[i].rank !== lastFour[i - 1].rank) {
        matches = false;
        break;
      }
    }
    if (matches) {
      this.deck.clearDiscarded();
      this.runtime.discardedCleared([...discarded, move]);
    }

    // If the player is out of cards, they win
    if (player.getTotalRemainder() === 0) {
      this.winner = this.turn;
      this.runtime.gameOver(this.winner);
      return;
    }

    // Next turn
    this.moveTurn();
  }

  getWinner(): number | undefined {
    return this.winner;
  }

  private moveTurn() {
    this.turn = (this.turn + 1) % this.players.length;
    this.runtime.turnMoved(this.turn);
  }
}
