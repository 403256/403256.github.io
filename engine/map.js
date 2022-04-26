class Map {
  constructor(jsonFileName) {

    fetch(jsonFileName)
        .then(response => response.json())
        .then(json => {
          let data = {};
          data.spritesheet = new Image();
          data.spritesheet.src = json.tilesets[0].image;
          data.tileWidth = json.tilewidth;
          data.tileHeight = json.tileheight;

          data.widthInTiles = json.width;
          data.heightInTiles = json.height;
          data.width = data.widthInTiles * data.tileWidth;
          data.height = data.heightInTiles * data.tileHeight;

          data.ctx = document.querySelector('canvas').getContext('2d');

          this.assign(data);
        });
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
