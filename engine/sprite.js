class Sprite {
  static sprites = [];
  /**
   * Create a sprite object for display
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

  /**
   * Adjust the coordinates of the sprite based on current velocity
   */
  move() {
    this.x += this.dx;
    this.y += this.dy;
  }

  /**
  * Change the sprite's velocity
   * @param {Number} dx  x velocity
   * @param {Number} dy  y velocity
   */
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

  /**
   * Changes which spritesheet row to animate through
   * @param  {Number} id The animation id (row #)
   */
  updateAnimation(id) {
    this.sy = id * this.sHeight;
  }

  /**
   * Change which frame of the animation to show if enough time passed
   */
  nextFrame() {
    if(this.lastUpdate + ((1 / this.fps) * 1000) > (new Date()).getTime()) return;

    this.sx += this.sWidth;
    if(this.sx >= this.sheetWidth) this.sx = 0;
    this.lastUpdate = (new Date()).getTime();
  }

  /**
   * Draw the sprite onscreen, update animation frame
   * @param  {Object} ctx     canvas drawing context
   * @param  {Number} offsetX camera offset (x-axis)
   * @param  {Number} offsetY camera offset (y-axis)
   * @param  {Number} zoom    scale to draw sprite
   */
  draw(ctx, offsetX, offsetY, zoom) {
    let x = (this.x - offsetX);
    let y = (this.y - offsetY);
    let width = (this.width * zoom);
    let height = (this.height * zoom);

    ctx.drawImage(
        this.src,
        this.sx, this.sy, this.sWidth, this.sHeight,
        x, y, width, height);

    this.nextFrame();
  }
}
