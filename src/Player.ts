import { hasJSDocParameterTags } from "typescript";
import { IGameState, cardValue, ICard } from "./gamestate";

enum Hand {
  HighCard,
  Pair
}

function detectBestHand(hole_cards: ICard[], community_cards: ICard[]): Hand {
  var allCards = hole_cards.concat(community_cards);

  var res = allCards
    .sort((l, r) => cardValue(l) - cardValue(r))
    .reduce((accu, v) => ({ last: cardValue(v), hasPair: accu.hasPair || accu.last === cardValue(v) }), { last: -1, hasPair: false });

  return res.hasPair
    ? Hand.Pair
    : Hand.HighCard;
}

export class Player {
  public betRequest(gameState: IGameState, betCallback: (bet: number) => void): void {
    const me = gameState.players[6];
    if(me.hole_cards && me.hole_cards.length === 2) {
      if (detectBestHand(me.hole_cards, gameState.community_cards) === Hand.Pair) {
        betCallback(Math.max(100, gameState.current_buy_in));
        return;
      }

      const sum = cardValue(me.hole_cards[0]) + cardValue(me.hole_cards[1]);
      if(sum > 11) {
        betCallback(gameState.current_buy_in);
      } else {
        betCallback(0);
      }
    } else {      
      betCallback(gameState.current_buy_in);
    }
  }

  public showdown(gameState: IGameState): void {

  }
};

export default Player;
  