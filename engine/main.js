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

    this.activeCamera = new Camera(this.ctx, 0, 0, 1);
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
    this.activeCamera.drawScreen();
    this.update();
  }

  addCamera(x, y, zoom) {
    let camera = new Camera(this.ctx, x, y, zoom);
    return this.cameras.push(camera) - 1;
  }

  changeCamera(cameraID) {
    this.activeCamera = this.cameras[cameraID];
  }

  zoomCamera(zoomFactor) {
    this.activeCamera.changeZoom(zoomFactor);
  }
}

class Sprite {
  static sprites = [];
  /**
   * Creates a sprite object for display
   * @param {Number}  x                 x-value in game map
   * @param {Number}  y                 y-value in game map
   * @param {Number}  width             sprite's default display width
   * @param {Number}  height            sprite's default display height
   * @param {Image}   imgSrc            The image object to display
   * @param {Number}  [scale=1]         sprite's display scale
   * @param {Boolean} [visible=true]    whether to display the sprite
   * @param {Number}  [depth=0]         sprite's display ordering
   * @param {Number}  [angle=0]         sprite's display angle (degrees)
   * @param {Number}  [sx=0]            spritesheet's x-value
   * @param {Number}  [sy=0]            spritesheet's y-value
   * @param {Number}  [sWidth=width]    spritesheet's sprite width
   * @param {Number}  [sHeight=height]  spritesheet's sprite height
   * @param {Number}  [dx=0]            object's x velocity
   * @param {Number}  [dy=0}]           object's y velocity
   */
  constructor(x, y, width, height,
      imgSrc,
      {scale = 1, visible = true, depth = 0, angle = 0,
          sx = 0, sy = 0, sWidth = width, sHeight = height,
          dx = 0, dy = 0}) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.sx = sx;
    this.sy = sy;
    this.sWidth = sWidth;
    this.sHeight = sHeight;
    this.scale = scale;
    this.angle = angle;
    this.visible = visible;

    this.src = new Image();
    this.src.src = imgSrc;
    this.depth = depth;

    this.dx = dx;
    this.dy = dy;

    Sprite.sprites.push(this);
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;
  }

  setVelocity(dx, dy) {
    this.dx = dx;
    this.dy = dy;
  }

  /**
   * Rotate the sprite when displaying (cumulative, does NOT reset)
   * @param {Number} angle The number of degrees to rotate
   */
  rotate(angle) {
    this.angle += angle;
  }

  destroy() {

  }
}

class Camera {
  /**
   * Creates a camera object to control which part of the screen is displayed
   * @param {Number} x         Starting left edge of camera
   * @param {Number} y         Starting right edge of camera
   * @param {Number} [zoom=1]  Starting zoom
   */
  constructor(ctx, x, y, zoom = 1) {
    this.ctx = ctx;

    this.x = x;
    this.y = y;
    this.zoom = zoom;
  }

  changeZoom(zoomFactor = 'reset') {
    if(typeof zoomFactor == 'number')
      this.zoom *= zoomFactor;
    else if(zoomFactor == 'reset')
      this.zoom = 1;
  }

  move() {

  }

  drawScreen() {
    let length = Sprite.sprites.length;
    for(let i = 0; i < length; i++) {
      let sprite = Sprite.sprites[i];
      let x = (sprite.x - this.x);
      let y = (sprite.y - this.y);
      let width = (sprite.width * this.zoom);
      let height = (sprite.height * this.zoom);

      this.ctx.drawImage(
          sprite.src,
          sprite.sx, sprite.sy, sprite.sWidth, sprite.sHeight,
          x, y, width, height);
    }
  }
}
