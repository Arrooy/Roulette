var OrignialSizeX = 1842;
var OrignialSizeY = 1014;
var setupDone = 0;
var D = [];
var R = new Image();
var I = new Image();

var R_Big_S = "./client/img/R_Big.png";
var R_Nor_S = "./client/img/R_Nor.png";
var R_Small_S = "./client/img/R_Small.png";

var I_Big_S = "./client/img/I_Big.png";
var I_Nor_S = "./client/img/I_Nor.png";
var I_Small_S = "./client/img/I_Small.png";

var images = [
  "./client/img/R_Big.png",
  "./client/img/R_Nor.png",
  "./client/img/R_Small.png",
  "./client/img/I_Big.png",
  "./client/img/I_Nor.png",
  "./client/img/I_Small.png"
];

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
  loadImage(images);
  SelectImages();
});

setInterval(function() {

  if (ready1 && ready2) {

    if (!selfId)
      return;
    //Private stuff
    //Update canvas

    ctx.clearRect(0, 0, $("#GameCanvas").width(), $("#GameCanvas").height());


    for (var i in Player.list)
      Player.list[i].draw();

    indicador(window.innerWidth / 2, window.innerHeight / 2, 0, 350, 10);


    //indicador(Player.list[selfId].x, Player.list[selfId].y, 0 /*Angle*/ , (350 * ctx.canvas.width) / OrignialSizeX, (10 * ctx.canvas.height) / OrignialSizeY);

    ctx.drawImage(R, window.innerWidth / 2 - R.width / 2, window.innerHeight / 2 - R.height / 2, R.width, R.height);

  }
}, 40);
//JO = Player.list[selfId]


document.addEventListener('mousemove', function(e) {

  if (ready1 && ready2) {
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
  //  golder(I, width, sizeCasillaY);
  ctx.drawImage(I, width / 2, -sizeCasillaY / 2);

  ctx.restore();



}

var SelectImages = function() {
  //console.log(D[0]);
  if (D[0] === undefined) {
    console.log("getting a timeout");
    setTimeout(function() {


      loadImage(images);

    }, 100);
  } else {


    if (window.innerWidth >= D[0].width) {
      //Big
      console.log("BIG");
      R.src = R_Big_S;
      I.src = I_Big_S;

    } else if (window.innerWidth > D[1].width) {
      //Normal
      console.log("NORMAL");
      R.src = R_Nor_S;
      I.src = I_Nor_S;

    } else {
      //small
      console.log("SMALL");
      R.src = R_Small_S;
      I.src = I_Small_S;
    }
  }

}



window.addEventListener('load', function() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  loadImage(images);
  SelectImages();
}, false);

function loadImage(images) {

  if (!images.length) {
    ready2 = 1;
    return;
  }

  // Define a "worker" function that should eventually resolve or reject the deferred object.

  function deferLoading(deferred) {
    var url = images.shift();

    var image = new Image();

    // Set up event handlers to know when the image has loaded
    // or fails to load due to an error or abort.
    image.onload = loaded;
    image.onerror = errored; // URL returns 404, etc
    image.onabort = errored; // IE may call this if user clicks "Stop"

    // Setting the src property begins loading the image.
    image.src = url;

    function loaded() {
      unbindEvents();
      // Calling resolve means the image loaded sucessfully and is ready to use.
      deferred.resolve(image);
      deferred.done(function(image) {
        D.push(image);
      });
    }

    function errored() {
      unbindEvents();
      // Calling reject means we failed to load the image (e.g. 404, server offline, etc).

      deferred.reject(image);
    }

    function unbindEvents() {
      // Ensures the event callbacks only get called once.
      image.onload = null;
      image.onerror = null;
      image.onabort = null;
    }
  };

  var Deferred = $.Deferred(deferLoading);
  loadImage(images);

  return Deferred;
};
