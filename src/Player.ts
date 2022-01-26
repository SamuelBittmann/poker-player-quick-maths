import { IGameState, cardValue } from "./gamestate";

export class Player {
  public betRequest(gameState: IGameState, betCallback: (bet: number) => void): void {
    const me = gameState.player[gameState.in_action];
    if(me.hole_cards && me.hole_cards.length === 2) {
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
  