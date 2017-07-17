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
      rotarImagen("GameCanvas", Img.mine, 0, map.Minax[x], map.Minay[x], "CENTER", "SpriteVertical", 0, map.FrameMina[x] * 96, 96, 96, map.widthMina, map.heightMina);
      FrameMina = Math.round(Math.random() * 1);
    }
  },
  "printLimits": function() {
    for (var x = 0; x <= Math.round(window.innerWidth / MarginSize); x++) {
      rotarImagen("GameCanvas", Img.limit, 0, MarginSize + x * MarginSize, MarginSize * 2, "leftUp", "SpriteVertical", 0, 0, 64, 64, MarginSize, MarginSize);
    }

    for (var x = 0; x <= Math.round(window.innerWidth / MarginSize); x++) {
      rotarImagen("GameCanvas", Img.limit, 0, MarginSize + x * MarginSize, window.innerHeight - MarginSize, "leftUp", "SpriteVertical", 0, 0, 64, 64, MarginSize, MarginSize);
    }

    for (var x = 0; x <= Math.round((window.innerHeight - MarginSize * 2.8) / MarginSize); x++) {
      rotarImagen("GameCanvas", Img.limit, 0, MarginSize * 2, MarginSize + x * MarginSize, "leftUp", "SpriteVertical", 0, 0, 64, 64, MarginSize, MarginSize);
    }
    for (var x = 0; x <= Math.round(window.innerHeight / MarginSize); x++) {
      rotarImagen("GameCanvas", Img.limit, 0, window.innerWidth + MarginSize + 2, MarginSize + x * MarginSize, "leftUp", "SpriteVertical", 0, 0, 64, 64, MarginSize, MarginSize);
    }
  },
  "printTerrain": function() {
    for (var x = -1; x < window.innerWidth / Img.groundBasic.width; x++) {
      for (var y = -1; y < window.innerHeight / Img.groundBasic.height; y++) {
        ctx.drawImage(Img.groundBasic, x * Img.groundBasic.width, y * Img.groundBasic.height, Img.groundBasic.width + 1, Img.groundBasic.height + 1);
      }
    }
  },
  "resizeON": 0,
  "checkForScreenResize": function() {
    if (map.resizeON === 1) {
      ctx.canvas.width = window.innerWidth;
      ctx.canvas.height = window.innerHeight;
      map.generateMinasLoc(12, 40, 40);
      map.resizeON = 0;
    }
  }

}
