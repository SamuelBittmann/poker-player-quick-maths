import { IGameState, cardValue, ICard, Rank, Suit } from "./gamestate";
import { Hand } from "./hands";

class PokerCard implements ICard {
  rank: Rank;
  suit: Suit;
  isHole: boolean
  constructor(card: ICard, isHole: boolean) {
    this.rank = card.rank;
    this.suit = card.suit;
    this.isHole = isHole;
  }
  holeCardNum(): number {
    return this.isHole ? 1 : 0;
  }
}
class PokerHand {
  hand: Hand;
  numHoleCards: number
}

function detectBestHand(hole_cards: ICard[], community_cards: ICard[]): PokerHand {
  const allCards = hole_cards.map(c => new PokerCard(c, true) ).concat(community_cards.map(c => new PokerCard(c, false) ));

  let pokerHands: PokerHand[] = [];
  let last1 : PokerCard | null = null
  let last2 : PokerCard | null = null
  allCards.sort((l, r) => cardValue(l) - cardValue(r));
  allCards.forEach(v => {
      if(cardValue(last1) == cardValue(v)) {
        pokerHands.push({hand: Hand.Pair, numHoleCards: last1.holeCardNum() + v.holeCardNum()});
      }
      last1 = v;
    });
  
  allCards.forEach(v => {
    if(cardValue(last1) == cardValue(v) && cardValue(last2) == cardValue(v)) {
      pokerHands.push({hand: Hand.ThreeOfAKind, numHoleCards: last1.holeCardNum() + last2.holeCardNum() + v.holeCardNum()});
    }
    last1 = v;
  });

  console.error("Poker hands: ", pokerHands);
  pokerHands.sort((l,r) => 
    l.hand - r.hand
  );

  pokerHands = pokerHands.filter(h => h.numHoleCards >= 1);

  
  if(pokerHands.length === 0) {
    return { hand: Hand.HighCard, numHoleCards: 1 }
  }
  return pokerHands[pokerHands.length - 1];
}

function bet(gameState: IGameState): number {
  const me = gameState.players[gameState.in_action];
  if (me.hole_cards && me.hole_cards.length === 2) {
    const bestHand = detectBestHand(me.hole_cards, gameState.community_cards);
    console.error("bestHand: ", bestHand);
    if (bestHand.hand === Hand.ThreeOfAKind) {
      console.error("RAISE min 300 because of 3 of a kind");
      return Math.max(300, gameState.current_buy_in);
    } else if (bestHand.hand === Hand.Pair) {
      console.error("RAISE min 100 because of 2 of a kind");
      return Math.max(100, gameState.current_buy_in);
    } else {
      const sum = cardValue(me.hole_cards[0]) + cardValue(me.hole_cards[1]);
      if (sum > 16) {
        if(gameState.current_buy_in > me.stack * 0.5) {
          console.error("FOLD! too rich for us");
          return 0;
        }
        else {
          console.error("CALL because of high cards");
          return gameState.current_buy_in;
        }
      } else {
        console.error("FOLD because of low cards");
        return 0;
      }
    }
  } else {
    console.error("CALL (blind)");
    return gameState.current_buy_in;
  }
}

export class Player {
  public betRequest(
    gameState: IGameState,
    betCallback: (bet: number) => void
  ): void {
    const ourBet = bet(gameState);
    console.error("BET: ", ourBet);
    betCallback(ourBet);
  }

  public showdown(gameState: IGameState): void {}
}

export default Player;
