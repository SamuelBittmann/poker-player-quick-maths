import { IGameState } from "./gamestate";

export class Player {
  public betRequest(gameState: IGameState, betCallback: (bet: number) => void): void {
    betCallback(gameState.current_buy_in);
  }

  public showdown(gameState: any): void {

  }
};

export default Player;
  