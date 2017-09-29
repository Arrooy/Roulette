var OFFLINE = false;



var mongoClient = require("mongojs");
var url = 'mongodb://arroyoarroyo:adriaarroyo@ds127864.mlab.com:27864/accounts_ruleta?authMechanism=SCRAM-SHA-1';
var db = mongoClient(url, []);

require('./Entity');

var ActualPlayerNumber = 0;

var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

serv.listen(process.env.PORT || 2000);
console.log("Server started.");


SOCKET_LIST = {};
if (OFFLINE) {

} else {
  db.on('error', function(err) {
    console.log('database error', err)
  })
  db.runCommand({
    ping: 1
  }, function(err, res) {
    if (!err && res.ok) {
      console.log('Connection done')
    }
  })
}


var isValidPassword = function(data, cb) {


  db.account.find({
    username: data.username,
    password: data.password
  }, function(err, res) {
    if (res.length > 0) {

      return cb(true);
    } else {
      return cb(false);
    }

  });

}

var isUsernameTaken = function(data, cb) {
  db.account.find({
    username: data.username
  }, function(err, res) {
    if (res.length > 0)
      cb(true);
    else
      cb(false);
  });
}

var addUser = function(data, cb) {
  db.account.insert({
    _id: data.email,
    email: data.email,
    username: data.username,
    password: data.password,
    color: data.color,
    age: data.age,
    xp: 0,
    pasta: 100,
    cur: ["cursorBasic"],
    lvl: 0,
    admin: false,
    dntSTut:false
  }, function(err, doc) {
    return cb();
  });
}
var consultaInfo = function(socket, data) {


  if(data.username.indexOf("@") === -1){
    db.account.find({
      username: data.username,
      password: data.password
    }, function(err, res) {
      ActualPlayerNumber++;

      Player.onConnect(socket, res);

      socket.emit('signInResponse', {
        success: true
      });
    });
  }else{
    db.account.find({
      email: data.username,
      password: data.password
    }, function(err, res) {
      ActualPlayerNumber++;

      Player.onConnect(socket, res);

      socket.emit('signInResponse', {
        success: true
      });
    });
  }


}


var io = require('socket.io')(serv, {});
io.sockets.on('connection', function(socket) {
  socket.id = Math.random();
  SOCKET_LIST[socket.id] = socket;

  socket.on('signIn', function(data) {

    if (OFFLINE) {
      ActualPlayerNumber++;
      Player.onConnect(socket, [{
        username: "OflineModeON",
        cur: ["cursorBasic"],
        admin: true,
        pasta:500
      }]);
      socket.emit('signInResponse', {
        success: true
      });
    } else {


      isValidPassword(data, function(res) {
        if (res) {
          consultaInfo(socket, data);
        } else {
          db.account.find({
            email: data.username,
            password: data.password
          }, function(err, res) {
            if (res.length > 0) {

              consultaInfo(socket, data);
            } else {
              socket.emit('signInResponse', {
                success: false
              });
            }
          });
        }
      });
    }

  });

  socket.on('signUp', function(data) {
    isUsernameTaken(data, function(res) {
      if (res) {
        socket.emit('signUpResponse', {
          success: false
        });
      } else {
        addUser(data, function() {
          socket.emit('signUpResponse', {
            success: true
          });
        });
      }
    });
  });


  socket.on('disconnect', function() {

    delete SOCKET_LIST[socket.id];
    ActualPlayerNumber--;
    Player.onDisconnect(socket);
  });
});

var guardarServidor = function(username,moneyToUpdate){
  db.account.find({
    email: data.username,
    password: data.password
  }, function(err, res) {

  });
  db.account.insert({username:username}, {pasta: moneyToUpdate}, function(err, records){


  });
}

var Degree = 0;
var velocidad = 0;
var freno = 0;

var Stop = false;
var finishedRound = false;
var justElectOneTime = true;

var winnerSector = 0;
var startMovingCorrection = false;

var timeLeft = 0;

var lastMillis = 0;

