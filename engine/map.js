class Map {
  constructor(jsonFileName) {

    fetch(jsonFileName)
        .then(response => response.json())
        .then(json => {
          this.spritesheet = new Image();
          this.spritesheet.src = json.tilesets[0].image;
          this.map = json.layers;

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
        });
  }

  draw = (ctx, offsetX, offsetY, zoom) => {
    for(let i = 0; i < this.map.length; i++) {
      const map = this.map[i];

      if(!map.visible) continue;

      for(let j = 0; j < map.data.length; j++) {
        let cell = map.data[j];
        if(cell == 0) continue; // Don't bother with anything if it's blank
        cell--; // Align the tile id for drawing
        const sy = Math.floor(cell / this.sheetInfo.columns) * this.tileHeight;
        const sx = (cell % this.sheetInfo.columns) * this.tileWidth;
        const dy = Math.floor(j / this.widthInTiles) * this.tileHeight - offsetY;
        const dx = (j % this.widthInTiles) * this.tileWidth - offsetX;
        ctx.drawImage(
            this.spritesheet,
            sx, sy, this.tileWidth, this.tileHeight,
            dx, dy, this.tileWidth, this.tileHeight);
      }
    }
  }
}
