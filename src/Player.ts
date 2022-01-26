export class Player {
  public betRequest(gameState: any, betCallback: (bet: number) => void): void {
    betCallback(10);
  }

  public showdown(gameState: any): void {

  }
};

export default Player;
  