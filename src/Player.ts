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

export class Player {
  public betRequest(
    gameState: IGameState,
    betCallback: (bet: number) => void
  ): void {
    const me = gameState.players[gameState.in_action];
    if (me.hole_cards && me.hole_cards.length === 2) {
      const bestHand = detectBestHand(me.hole_cards, gameState.community_cards);

      if (bestHand === Hand.ThreeOfAKind) {
        betCallback(Math.max(300, gameState.current_buy_in));
      } else if (bestHand === Hand.Pair) {
        betCallback(Math.max(100, gameState.current_buy_in));
      } else {
        const sum = cardValue(me.hole_cards[0]) + cardValue(me.hole_cards[1]);
        if (sum > 16) {
          if(gameState.current_buy_in > me.stack * 0.5) {
            betCallback(0);
          }
          else {
            betCallback(gameState.current_buy_in);
          }
        } else {
          betCallback(0);
        }
      }
    } else {
      betCallback(gameState.current_buy_in);
    }
  }

  public showdown(gameState: IGameState): void {}
}

export default Player;
