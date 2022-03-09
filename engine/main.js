class GameEngine {
  constructor(
      updateFctn,
      canvasParent = document.body) {
    // Create canvas element for game
    this.canvas = document.createElement('CANVAS');
    this.canvas.width = 1000;
    this.canvas.height = 750;
    this.canvas.style.background = '#222';
    this.canvas.style.position = 'absolute';
    this.canvas.style.left = '50%';
    this.canvas.style.top = '50%';
    this.canvas.style.transform = 'translate(-50%, -50%)';
    canvasParent.appendChild(this.canvas);

    // Get canvas context for drawing on canvas
    this.ctx = this.canvas.getContext('2d');

    this.update = updateFctn;

    this.sprites = [];
  }

  start() {
    this.animation = requestAnimationFrame(this.loop.bind(this));
  }

  stop() {
    cancelAnimationFrame(this.animation);
  }

  loop() {
    this.animation = requestAnimationFrame(this.loop.bind(this));
    this.draw();
    this.update();
  }

  addSprite(sprite) {
    this.sprites.push(sprite);
  }

  draw() {
    let length = this.sprites.length;
    for(let i = 0; i < length; i++) {
      let sprite = this.sprites[i]
      this.ctx.fillStyle = sprite.imgSrc;
      this.ctx.fillRect(sprite.x, sprite.y, sprite.width, sprite.height);
    }
  }
}

class Sprite {
  constructor(x, y, width, height,
      imgSrc,
      {scale = 1, visible = true, depth = 0, dx = 0, dy = 0}) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.scale = scale;
    this.visible = visible;

    this.imgSrc = imgSrc;
    this.depth = depth;

    this.dx = dx;
    this.dy = dy;
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;
  }
}

class Camera {
  constructor(x, y, zoom = 1) {
    this.x = x;
    this.y = y;
    this.zoom = zoom;
  }

  move() {

  }

  off() {

  }

  on() {

  }
}
