let player = new Sprite(0, 0, 20, 32, 'imgs/player1.png', 80, 60, {});
player.move = () => {
  player.dx += player.ax;
  player.dy += player.ay;

  player.x += player.dx +
      (game.keysPressed.includes('ArrowRight') ? 10 : 0) -
      (game.keysPressed.includes('ArrowLeft') ? 10 : 0);
  player.y += player.dy;

  player.correctCollision();
}

game.initial(loopMe);
game.addMap(new Map('grassBiome.json', 64, 64, 8, 8));

function loopMe() {
  player.move();
  game.activeCamera.moveToCenter(player);
  if(player.x > 1000) game.stop();
}

game.start()
