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

    this.activeCamera = new Camera(0, 0, 1);
    this.cameras = [this.activeCamera];

    // Add event handlers
    document.addEventListener('keydown', this);
    document.addEventListener('keyup', this);
  }

  handleEvent(event) {
    console.log(event.type);
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
      let sprite = this.sprites[i];
      this.activeCamera.draw(this.ctx,
          sprite.src, sprite.sx, sprite.sy, sprite.sWidth, sprite.sHeight,
          sprite.x, sprite.y, sprite.width, sprite.height);
    }
  }

  changeCamera(cameraNumber) {
    this.activeCamera = this.cameras[cameraNumber];
  }

  zoomCamera(zoomFactor) {
    this.activeCamera.changeZoom(zoomFactor);
  }
}

class Sprite {
  constructor(x, y, width, height,
      imgSrc,
      {scale = 1, visible = true, depth = 0, sx = 0, sy = 0, sWidth = width, sHeight = height, dx = 0, dy = 0}) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.sx = sx;
    this.sy = sy;
    this.sWidth = sWidth;
    this.sHeight = sHeight;
    this.scale = scale;
    this.visible = visible;

    this.src = new Image();
    this.src.src = imgSrc;
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
  /**
   * Creates a camera object to control which part of the screen is displayed
   * @param {Number} x         Starting left edge of camera
   * @param {Number} y         Starting right edge of camera
   * @param {Number} [zoom=1]  Starting zoom
   */
  constructor(x, y, zoom = 1) {
    this.x = x;
    this.y = y;
    this.zoom = zoom;
  }

  draw(ctx, src, sx, sy, sWidth, sHeight, x, y, width, height) {
    x = (x - this.x);
    y = (y - this.y);
    width = (width * this.zoom);
    height = (height * this.zoom);

    ctx.drawImage(src,
        sx, sy, sWidth, sHeight,
        x, y, width, height);
  }

  changeZoom(zoomFactor = 'reset') {
    if(typeof zoomFactor == 'number')
      this.zoom *= zoomFactor;
    else if(zoomFactor == 'reset')
      this.zoom = 1;
  }

  move() {

  }
}
