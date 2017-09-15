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
  console.log("R_src "+R.src+" I_src "+I.src);
  console.log("R_widthOnCenter "+R.width/2+" I_WidthOnCenter "+ I.width);
  console.log("Result of resta ="+(R.width/2 - I.width));
  console.log("Result of resta with good height of I="+(R.width/2 - I.height));

});

var Degree = 270;
var velocidad = 180;
var freno = 3;

setInterval(function() {

  if (ready1 && ready2) {

    if (!selfId)
      return;
    //Private stuff
    //Update canvas

    ctx.clearRect(0, 0, $("#GameCanvas").width(), $("#GameCanvas").height());

    for (var i in Player.list)
      Player.list[i].draw();

    //console.log(Degree);


    //console.log((R.width - I.width )+ " or height "  + (R.height - I.height));


    indicador(window.innerWidth / 2, window.innerHeight / 2, Degree,73.2);//350 10     (R.height - I.height)
    updateRouletteMovement();
    ctx.drawImage(R, window.innerWidth / 2 - R.width / 2, window.innerHeight / 2 - R.height / 2);

  }
}, 40);
//JO = Player.list[selfId]
var updateRouletteMovement = function(){
  //Degree = Degree + velocidad;
  velocidad = velocidad - freno;
  if(Degree >= 360) Degree = 0;
  if(velocidad <= 0){
    freno = 0;
    velocidad = 0;
    decideSide();
  }
}
var decideSide = function(){}
var roll = function(){
  Degree = Math.round(rand(0,360));
  velocidad = Math.round(rand(90,360));
  freno = Math.round(rand(1,5));
  console.log("Degree");
  console.log(Degree);
  console.log(velocidad);
  console.log(freno);
}
var rand = function(min,max){
  return (Math.random() * (min - max) + max)
}
document.addEventListener('mousemove', function(e) {

  if (ready1 && ready2) {
    //Degree++;
    socket.emit("mouseMoved", {
      x: e.pageX,
      y: e.pageY
    });
  }
});
var line = function(x,y,dx,dy){
  ctx.moveTo(x,y);
  ctx.lineTo(dx,dy);
  //var afd = "rgb("+rand(0,255)+", "+rand(0,255)+", "+rand(0,255)+")";
  //console.log(afd);
ctx.stroke();

}
var indicador = function(x, y, degrees,degrees2) {

  ctx.save();

  ctx.beginPath();

ctx.strokeStyle = "black";
  line(x,y,x+R.width/2,y);
  line(x,y,x,y+R.height/2);
  line(x,y,x-R.width/2,y);
  line(x,y,x,y-R.height/2);
ctx.beginPath();
  ctx.strokeStyle = "white";

  line(x,y,x+R.width/2 - I.height,y);//dreta
  line(x,y,x,y+R.height/2 - I.height);//abaix
  line(x,y,x-R.width/2 + I.width ,y);//esquerra
  line(x,y,x,y-R.height/2 + I.height);//adalt



  ctx.translate(x, y); //origen = centre pantalla

  ctx.fillStyle = "blue";
  ctx.fillRect(0-5,0-5,10,10);
  ctx.fill();


  ctx.rotate(degrees * Math.PI / 180);//Rotem tot el canvas uns degrees
  ctx.fillStyle = "green";
  ctx.fillRect(R.width/2 - I.height, 0,5,5);
  ctx.fill();
/*rgb(88, 11, 44)
  ctx.translate(R.width/2 - I.height , - I.height / 2);
  //ctx.translate((R.width - I.width)/2 + I.width/2, - I.height / 2);

        ctx.fillStyle = "yellow";
        ctx.fillRect(- I.width/2,0-5,10,10);
        ctx.fill();

  ctx.rotate(degrees2 * Math.PI / 180);



  ctx.translate((R.width/2 - I.height + I.width/2)*-1,+ I.height / 2);


  ctx.fillStyle = "black";
  ctx.fillRect (R.width/2 - I.height, -I.height/2,5,5);
  ctx.fill();


  ctx.drawImage(I, R.width/2 - I.height, -I.height/2);
*/
  ctx.restore();

}

var SelectImages = function() {

  if (D[0] === undefined) {

    setTimeout(function() {

      loadImage(images);
      SelectImages();

    }, 100);
  } else {

    if (window.innerWidth >= D[0].width && window.innerHeight >= D[0].height) {
      //Big

      R.src = R_Big_S;
      I.src = I_Big_S;

    } else if (window.innerWidth > D[1].width && window.innerHeight > D[1].height) {
      //Normal

      R.src = R_Nor_S;
      I.src = I_Nor_S;

    } else{
      //small

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
  //roll();
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
