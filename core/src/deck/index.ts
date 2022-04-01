export enum Suit {
  NA = "NA",
  CLUB = "CLUB",
  HEART = "HEART",
  SPADE = "SPADE",
  DIAMOND = "DIAMOND",
}

export enum Rank {
  NA = 0,
  ACE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
  SIX = 6,
  SEVEN = 7,
  EIGHT = 8,
  NINE = 9,
  TEN = 10,
  JACK = 11,
  QUEEN = 12,
  KING = 13,
}

export interface Card {
  suit: Suit;
  rank: Rank;
}

export interface Deck {
  draw(n: number): Card[];
  discard(c: Card);
  getDiscarded(): Card[];
  clearDiscarded(): void;
  shuffle(): void;
  getRemainder(): number;
}
