var lifetime; // How long should each generation live

var population; // Population

var lifecycle; // Timer for cycle of generation
var recordtime; // Fastest time to target

var target; // Target position

//var diam = 24;          // Size of target

var obstacles = []; //an array list to keep track of all the obstacles!

var setUp = 1;

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

  if (setUp) {
    lifetime = 300;

    // Initialize variables
    lifecycle = 0;
    recordtime = lifetime;

    target = new Obstacle(width / 2 - 12, 24, 24, 24);

    // Create a population with a mutation rate, and population max
    var mutationRate = 0.01;
    population = new Population(mutationRate, 50);

    // Create the obstacle course
    obstacles = [];
    obstacles.push(new Obstacle(width / 2 - 100, height / 2, 200, 10));
    setUp = 0;
  } else {



    target.display();


    // If the generation hasn't ended yet
    if (lifecycle < lifetime) {
      population.live(obstacles);
      if ((population.targetReached()) && (lifecycle < recordtime)) {
        recordtime = lifecycle;
      }
      lifecycle++;
      // Otherwise a new generation
    } else {
      lifecycle = 0;
      population.fitness();
      population.selection();
      population.reproduction();
    }

    // Draw the obstacles
    for (var i = 0; i < obstacles.length; i++) {
      obstacles[i].display();
    }


    ctx.fillText("Generation #: " + population.getGenerations(), 10, 18);
    ctx.fillText("Cycles left: " + (lifetime - lifecycle), 10, 36);
    ctx.fillText("Record cycles: " + recordtime, 10, 54);
    //Public stuff


    if (!selfId)
      return;

    //Private stuff
    //Update canvas
    ctx.clearRect(0, 0, $("#GameCanvas").css("width"), $("#GameCanvas").css("height"));
  }

  for (var i in Player.list)
    Player.list[i].draw();

}, 40);



document.addEventListener("click", function() {
  target.position.x = mouseX;
  target.position.y = mouseY;
  recordtime = lifetime;
});
