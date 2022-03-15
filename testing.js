let game = new GameEngine(loopMe);
let player = new Sprite(0, 100, 20, 32, 'player1.png', {dx: 10});
game.addSprite(player);

function loopMe() {
  player.move();
  game.zoomCamera(2);
  if(player.x > 100) game.stop();
}

game.start();
