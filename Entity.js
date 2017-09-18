adminId = 0;

var initPack = {
  player: []
};
var removePack = {
  player: []
};

Entity = function(param) {
  var self = {
    x: 0,
    y: 0,
    id: "",
  }
  if (param) {
    if (param.x)
      self.x = param.x;
    if (param.y)
      self.y = param.y;
    if (param.lvl)
      self.lvl = param.lvl;
    if (param.id)
      self.id = param.id;
  }
  return self;
}

Entity.getFrameUpdateDate = function() {
  var pack = {
    initPack: {
      player: initPack.player,
    },
    removePack: {
      player: removePack.player,
    },
    updatePack: {
      player: Player.update(),
    },
  };
  initPack.player = [];
  removePack.player = [];
  return pack;
}


Player = function(param) {
  var self = Entity(param);

  self.name = param.name;
  self.xp = param.xp;
  self.color = param.color;
  self.pasta = param.pasta;
  self.press = false;
  self.cur = param.cur;
  self.actualCur = 0;
  self.admin = param.admin;
  self.selection = 16;
  self.ableToBet = false;

  self.update = function() {
    if (self.selection != 16 && self.press === true && self.ableToBet === true) {
      //bet
    }
  }

  self.getInitPack = function() {
    return {
      id: self.id,
      xp: self.xp,
      name: self.name,
      lvl: self.lvl,
      pasta: self.pasta,
      cur: self.cur[self.actualCur],
      x: self.x,
      y: self.y,
      admin: self.admin
    };
  }
  self.getUpdatePack = function() {
    return {
      id: self.id,
      xp: self.xp,
      lvl: self.lvl,
      pasta: self.pasta,
      cur: self.cur[self.actualCur],
      x: self.x,
      y: self.y,
      selection: self.selection
    }
  }

  Player.list[self.id] = self;

  initPack.player.push(self.getInitPack());
  return self;
}

Player.list = {};

dist = function(Px, Py, Ox, Oy) {
  return (Math.sqrt(Math.pow((Px - Ox), 2) + Math.pow((Py - Oy), 2)));
}
var Angle = function(vec1, vec2) {
  return (Math.acos((ProducteEscalar(vec1, vec2)) / (Modulo(vec1) * Modulo(vec2))) * 180 / 3.141592);
}
var Modulo = function(array) {
  return Math.sqrt(Math.pow(array[0], 2) + Math.pow(array[1], 2));
}
var ProducteEscalar = function(vec1, vec2) {
  return (vec1[0] * vec2[0] + vec1[1] * vec2[1]);
}
Player.onConnect = function(socket, data) {

  var player = Player({
    id: socket.id,
    lvl: data[0].lvl,
    name: data[0].username,
    socket: socket,
    color: data[0].color,
    cur: data[0].cur,
    xp: data[0].xp,
    pasta: data[0].pasta,
    admin: data[0].admin
  });

  socket.on('mouseMoved', function(data) {
    Player.list[socket.id].x = data.x;
    Player.list[socket.id].y = data.y;

    var SelectionAngle = Angle([data.x - data.cx, data.y - data.cy], [0, -100]);

    if (data.x < data.cx) {
      SelectionAngle = 360 - SelectionAngle;
    }
    SelectionAngle = Math.floor(SelectionAngle / 22.5) * 22.5;
    var distan = dist(data.cx, data.cy, data.x, data.y);

    if (distan < data.r[0] && distan > data.r[1]) {
      Player.list[socket.id].selection = SelectionAngle;

    } else {
      Player.list[socket.id].selection = 16;
    }
  });

  socket.on('press', function(data) {
    Player.list[socket.id].press = true;
  });
  socket.on('release', function(data) {
    Player.list[socket.id].press = false;
  });

  socket.on('sendMsgToServer', function(data) {

    for (var i in SOCKET_LIST) {
      if (Player.list[socket.id].admin === true) {
        SOCKET_LIST[i].emit('addToChat', {
          message: data,
          color: Player.list[socket.id].color,
          name: Player.list[socket.id].name,
          admin: true
        });
      } else {
        SOCKET_LIST[i].emit('addToChat', {
          message: Player.list[socket.id].name + ': ' + data,
          color: Player.list[socket.id].color,
          admin: false
        });
      }


    }
  });

  socket.on('sendPmToServer', function(data) {
    var recipientSocket = null;
    for (var i in Player.list) {
      if (Player.list[i].name === data.username)
        recipientSocket = SOCKET_LIST[i];
    }
    if (recipientSocket === null) {
      socket.emit('addToChat', {
        message: 'The player ' + data.username + 'is not connected',
        color: "#000000",
        admin: false
      });
    } else {
      recipientSocket.emit('addToChat', {
        message: 'Private message from ' + player.name + ": " + data.message,
        color: "#000000",
        admin: false
      });
      socket.emit('addToChat', {
        message: 'Player ' + data.username + " recived : " + data.message,
        color: "#000000",
        admin: false
      });
    }
  });

  socket.emit('init', {
    selfId: socket.id,
    player: Player.getAllInitPack(),
  })
}
Player.getAllInitPack = function() {
  var players = [];
  for (var i in Player.list)
    players.push(Player.list[i].getInitPack());
  return players;
}

Player.onDisconnect = function(socket) {
  delete Player.list[socket.id];
  removePack.player.push(socket.id);
}
Player.update = function() {
  var pack = [];
  for (var i in Player.list) {
    var player = Player.list[i];
    player.update();
    pack.push(player.getUpdatePack());
  }
  return pack;
}
