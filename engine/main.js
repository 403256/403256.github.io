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

    this.cameras = [];
    this.addCamera(0, 0, 1);
    this.activeCamera = this.cameras[0];

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
    let camera = new Camera(this.ctx, this.canvas.width, this.canvas.height, x, y, zoom);
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
      imgSrc, sheetWidth, sheetDepth,
      {scale = 1, visible = true, depth = 0, angle = 0, fps = 30,
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
    this.sheetWidth = sheetWidth;
    this.sheetDepth = sheetDepth;
    this.fps = fps;
    this.lastUpdate = (new Date()).getTime();
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

  updateAnimation(id) {
    this.sy = id * this.sHeight;
  }

  updateFrame() {
    if(this.lastUpdate + (this.fps * 1000) > (new Date()).getTime()) return;

    this.sx += this.sWidth;
    if(this.sx > this.sheetWidth) this.sx = 0;
    this.lastUpdate = (new Date()).getTime();
  }

  draw(ctx, offsetX, offsetY, zoom) {
    let x = (this.x - offsetX);
    let y = (this.y - offsetY);
    let width = (this.width * zoom);
    let height = (this.height * zoom);

    ctx.drawImage(
        this.src,
        this.sx, this.sy, this.sWidth, this.sHeight,
        x, y, width, height);

    this.updateFrame();
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
  constructor(ctx, width, height, x, y, zoom = 1) {
    this.ctx = ctx;

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.zoom = zoom;
  }

  changeZoom(zoomFactor = 'reset') {
    if(typeof zoomFactor == 'number')
      this.zoom *= zoomFactor;
    else if(zoomFactor == 'reset')
      this.zoom = 1;
  }

  moveToCenter(object) {
    let x = object.x + (object.width / 2);
    let y = object.y + (object.width / 2);

    x -= this.width / 2;
    y -= this.height / 2;

    this.x = x;
    this.y = y;
  }

  drawScreen() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    let length = Sprite.sprites.length;
    for(let i = 0; i < length; i++) {
      Sprite.sprites[i].draw(this.ctx, this.x, this.y, this.zoom);
    }
  }
}
