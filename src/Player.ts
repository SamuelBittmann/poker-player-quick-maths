import { IGameState, cardValue, ICard, Rank, Suit } from "./gamestate";
import { Hand, PokerCard, PokerHand } from "./hands";

function holeCardSum(cards:PokerCard[]) {
  return cards.reduce((accu, v) => v.holeCardNum() + accu, 0);
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

  var cardsBySuit = allCards.reduce((accu, v) => {
    if (typeof accu[v.suit] === 'undefined') {
      accu[v.suit] = [];
    }

    accu[v.suit].push(v)

    return accu;
  }, { });

  var flushes: PokerCard[][] = Object.keys(cardsBySuit).map(k => cardsBySuit[k]).filter(cards => cards.length >= 5);
  if (flushes.length > 0) {
    pokerHands.push({ hand: Hand.Flush, numHoleCards: holeCardSum(flushes[0]) });

    const longestSeries = flushes[0].map(c => cardValue(c)).sort().reduce((accu, v) => {
      var res = v - accu.last === 1 ? { series: [ ...accu.series, v ], last: v } : { series: [ v ], last: v };
      return res;
    }, { series: [], last: 0 }).series;
    if (longestSeries.length >= 5) {
      pokerHands.push({hand: Hand.StraightFlush, numHoleCards: holeCardSum(longestSeries) });
    }
  }

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
    if (bestHand.hand === Hand.ThreeOfAKind || bestHand.hand == Hand.Straight || bestHand.hand == Hand.Flush || bestHand.hand == Hand.StraightFlush) {
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
