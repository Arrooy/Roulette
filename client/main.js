var OrignialSizeX = 1842;
var OrignialSizeY = 1014;
var setupDone = 0;
var web = 0;

var D = [];

var imageArray = [
  "R_Big",
  "R_Nor",
  "R_Small",
  "I_Big",
  "I_Nor",
  "I_Small",
  "S_Big",
  "S_Nor",
  "S_Small"
];

var Player = function(initPack) {
  var self = {};
  self.id = initPack.id;
  self.xp = initPack.xp;
  self.name = initPack.name;
  self.lvl = initPack.lvl;
  self.pasta = initPack.pasta;
  self.cur = initPack.cur;
  self.x = initPack.x;
  self.y = initPack.y;
  self.admin = initPack.admin;
  self.selection = 16;
  self.Bet = -1;
  self.sectorBet = 16;

  self.ImageCursor = new Image();
  self.ImageCursor.src = "./client/img/" + self.cur + ".png";

  self.draw = function() {

    if (selfId != self.id) { // Si eres tu, no pintes nada en tu display. Si otra persona pasa por el bucle draw, si que vera el tema.
      if (self.cur != undefined) {

        ctx.drawImage(self.ImageCursor, self.x, self.y);

      }

    } else { // 100 % private data
      if(self.sectorBet !== 16){
        RoundText(self.Bet,self.sectorBet * 22.5);

      }
      if (self.selection !== 16) {
        indicador(D[WindowSize + imagesPackNumber * 2], window.innerWidth / 2, window.innerHeight / 2, self.selection*22.5);
      }

      ctx.font = "25px Segoe UI";
      ctx.fillStyle = "#2F1B41";
      ctx.fillText(self.name.toUpperCase(),0,25);
      ctx.fillText("Pasta: "+self.pasta,0,25*2);
      ctx.fillText("X "+self.x,0,25*3);
      ctx.fillText("Y "+self.y,0,25*4);
      ctx.fillText("WSize "+WindowSize,0,25*5);
      ctx.fillText("ROLLING "+rolling,0,25*6);
      ctx.fillText("Winner sector "+winSec,0,25*7);

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
      if (pack.pasta !== undefined)
        p.pasta = pack.pasta;
      if (pack.cur !== undefined)
        p.cur = pack.cur;
      if (pack.x !== undefined)
        p.x = pack.x;
      if (pack.y !== undefined)
        p.y = pack.y;
      if (pack.selection !== undefined)
        p.selection = pack.selection;
      if (pack.Bet !== undefined)
        p.Bet = pack.Bet;
      if (pack.sectorBet !== undefined)
        p.sectorBet = pack.sectorBet;
    }
  }
});

socket.on('remove', function(data) {
  for (var i = 0; i < data.player.length; i++) {
    delete Player.list[data.player[i]];
  }
});

var Degree = 0;
var imagesPackNumber = 3;
var WindowSize = 1; //0 = small 2 big
var rolling = true;

var lastMillis = 0;
var timeLeft = 0;
var winSec = 16;
socket.on('roulette', function(data) {
  Degree = data;
});

socket.on('SectorWinner', function(data) {
  console.log("Ganador = " + data);
  winSec = data;
  rolling = false;
  lastMillis = millis();
  //7500
});

var millis = function() {
  var d = new Date();
  var n = d.getTime();
  return n;
}

$(window).resize(function() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  loadImages(imageArray, start);
});

var checkSize = function(images) {
  if (window.innerWidth >= images[0].width && window.innerHeight >= images[0].height) {
    //Big
    WindowSize = 0;

  } else if (window.innerWidth > images[1].width && window.innerHeight > images[1].height) {
    //Normal
    WindowSize = 1;

  } else if (window.innerWidth > images[2].width && window.innerHeight > images[2].height) {
    //small
    WindowSize = 2;

  } else {
    //SUPER SMALL
  }
  ready3 = 1;
}

var start = function(images) {
  D = images;
  checkSize(D);
  setInterval(function() {

    if (ready1 && ready2 & ready3) {


      if (!selfId)
        return;

      ctx.clearRect(0, 0, $("#GameCanvas").width(), $("#GameCanvas").height());

      indicarTiempo(window.innerWidth / 2, window.innerHeight / 2);

      for (var i in Player.list)
        Player.list[i].draw();

      indicador(D[WindowSize + imagesPackNumber], window.innerWidth / 2, window.innerHeight / 2, Degree);
      ctx.drawImage(D[WindowSize], window.innerWidth / 2 - D[WindowSize].width / 2 + 1, window.innerHeight / 2 - D[WindowSize].height / 2);
    }
  }, 40);
}
//JO = Player.list[selfId]


