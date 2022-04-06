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
    this.maps = [];

    this.cameras = [];
    this.addCamera(0, 0, 1);
    this.activeCamera = this.cameras[0];

    // Add event handlers
    document.addEventListener('keydown', this);
    document.addEventListener('keyup', this);
  }

  handleEvent = (event) => {
    // console.log(event.type);
  }

  start = (forceStart = false) => {
    if(!forceStart && document.readyState != 'complete') {
      window.addEventListener('load', this.start);
      return;
    }
    this.animation = requestAnimationFrame(this.loop);
  }

  stop = () => {
    cancelAnimationFrame(this.animation);
  }

  loop = () => {
    this.animation = requestAnimationFrame(this.loop);
    this.activeCamera.drawScreen(this.currentMap);
    this.update();
  }

  addCamera = (x, y, zoom) => {
    let camera = new Camera(this.ctx, this.canvas.width, this.canvas.height, x, y, zoom);
    return this.cameras.push(camera) - 1;
  }

  changeCamera = (cameraID) => {
    this.activeCamera = this.cameras[cameraID];
  }

  addMap = (map) => {
    let index = this.maps.push(map) - 1;

    if(index == 0) this.currentMap = map;

    return index;
  }

  changeMap = (index) => {
    this.currentMap = this.maps[index];
  }

  zoomCamera = (zoomFactor) => {
    this.activeCamera.changeZoom(zoomFactor);
  }
}
