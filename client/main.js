var Input = new input();

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



  self.draw = function() {

    var AnimationSpeed = 100;
    if (selfId != self.id) {
      if (self.cur != undefined) {

        //rotarImagen("ctx",Img.minero,0,self.x,self.y,"CENTER","SpriteVertical",0,i*72,72,72);
        //rotarImagen("ctx",Img.mine,0,self.x,self.y,"CENTER","SpriteVertical",0,i*96,96,96);
        //rotarImagen("ctx",Img.explode,0,self.x,self.y,"CENTER","SpriteVertical",i*64,j * 64,64,64);
        //rotarImagen("ctx",Img.minerIco,0,self.x,self.y,"CENTER");
        //rotarImagen("ctx",Img.groundBasic,0,self.x,self.y,"CENTER");
        //rotarImagen("ctx",knight[i],0,j*20,self.y,"CENTER");

      }
      return;
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
  map.resizeON = 1;
});



var millis = 0;
var lastMillis = 0;
console.log(gameStart);


setInterval(function() {
  if (gameStart === 1) {

    map.generateMinasLoc(12, 40, 40);
    map.loadResources();
    console.log("LLEGAMOS");
    map.printTerrain();
    console.log("LLEGAMOS2");
    map.printMinas();
    console.log("LLEGAMOS3");
    map.printLimits();
    console.log("EASY");
  }
  millis = +new Date();
  map.checkForScreenResize();
  checkForAdmins();


  if (!selfId)
    return;

  ctx.clearRect(0, 0, $("#GameCanvas").css("width"), $("#GameCanvas").css("height"));

  for (var i in Player.list)
    Player.list[i].draw();

}, 40);