var indicarTiempo = function(x, y) {
  if (rolling === false) {


    timeLeft = Math.round(Map(millis() - lastMillis, 100, 7000, 7, 0));


    switch (WindowSize) {
      case 0:
        ctx.font = "180px Segoe UI";
        y += 80;
        break;
      case 1:
        ctx.font = "90px Segoe UI";
        y += 35;
        break;
      case 2:
        ctx.font = "65px Segoe UI";
        y += 22.5;
        break;
    }
    if (timeLeft == 0) {
      ctx.fillStyle = "#F05941";
    } else {
      ctx.fillStyle = "#31BE5E";
    }

    var tempSize = ctx.measureText(timeLeft).width;
    x -= tempSize/2.3;

    ctx.fillText(timeLeft, x, y);
    switch (WindowSize) {
      case 0:
        ctx.font = "80px Segoe UI";
        break;
      case 1:
        ctx.font = "40px Segoe UI";
        break;
      case 2:
        ctx.font = "28px Segoe UI";
        break;
    }

    ctx.fillText("s", x + tempSize, y);

    if (millis() - lastMillis >= 7000) {
      rolling = true;
    }
    //$("TimeLeft").style
  } else {
    switch (WindowSize) {
      case 0:
        ctx.font = "180px Segoe UI";
        y += 80;
        break;
      case 1:
        ctx.font = "90px Segoe UI";
        y += 35;
        break;
      case 2:
        ctx.font = "65px Segoe UI";
        y += 22.5;
        break;
    }
    ctx.fillStyle = "#F05941";
    var tempSize = ctx.measureText(0).width;
      x -= tempSize/2.3;

    ctx.fillText(0, x, y);
    switch (WindowSize) {
      case 0:
        ctx.font = "80px Segoe UI";
        break;
      case 1:
        ctx.font = "40px Segoe UI";
        break;
      case 2:
        ctx.font = "28px Segoe UI";
        break;
    }

    ctx.fillText("s", x + tempSize, y);
  }
}


document.addEventListener('mousemove', function(e) {
  if (ready1 && ready2 && ready3) {
    var radi = [];

    switch (WindowSize) {
      case 0:
        radi[0] = D[WindowSize].width / 2;
        radi[1] = D[WindowSize].width / 2 - 70;
        break;
      case 1:
        radi[1] = D[WindowSize].width / 2 - 35;
        radi[0] = D[WindowSize].width / 2;
        break;
      case 2:
        radi[1] = D[WindowSize].width / 2 - 26;
        radi[0] = D[WindowSize].width / 2;
        break;
    }
    socket.emit("mouseMoved", {
      x: e.pageX,
      y: e.pageY,
      cx: window.innerWidth / 2,
      cy: window.innerHeight / 2,
      r: radi,
      ws:WindowSize
    });
  }
});

document.addEventListener('mousedown', function(e) {
  if (ready1 && ready2 && ready3) {
    socket.emit("press", {
      x: e.pageX,
      y: e.pageY,
      ws:WindowSize
    });
  }
});
document.addEventListener('mouseup', function(e) {
  if (ready1 && ready2 && ready3) {
    socket.emit("release", {
      x: e.pageX,
      y: e.pageY,
      ws:WindowSize
    });
  }
});
var indicador = function(Ims, x, y, degrees) {

  ctx.save();

  ctx.translate(x, y); //origen = centre pantalla

  ctx.rotate(degrees * Math.PI / 180); //Rotem tot el canvas uns degrees


  ctx.translate(0, -D[WindowSize].width / 2 + 1);

  rotateImageCenter(Ims, 0, 0, 0.5);

  ctx.restore();
}
var rotateImageCenter = function(image, Px, Py, degrees) {
  ctx.save();
  ctx.translate(Px, Py);
  ctx.rotate(degrees * Math.PI / 180);
  ctx.drawImage(image, -Px / 2, -Py / 2);
  //return to initial state
  ctx.restore();
  ctx.translate(-Px / 2, -Py / 2);
}

var rotateTextCenter = function(text, Px, Py, degrees) {
  ctx.save();
  ctx.translate(Px, Py);
  ctx.rotate(degrees * Math.PI / 180);
  ctx.fillText(text, -Px / 2, -Py / 2);
  //return to initial state
  ctx.restore();
  ctx.translate(-Px / 2, -Py / 2);
}

window.addEventListener('load', function() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  loadImages(imageArray, start);

}, false);

function loadImages(names, callback) {

  var n, name,
    result = [],
    count = names.length,
    onload = function() {
      if (--count == 0) {
        callback(result);
        ready2 = 1;
        ready3 = 1;
      }
    };
  oneOne = true;
  for (n = 0; n < names.length; n++) {
    name = names[n];
    result[n] = document.createElement('img');
    result[n].addEventListener('load', onload);
    if (web)
      result[n].src = "https://arroyo.herokuapp.com/client/img/" + name + ".png";
    else
      result[n].src = "./client/img/" + name + ".png";
  }

}


var RoundText = function(texto,angle){
  ctx.save();

  ctx.translate(window.innerWidth/2, window.innerHeight/2); //origen = centre pantalla


  var desplasamiento ;
  var despasito = 0;
  switch (WindowSize) {
    case 0:
      desplasamiento = D[WindowSize].width / 2 -60;
      ctx.font = "70px Segoe UI";
      angle+=5.25;
      despasito = 5;
      break;
    case 1:
      desplasamiento = D[WindowSize].width / 2 - 28;
      ctx.font = "35px Segoe UI";
      angle+=5.25;
      despasito = 8;
      break;
    case 2:
      desplasamiento = D[WindowSize].width / 2 - 20;
      ctx.font = "20px Segoe UI";
      angle+=7;
      despasito = 6;
      break;
  }

  ctx.rotate(angle * Math.PI / 180); //Rotem tot el canvas uns degrees
  ctx.translate(0, -desplasamiento + 1);


  ctx.fillStyle = "#ffffff";
  rotateTextCenter(texto,0,0,despasito);
  //ctx.fillText(texto,0,0);

  ctx.restore();
}
