var map = {
  "Minax": [],
  "Minay": [],
  "widthMina": 0,
  "heightMina": 0,
  "numeroMinas": 0,
  "FrameMina": [],
  "MarginSize": 16,

  "generateMinasLoc": function(numeroMinas, widthMina, heightMina) {
    map.numeroMinas = numeroMinas;
    map.widthMina = widthMina;
    map.heightMina = heightMina;

    for (var s = 0; s < map.numeroMinas; s++) {

      if (s >= 6) {
        map.FrameMina[s] = 1;
        map.Minax[s] = window.innerWidth - map.heightMina * 0.5;
        map.Minay[s] = window.innerHeight / 2 - map.heightMina * 2 + (s - 6) * map.heightMina;
      } else {
        map.FrameMina[s] = 0;
        map.Minax[s] = map.heightMina * 2;
        map.Minay[s] = window.innerHeight / 2 - map.heightMina * 2 + s * map.heightMina;
      }
    }
  },
  "printMinas": function() {
    for (var x = 0; x < map.numeroMinas; x++) {
      rotarImagen("GameCanvas", map.Img.mine, 0, map.Minax[x], map.Minay[x], "CENTER", "SpriteVertical", 0, map.FrameMina[x] * 96, 96, 96, map.widthMina, map.heightMina);
      FrameMina = Math.round(Math.random() * 1);
    }
  },
  "printLimits": function() {
    for (var x = 0; x <= Math.round(window.innerWidth / map.MarginSize); x++) {
      rotarImagen("GameCanvas", map.Img.limit, 0, map.MarginSize + x * map.MarginSize, map.MarginSize * 2, "leftUp", "SpriteVertical", 0, 0, 64, 64, map.MarginSize, map.MarginSize);
    }

    for (var x = 0; x <= Math.round(window.innerWidth / map.MarginSize); x++) {
      rotarImagen("GameCanvas", map.Img.limit, 0, map.MarginSize + x * map.MarginSize, window.innerHeight - map.MarginSize, "leftUp", "SpriteVertical", 0, 0, 64, 64, map.MarginSize, map.MarginSize);
    }

    for (var x = 0; x <= Math.round((window.innerHeight - map.MarginSize * 2.8) / map.MarginSize); x++) {
      rotarImagen("GameCanvas", map.Img.limit, 0, map.MarginSize * 2, map.MarginSize + x * map.MarginSize, "leftUp", "SpriteVertical", 0, 0, 64, 64, map.MarginSize, map.MarginSize);
    }
    for (var x = 0; x <= Math.round(window.innerHeight / map.MarginSize); x++) {
      rotarImagen("GameCanvas", map.Img.limit, 0, window.innerWidth + map.MarginSize + 2, map.MarginSize + x * map.MarginSize, "leftUp", "SpriteVertical", 0, 0, 64, 64, map.MarginSize, map.MarginSize);
    }
  },
  "printTerrain": function() {
    for (var x = -1; x < window.innerWidth / map.Img.groundBasic.width; x++) {
      for (var y = -1; y < window.innerHeight / map.Img.groundBasic.height; y++) {
        ctx.drawImage(map.Img.groundBasic, x * map.Img.groundBasic.width, y * map.Img.groundBasic.height, map.Img.groundBasic.width + 1, map.Img.groundBasic.height + 1);
      }
    }
  },
  "resizeON": 0,
  "checkForScreenResize": function() {
    if (map.resizeON === 1) {
      ctx.canvas.width = window.innerWidth;
      ctx.canvas.height = window.innerHeight;
      $("#UI").css("width", window.innerWidth - 350);
      map.generateMinasLoc(12, 40, 40);
      map.printTerrain();
      map.printMinas();
      map.printLimits();
      map.resizeON = 0;
    }
  },
  "Img": {},
  "loadResources": function() {
    map.Img.cursor = new Image();
    map.Img.minero = new Image();
    map.Img.mine = new Image();
    map.Img.explode = new Image();
    map.Img.minerIco = new Image();
    map.Img.groundBasic = new Image();
    map.Img.limit = new Image();
    map.Img.cursor.src = '/client/img/' + self.cur + '.png';
    map.Img.minero.src = '/client/img/Miner.png';
    map.Img.mine.src = '/client/img/mine.png';
    map.Img.explode.src = '/client/img/explosion.png';
    map.Img.minerIco.src = '/client/img/minerIco.png';
    map.Img.groundBasic.src = '/client/img/grass.png';
    map.Img.limit.src = '/client/img/Box.png';
  }

}
