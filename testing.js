let game = new GameEngine(loopMe);
let player = new Sprite(0, 100, 10, 30, '#98ff98', {dx: 10});
game.addSprite(player);

function loopMe() {
  player.move();
  if(player.x > 100) game.stop();
}

game.start();
