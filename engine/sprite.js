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
    this.ax = 0;
    this.ay = 0.25;

    this.collider = null;
    this.setCollider('rectangle');

    Sprite.sprites.push(this);
  }

  /**
   * Adjust the coordinates of the sprite based on current velocity
   */
  move() {
    this.dx += this.ax;
    this.dy += this.ay;
    this.x += this.dx;
    this.y += this.dy;

    this.correctCollision();
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

  setAcceleration(ax, ay) {
    this.ax = ax;
    this.ay = ay;
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
   * @param  {Number} offsetX camera offset (x-axis)
   * @param  {Number} offsetY camera offset (y-axis)
   * @param  {Number} zoom    scale to draw sprite
   */
  draw(offsetX, offsetY, zoom) {
    let x = (this.x - offsetX);
    let y = (this.y - offsetY);
    let width = (this.width * zoom);
    let height = (this.height * zoom);

    game.ctx.drawImage(
        this.src,
        this.sx, this.sy, this.sWidth, this.sHeight,
        x, y, width, height);

    this.nextFrame();
  }

  setCollider(shape) {
    switch (shape) {
      case "ellipse":
        this.collider = angle => Math.sqrt(
            (this.width / 2)**2 * Math.cos(angle)**2 +
            (this.height / 2)**2 * Math.sin(angle)**2
        );
        break;

      case "rectangle":
        this.collider = angle => {
          angle = angle % Math.PI;

          let h = Math.abs(Math.tan(angle) * this.width / 2);
          // let w = Math.abs(this.height / 2 / Math.tan(angle));

          if(h > this.height / 2) {
            // top or bottom edge
            return (this.height / 2) * Math.sin(Math.PI / 2) / Math.sin(angle);
          } else if (angle < Math.PI / 2){
            // left edge
            return (this.width / 2) * Math.sin(Math.PI / 2) / Math.sin(Math.PI / 2 - angle);
          } else {
            // right edge
            return (this.width / 2) * Math.sin(Math.PI / 2) / Math.sin(angle - Math.PI / 2);
          }
        }
        break;
      default:
        throw Error(`Invalid collider shape: ${shape}`);
    }
  }

  isTouching(sprite) {
    const x = (this.x + this.width / 2) - (sprite.x + sprite.width / 2);
    const y = (this.y + this.height / 2) - (sprite.y + sprite.height / 2);

    const angle = Math.atan(y / x);
    const dist = Math.sqrt(x**2 + y**2);

    const minDistS1 = this.collider(angle);
    const minDistS2 = sprite.collider(angle);

    return Math.abs(minDistS1) + Math.abs(minDistS2) > dist;
  }

  /**
   * check if the sprite is colliding with the landscape
   * WARNING -- RELIES ON MAP LAYER TITLED 'barriers'
   * @return {boolean} whether the sprite is embedded in the landscape
   */
  correctCollision() {
    const q1 = Math.floor(this.x / game.currentMap.tileWidth) +
        Math.floor(this.y / game.currentMap.tileHeight) *
          game.currentMap.widthInTiles;
    const q2 = Math.floor((this.x + this.width) / game.currentMap.tileWidth) +
        Math.floor(this.y / game.currentMap.tileHeight) *
          game.currentMap.widthInTiles;
    const q3 = Math.floor(this.x / game.currentMap.tileWidth) +
        Math.floor((this.y + this.height) / game.currentMap.tileHeight) *
          game.currentMap.widthInTiles;
    const q4 = Math.floor((this.x + this.width) / game.currentMap.tileWidth) +
        Math.floor((this.y + this.height) / game.currentMap.tileHeight) *
          game.currentMap.widthInTiles;

    const tl = game.currentMap.checkTile('barriers', q1);
    const tr = game.currentMap.checkTile('barriers', q2);
    const bl = game.currentMap.checkTile('barriers', q3);
    const br = game.currentMap.checkTile('barriers', q4);
    if (tl > 0 && tr > 0) {
      // top
      this.y += game.currentMap.tileHeight - this.y % game.currentMap.tileHeight;
      this.dy = 0;
    } else if (bl > 0 && br > 0) {
      // bottom
      this.y -= this.y % game.currentMap.tileHeight -
          (game.currentMap.tileHeight - this.height);
      this.dy = 0;
    } else if (tl > 0 && bl > 0) {
      // left
      this.x -= this.x % game.currentMap.tileWidth -
          (game.currentMap.tileWidth - this.width);
      this.dx = 0;
    } else if (tr > 0 && br > 0) {
      // right
      this.x += game.currentMap.tileWidth - this.x % game.currentMap.tileWidth;
      this.dx = 0;
    }

    return false;
  }
}
