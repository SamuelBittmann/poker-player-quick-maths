import { hasJSDocParameterTags } from "typescript";
import { IGameState, cardValue, ICard } from "./gamestate";
import { Hand } from "./hands";

function detectBestHand(hole_cards: ICard[], community_cards: ICard[]): Hand {
  var allCards = hole_cards.concat(community_cards);

  var res = allCards
    .sort((l, r) => cardValue(l) - cardValue(r))
    .reduce(
      (accu, v) => ({
        last1: cardValue(v),
        last2: accu.last1,
        hasPair: accu.hasPair || accu.last1 === cardValue(v),
        hasThreeOfAKind:
          accu.hasThreeOfAKind ||
          (accu.last1 === cardValue(v) && accu.last2 === cardValue(v)),
      }),
      { last1: -1, last2: -2, hasPair: false, hasThreeOfAKind: false }
    );

  if (res.hasThreeOfAKind) {
    return Hand.ThreeOfAKind;
  } else if (res.hasPair) {
    return Hand.Pair;
  } else {
    return Hand.HighCard;
  }
}

function bet(gameState: IGameState): number {
  const me = gameState.players[gameState.in_action];
  if (me.hole_cards && me.hole_cards.length === 2) {
    const bestHand = detectBestHand(me.hole_cards, gameState.community_cards);
    console.error("bestHand: ", bestHand);
    if (bestHand === Hand.ThreeOfAKind) {
      console.error("RAISE min 300 because of 3 of a kind");
      return Math.max(300, gameState.current_buy_in);
    } else if (bestHand === Hand.Pair) {
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
