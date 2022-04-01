let game = new GameEngine(loopMe);
let player = new Sprite(0, 100, 20, 32, 'player1.png', 80, 60, {dx: 10});

function loopMe() {
  player.move();
  game.activeCamera.moveToCenter(player);
  if(player.x > 1000) game.stop();
}

window.addEventListener('load', game.start.bind(game));
