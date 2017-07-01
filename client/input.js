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

  self.LastDir = "";


  function ProcessaKeyEvent(key, state) {
    switch (key) {
      case 32:
        self.space = state;
        break;
      case 87:
        self.up = state;
        lastDir = "w";
        break;
      case 65:
        self.left = state;
        lastDir = "a";
        break;
      case 83:
        self.down = state;
        lastDir = "s";
        break;
      case 68:
        self.right = state;
        lastDir = "d";
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
      default:

    }
  }

  document.addEventListener('keydown', function(e) {
    ProcessaKeyEvent(e.keyCode, true);
  });
  document.addEventListener('keyup', function(e) {
    ProcessaKeyEvent(e.keyCode, false);
  });
}
