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

    if (selfId != self.id) {
      if (self.cur != undefined) {



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

});


setInterval(function() {
  //Public stuff
  var p1 = punto.Crear(10, 10);
  var p2 = punto.Crear(45, 20);
  console.log(p1 + "  " + p2);
  var result = Vector.Restar(p1, p2);
  console.log("Resta es " + result);
  if (!selfId)
    return;

  //Private stuff
  //Update canvas
  ctx.clearRect(0, 0, $("#GameCanvas").css("width"), $("#GameCanvas").css("height"));

  for (var i in Player.list)
    Player.list[i].draw();

}, 40);
