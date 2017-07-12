//chat
chat = function(){
  self = this;

  self.chatText = document.getElementById('chat-text');
  self.chatInput = document.getElementById('chat-input');
  self.chatForm = document.getElementById('chat-form');
  self.EverChatSow;

  $("#chat-input").focus(function() {
    if (self.EverChatSow == 1) {
      self.chatText.style.display = "inline-block";
    }

  }).blur(function() {
    self.chatText.style.display = "none";
  });


  socket.on('addToChat', function(data) {

    if (data.admin === true) {
      self.chatText.innerHTML += '<div id = "Comment" name="admin" style ="color:' + data.color + '">' + data.message + '</div>';
      adminColor = true;
    } else {
      var divisios = [];
      var numberN = 0;
      for (var i = data.message.length / 40; i >= 0; i--) {
        self.chatText.innerHTML += '<div id = "Comment" style ="color:' + data.color + '">' + data.message.slice(numberN, numberN + 40) + '</div>';
        numberN += 40;
      }
    }

    self.chatText.scrollTop = self.chatText.scrollHeight;
  });

  self.chatForm.onsubmit = function(e) {
    self.EverChatSow = 1;
    e.preventDefault();
    if (self.chatInput.value[0] === '@') {

      if (self.chatInput.value.indexOf(",") !== -1) {
        if (self.chatInput.value.slice(1, self.chatInput.value.indexOf(',')) !== Player.list[selfId].name) {

          socket.emit('sendPmToServer', {
            username: self.chatInput.value.slice(1, self.chatInput.value.indexOf(',')),
            message: self.chatInput.value.slice(self.chatInput.value.indexOf(',') + 1),
          });

        } else {
          self.chatText.innerHTML += '<div style ="color:#000000">Que solo estas...</div>';
        }

      } else {
        self.chatText.innerHTML += '<div style ="color:#000000">Error, La sintaxis requiere @USERNAME,MESSAGE</div>';
      }

    } else {
      socket.emit('sendMsgToServer', self.chatInput.value);
    }
    self.chatInput.value = '';
  }
}
