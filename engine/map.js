class Map {
  constructor(jsonFileName) {

    fetch(jsonFileName)
        .then(response => response.json())
        .then(json => {
          this.spritesheet = new Image();
          this.spritesheet.src = json.tilesets[0].image;
          this.map = json.layers;
          this.layers = json.layers.keys();

          this.sheetInfo = {
            columns: json.tilesets[0].columns,
            rows: json.tilesets[0].rows,
            firstgid:  json.tilesets[0].firstgid,
            width:  json.tilesets[0].imagewidth,
            height:  json.tilesets[0].imageheight,
          }

          this.tileWidth = json.tilewidth;
          this.tileHeight = json.tileheight;

          this.widthInTiles = json.width;
          this.heightInTiles = json.height;
          this.width = this.widthInTiles * this.tileWidth;
          this.height = this.heightInTiles * this.tileHeight;

          this.ctx = document.querySelector('canvas').getContext('2d');
        });
  }

  draw = () => {
    for(let i = 0; i < this.layers.length; i++) {
      let map = this.map[this.layers[i]];

      if(!map.visible) continue;

      for(let j = 0; j < map.data.length; j++) {
        let cell = map.data[j];
        let sy = Math.floor(cell / this.sheetInfo.columns) * this.tileHeight;
        let sx = (cell % this.sheetInfo.columns) * this.tileWidth;
        let dy = Math.floor(j / this.widthInTiles) * this.tileHeight;
        let dx = (j % this.widthInTiles) * this.tileWidth;
        this.ctx.drawImage(
            this.spritesheet,
            sx, sy, this.tileWidth, this.tileHeight,
            dx, dy, this.tileWidth, this.tileHeight);
      }
    }
  }
}