var roll = function() {
  //Degree = Math.round(rand(0, 360));
  velocidad = Math.round(rand(40, 50));
  freno = rand(0.2, 2);
}
var rand = function(min, max) {
  return (Math.random() * (min - max) + max)
}
var updateRouletteMovement = function() {
  var returner = false;
  Degree = Degree + velocidad;
  velocidad = velocidad - freno;

  if (Degree >= 360) Degree = 0;

  if (velocidad <= 0) {
    freno = 0;
    velocidad = 0;
    returner = true;
  }
  return returner;
}
var decideSide = function(alfa) {
  //cada 22.5 alfas, cambiamos de sector
  //recordem que primer sector es el 0 lultim el 15
  var SectorAnterior = 0;
  var SectorPosterior = 0;
  var resultado = 0;
  //Se puede reducir a añadir el i+1 como al posterior. pero el tamaño de GOLD puede variar.
  for (var i = 0; i < 16; i++) {
    if (i * 22.5 < alfa) {
      SectorAnterior = i;
    } else {
      SectorPosterior = i;
      break;
    }
  }

  //Degree es el punt esquerra dreta situat en la circumferencia.
  if (alfa < (SectorAnterior * 22.5 + 11.25)) {
    resultado = SectorAnterior;
  } else if (alfa > (SectorAnterior * 22.5 + 11.25)) {
    resultado = SectorPosterior;
  } else {
    //Spatch
    if (Math.round(rand(0, 1)) == 0)
      resultado = SectorAnterior;
    else
      resultado = SectorPosterior;
  }

  return resultado;
}
var moveToSector = function(Sector, alfa) {
  var beta = Sector * 22.5;

  var returner = 0;
  var speed = 0.1;

  alfa = Math.round(alfa * 10) / 10;
  beta = Math.round(beta * 10) / 10;
  if (alfa > beta) {
    if (Sector == 0) {
      returner = +speed;
      if (alfa + speed > 360)
        alfa = 0;
    } else {
      returner = -speed;
    }


  } else if (alfa < beta) {

    if (Sector == 0) {
      returner = -speed;
      if (alfa - speed < 0)
        alfa = 360;
    } else {
      returner = +speed;
    }

  } else {
    finishedRound = true;
  }
console.log(alfa + " "+ beta);

  return returner;
}
var RestartVarsNewGame = function() {
  finishedRound = false;
  justElectOneTime = true;
  startMovingCorrection = false;
  lastMillis = millis();
}
var millis = function() {
  var d = new Date();
  var n = d.getTime();
  return n;
}
var DecideWinner = function() {
  if (justElectOneTime === true) {
    setTimeout(function() {

      winnerSector = decideSide(Degree);
      startMovingCorrection = true;
    }, 500);

    justElectOneTime = false;
  }

  if (startMovingCorrection == true) {
    Degree += moveToSector(winnerSector, Degree);
  }
}

var justOneTime = true;
var justOne = true;
RestartVarsNewGame();
roll();
setInterval(function() {


  Stop = updateRouletteMovement();

  if (Stop == true) {
    DecideWinner();
  }

  if (finishedRound == true) {
    if (justOneTime == true) {

      setTimeout(function() {
        Player.checkCanBet(false);
      }, 6900);
      setTimeout(function() {

        RestartVarsNewGame();
        roll();
        justOneTime = true;
        justOne = true;

      }, 7500);
      justOneTime = false;
    }

  }
  var packs = Entity.getFrameUpdateDate();
  for (var i in SOCKET_LIST) {
    var socket = SOCKET_LIST[i];
    socket.emit('init', packs.initPack);
    socket.emit('update', packs.updatePack);
    socket.emit('remove', packs.removePack);
    socket.emit('roulette', Degree);
  }
  if (finishedRound == true && justOne == true) {
    for (var i in SOCKET_LIST) {
      var socket = SOCKET_LIST[i];
      socket.emit('SectorWinner', winnerSector);
      Player.givePresents(winnerSector);
      Player.checkCanBet(true);

    }
    justOne = false;
  }
}, 1000 / 25);
