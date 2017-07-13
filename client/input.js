input = function() {
  self = this;

  self.left = false;
  self.right = false;
  self.up = false;
  self.down = false;

  self.space = false;

  self.aleft = false;
  self.aright = false;
  self.aup = false;
  self.adown = false;

  self.return = false;


  function ProcessaKeyEvent(key, state) {
    switch (key) {
      case 87:
        self.up = state;
        break;
      case 65:
        self.left = state;
        break;
      case 83:
        self.down = state;
        break;
      case 68:
        self.right = state;
        break;

      case 32:
        self.space = state;
        break;

      case 38:
        self.aup = state;
        break;
      case 37:
        self.aleft = state;
        break;
      case 39:
        self.aright = state;
        break;
      case 40:
        self.adown = state;
        break;

      case 13:
        self.return = state;
        break;
      default:

    }

    //socket.emit('keyPress',{inputId:'key',key: event.keyCode,state:true});
    if ($('#signDiv').css('display') == 'block') {
      if (self.return === true) {
        $('#signDiv-signIn').trigger('click');
      }
    } else {
      //Inside game
    }
  }

  document.addEventListener('keydown', function(e) {
    ProcessaKeyEvent(e.keyCode, true);
  });
  document.addEventListener('keyup', function(e) {
    ProcessaKeyEvent(e.keyCode, false);
  });
}

document.onmousedown = function(event) {
  socket.emit('keyPress', {
    inputId: 'press',
    x: event.clientX,
    y: event.clientY,
    state: true
  });
}
document.onmouseup = function(event) {
  socket.emit('keyPress', {
    inputId: 'press',
    x: event.clientX,
    y: event.clientY,
    state: false
  });
}
document.onmousemove = function(event) {
  socket.emit('keyPress', {
    inputId: 'mouseMoved',
    x: event.clientX,
    y: event.clientY
  });
}

document.oncontextmenu = function(event) {
  event.preventDefault();
}
