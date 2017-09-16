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
  self.team = param.team;
  self.press = false;
  self.cur = param.cur;
  self.actualCur = 0;
  self.admin = param.admin;

  self.update = function() {

  }

  self.getInitPack = function() {
    return {
      id: self.id,
      xp: self.xp,
      name: self.name,
      lvl: self.lvl,
      team: self.team,
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
      team: self.team,
      cur: self.cur[self.actualCur],
      x: self.x,
      y: self.y
    }
  }

  Player.list[self.id] = self;

  initPack.player.push(self.getInitPack());
  return self;
}

Player.list = {};

Player.onConnect = function(socket, data) {

  var player = Player({
    id: socket.id,
    lvl: data[0].lvl,
    name: data[0].username,
    socket: socket,
    color: data[0].color,
    cur: data[0].cur,
    xp: data[0].xp,
    team: data[0].team,
    admin: data[0].admin
  });

  socket.on('mouseMoved', function(data) {
    Player.list[socket.id].x = data.x;
    Player.list[socket.id].y = data.y;
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
