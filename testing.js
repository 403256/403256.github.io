let game = new GameEngine(loopMe);
let player = new Sprite(0, 0, 20, 32, 'imgs/player1.png', 80, 60, {dx: 10});
game.addMap(new Map('grassBiome.json', 64, 64, 8, 8));

function loopMe() {
  player.move();
  game.activeCamera.moveToCenter(player);
  if(player.x > 1000) game.stop();
}

game.start()
