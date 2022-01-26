import { Player } from "../src/Player"
import gameState from "./gameStateMock"


describe("Player", () => {
  console.log('test');
  it("should bet request", () => {
    const player = new Player();

    expect(player.betRequest(gameState, () => 0)).toBeUndefined()
  })
})