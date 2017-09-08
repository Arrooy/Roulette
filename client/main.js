var Player = function(initPack) {
  var self = {};
  self.id = initPack.id;
  self.xp = initPack.xp;
  self.name = initPack.name;
  self.lvl = initPack.lvl;
  self.team = initPack.team;
  self.cur = initPack.cur;
  self.x = initPack.x;
  self.y = initPack.y;
  self.admin = initPack.admin;
  self.ImageCursor = new Image();
  self.ImageCursor.src = "./client/img/" + self.cur + ".png";
  self.draw = function() {

    if (selfId != self.id) {
      if (self.cur != undefined) {

        ctx.drawImage(self.ImageCursor, self.x, self.y);

      }

    }
  }

  Player.list[self.id] = self;

  return self;
}

var selfId = null;
Player.list = {};

socket.on('init', function(data) {
  if (data.selfId)
    selfId = data.selfId;

  for (var i = 0; i < data.player.length; i++) {
    new Player(data.player[i]);
  }
});

socket.on('update', function(data) {

  for (var i = 0; i < data.player.length; i++) {
    var pack = data.player[i];
    var p = Player.list[pack.id];
    if (p) {

      if (pack.xp !== undefined)
        p.xp = pack.xp;
      if (pack.lvl !== undefined)
        p.lvl = pack.lvl;
      if (pack.team !== undefined)
        p.team = pack.team;
      if (pack.cur !== undefined)
        p.cur = pack.cur;
      if (pack.x !== undefined)
        p.x = pack.x;
      if (pack.y !== undefined)
        p.y = pack.y;
    }
  }
});

socket.on('remove', function(data) {
  for (var i = 0; i < data.player.length; i++) {
    delete Player.list[data.player[i]];
  }
});


$(window).resize(function() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
});

var setupDone = 1;
var as = 0;
var OrignialSizeX = 1842;
var OrignialSizeY = 1014;

Ruleta16 = new Image();
Ruleta16.src = "./client/img/RuletaBasica.png";
GoldSelector = new Image();
GoldSelector.src = "./client/img/GoldSelector.png";

var GoldAngle = 270;
setInterval(function() {
  if (ready) {
    if (setupDone === 1) {
      setup();
      setupDone = 0;
    }
    loop();
    //Public stuff

    if (!selfId)
      return;
    //Private stuff
    //Update canvas

    ctx.clearRect(0, 0, $("#GameCanvas").width(), $("#GameCanvas").height());

    if (as >= 360)
      as = 0;

    for (var i in Player.list)
      Player.list[i].draw();

    //indicador(window.innerWidth / 2, window.innerHeight / 2, as += 10, 350, 10);

    indicador(Player.list[selfId].x, Player.list[selfId].y, as += 1, (350 * ctx.canvas.width) / OrignialSizeX, (10 * ctx.canvas.height) / OrignialSizeY);
    var masPeke;
    if (ctx.canvas.width < ctx.canvas.height) {
      masPeke = ctx.canvas.width;
    } else {
      masPeke = ctx.canvas.height;
    }
    ctx.drawImage(Ruleta16, Player.list[selfId].x - ((420 * masPeke) / OrignialSizeX) / 2, Player.list[selfId].y - ((420 * masPeke) / OrignialSizeY) / 2, (420 * masPeke) / OrignialSizeX, (420 * masPeke) / OrignialSizeY);
  }
}, 40);
//JO = Player.list[selfId]

var setup = function() {}

var loop = function() {}

/*
document.addEventListener('mousedown', function(e) {
  ctx.clearRect(0, 0, $("#GameCanvas").width(), $("#GameCanvas").height());
});*/

document.addEventListener('mousemove', function(e) {

  if (ready) {
    socket.emit("mouseMoved", {
      x: e.pageX,
      y: e.pageY
    });
  }
});

var indicador = function(x, y, degrees, width, height) {
  var sizeCasillaX = 70 / OrignialSizeX * ctx.canvas.width;
  var sizeCasillaY = 113 / OrignialSizeY * ctx.canvas.height;

  ctx.save();
  ctx.beginPath();
  x = x - width / 2;
  y = y - height / 2;
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate(degrees * Math.PI / 180);
  ctx.fillStyle = "black";
  ctx.rect(-width / 2, -height / 2, width, height);
  ctx.fill();
  /*  ctx.beginPath();
    ctx.fillStyle = "rgba(247, 239, 31, 0.54)";
    ctx.rect(width / 2, -sizeCasillaY / 2, sizeCasillaX, sizeCasillaY);
    ctx.fill();*/
  /*ctx.beginPath();
  ctx.fillStyle = "rgba(247, 239, 31, 0.54)";
  ctx.rect(-width - sizeCasillaX, -sizeCasillaY / 2, sizeCasillaX, sizeCasillaY);
  ctx.fill();*/
  golder(GoldSelector, width, sizeCasillaY);


  ctx.restore();



}
//adapt de angle + teh size of all fotos to be responsive!
var golder = function(GoldSelector, width, sizeCasillaY) {
  ctx.drawImage(GoldSelector, width / 2, -sizeCasillaY / 2);
}
