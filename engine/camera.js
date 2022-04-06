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

  /**
   * Zoom in/ zoom out from screen center
   * @param  {Number|String} [zoomFactor='reset'] How far to zoom in/out
   */
  changeZoom(zoomFactor = 'reset') {
    if(typeof zoomFactor == 'number')
      this.zoom *= zoomFactor;
    else if(zoomFactor == 'reset')
      this.zoom = 1;
  }

  /**
   * center the camera around an object
   * @param {Object} object the object to center around
   * @param {number} object.x the object's x coordinate
   * @param {number} object.y the object's y coordinate
   * @param {number} object.width the object's pixel width
   * @param {number} object.height the object's pixel height
   */
  moveToCenter(object) {
    let x = object.x + (object.width / 2);
    let y = object.y + (object.width / 2);

    x -= this.width / 2;
    y -= this.height / 2;

    this.x = x;
    this.y = y;
  }

  /**
   * completely fill the screen with sprites in camera's view
   */
  drawScreen(map) {
    this.ctx.clearRect(0, 0, this.width, this.height);

    map.draw();

    let length = Sprite.sprites.length;
    for(let i = 0; i < length; i++) {
      Sprite.sprites[i].draw(this.ctx, this.x, this.y, this.zoom);
    }
  }
}
