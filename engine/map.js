class Map {
  constructor(
      spritesheet, tileWidth, tileHeight,
      widthInTiles, heightInTiles) {
    this.spritesheet = new Image();
    this.spritesheet.src = spritesheet;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;

    this.widthInTiles = widthInTiles;
    this.heightInTiles = heightInTiles;
    this.width = widthInTiles * tileWidth;
    this.height = heightInTiles * tileHeight;

    this.ctx = document.querySelector('canvas').getContext('2d');
  }

  draw = () => {
    let map = [[1, 1, 1, 1, 1, 1, 1, 1],
               [1, 1, 1, 1, 1, 1, 1, 1],
               [1, 1, 1, 1, 1, 1, 1, 1],
               [2, 2, 2, 2, 2, 2, 2, 2],
               [3, 3, 3, 3, 3, 3, 3, 3],
               [3, 3, 3, 3, 3, 3, 3, 3],
               [3, 3, 3, 3, 3, 3, 3, 3],
               [3, 3, 3, 3, 3, 3, 3, 3]];

    for(let i = 0; i < map.length; i++) {
      for(let j = 0; j < map[i].length; j++) {
        switch(map[i][j]) {
          case 1:
            this.ctx.drawImage(this.spritesheet, 64, 0, 64, 64, j*64, i*64, 64, 64);
            break;
          case 2:
            this.ctx.drawImage(this.spritesheet, 128, 0, 64, 64, j*64, i*64, 64, 64);
            break;
          case 3:
            this.ctx.drawImage(this.spritesheet, 0, 64, 64, 64, j*64, i*64, 64, 64);
        }
      }
    }
  }
}
