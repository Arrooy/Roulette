var chatText = document.getElementById('chat-text');
var chatInput = document.getElementById('chat-input');
var chatForm = document.getElementById('chat-form');

var chatTextSize = 14;




$("#comment-container").mouseover(function() {
  //chatText.style.display = "inline-block";
  $("#chat-text").css('max-height', window.innerHeight + "px");

});

$("#comment-container").mouseleave(function() {
  //chatText.style.display = "none";
  $("#chat-text").css('max-height', '150px');
  $("#chat-text").scrollTop($('#chat-text').prop('scrollHeight'));
});

socket.on('addToChat', function(data) {

  if (data.admin === true) {
    console.log("sSI!");
    chatText.innerHTML += '<div id = "Comment" style ="color:' + data.color + '">' + '<span class = "label label-success" >' + "Admin" + '</span>' + data.message + '</div > ';
  } else {
    console.log("NO!!");
    var divisios = [];
    var numberN = 0;
    for (var i = data.message.length / 40; i >= 0; i--) {

      chatText.innerHTML += '<div id = "Comment" style ="color:' + data.color + '">' + data.message.slice(numberN, numberN + 40) + '</div>';
      numberN += 40;
    }
  }
  chatText.scrollTop = chatText.scrollHeight;
});

chatForm.onsubmit = function(e) {

  e.preventDefault();

  /*if (chatInput.value[0] === '@') {

    if (chatInput.value.indexOf(",") !== -1) {
      if (chatInput.value.slice(1, chatInput.value.indexOf(',')) !== Player.list[selfId].name) {

        socket.emit('sendPmToServer', {
          username: chatInput.value.slice(1, chatInput.value.indexOf(',')),
          message: chatInput.value.slice(chatInput.value.indexOf(',') + 1),
        });

      } else {
        chatText.innerHTML += '<div style ="color:#000000">Que solo estas...</div>';
      }

    } else {
      chatText.innerHTML += '<div style ="color:#000000">Error, La sintaxis requiere @USERNAME,MESSAGE</div>';
    }

 } else {*/

  socket.emit('sendMsgToServer', chatInput.value);
  //}
  chatInput.value = '';
}
