const game = {
  initial: function(update, canvasParent = document.body) {
    // Create canvas element for game
    game.canvas = document.createElement('CANVAS');
    game.canvas.width = 1000;
    game.canvas.height = 750;
    game.canvas.style.background = '#222';
    game.canvas.style.position = 'absolute';
    game.canvas.style.left = '50%';
    game.canvas.style.top = '50%';
    game.canvas.style.transform = 'translate(-50%, -50%)';
    canvasParent.appendChild(game.canvas);

    // Get canvas context for drawing on canvas
    game.ctx = game.canvas.getContext('2d');

    game.update = update;

    game.addCamera(0, 0, 1);
    game.activeCamera = game.cameras[0];

    // Add event handlers
    document.addEventListener('keydown', game);
    document.addEventListener('keyup', game);
  },

  sprites : [],
  maps : [],
  cameras : [],
  keysPressed : [],
  newKeys : [],

  handleEvent : (event) => {
    switch(event.type) {
      case 'keydown':
        game.keysPressed.push(event.code);
        game.newKeys.push(event.code);
        // TODO: finish implementing code for newKeys
        break;
      case 'keyup':
        game.keysPressed = game.keysPressed.filter(val => val != event.code);
        break;
      default:
        throw Error(`Invalid event type: ${event.type}`);
    }
  },

  start : (forceStart = false) => {
    if(!forceStart && document.readyState != 'complete') {
      window.addEventListener('load', game.start);
      return;
    }
    game.animation = requestAnimationFrame(game.loop);
  },

  stop : () => {
    cancelAnimationFrame(game.animation);
  },

  loop : () => {
    game.animation = requestAnimationFrame(game.loop);
    game.activeCamera.drawScreen(game.currentMap);
    game.update();
  },

  addCamera : (x, y, zoom) => {
    let camera = new Camera(game.canvas.width, game.canvas.height, x, y, zoom);
    return game.cameras.push(camera) - 1;
  },

  changeCamera : (cameraID) => {
    game.activeCamera = game.cameras[cameraID];
  },

  addMap : (map) => {
    let index = game.maps.push(map) - 1;

    if(index == 0) game.currentMap = map;

    return index;
  },

  changeMap : (index) => {
    game.currentMap = game.maps[index];
  },

  zoomCamera : (zoomFactor) => {
    game.activeCamera.changeZoom(zoomFactor);
  },
}
