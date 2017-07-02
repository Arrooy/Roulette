	var socket = io();

	var ErrorAnimation = "shake"

	//sign
	var signDiv = document.getElementById('signDiv');
	var signDivUsername = document.getElementById('signDiv-username');
	var signDivSignIn = document.getElementById('signDiv-signIn');
	var signDivSignUp = document.getElementById('signDiv-signUp');
	var signDivPassword = document.getElementById('signDiv-password');
	var ctx = document.getElementById("ctx").getContext("2d");
	var ctxUi = document.getElementById("ctx-ui").getContext("2d");

	var Fase1 = document.getElementById('CrearCuenta1');
	var Fase2 = document.getElementById('CrearCuenta2');
	var NextStep1 = document.getElementById('Step1');

	var CreateAccount = document.getElementById('CA');

	var ReHOme = document.getElementById('Step0');
	var GoInicio = document.getElementById('GoInicio');

	var ErrorType = 0;
	var tryedandFailedEmail = 0;
	var tryedandFailedAge = 0;
	var tryedandFailedPass1 = 0;
	var tryedandFailedPass2 = 0;
	var tryedandFailedPass3 = 0;
	var tryedandFailedUsername = 0;
	var ChatOpened;
	var adminColor = false;

	var CEmail = document.getElementById('CEmail');

	var CUsername = document.getElementById('CUsername');

	var CColor = document.getElementById('CColor');

	var CAge = document.getElementById('CAge');


	var CPassword1 = document.getElementById('CPassword1');

	var CPassword2 = document.getElementById('CPassword2');



	var Input = new input();

	$(function() {
	  $('[data-toggle="tooltip"]').tooltip()
	})



	 GoInicio.onclick = function() {
		Fase1.style.display = 'none';
 	  Fase2.style.display = 'none';
 	  signDiv.style.display = '';
		$("#ContainerMail").removeClass('animated infinite  ' + ErrorAnimation);
	  $("#CAgediv").removeClass('animated infinite  ' + ErrorAnimation);
	 }

	ReHOme.onclick = function() {
	  Fase1.style.display = '';
	  Fase2.style.display = 'none';
	  signDiv.style.display = 'none';
	  $("#ContainerMail").removeClass('animated infinite  ' + ErrorAnimation);
	  $("#CAgediv").removeClass('animated infinite  ' + ErrorAnimation);
	}

	NextStep1.onclick = function() {
	  $("#divPass1").removeClass('animated infinite  ' + ErrorAnimation);
	  $("#divPass2").removeClass('animated infinite  ' + ErrorAnimation);

	  tryedandFailedEmail = 0;
	  tryedandFailedAge = 0;
	  tryedandFailedPass1 = 0;
	  tryedandFailedPass2 = 0;
	  tryedandFailedPass3 = 0;
	  tryedandFailedUsername = 0;
	  var NoError = 1;
	  var data = CAge.value.split('-');
	  var UserAge = new Date();
	  UserAge.setFullYear(data[0], data[1] - 1, data[2]);
	  var LimitedAge = new Date();
	  LimitedAge.setFullYear(1999, 11, 31);
	  var countError = 0;
	  if (CEmail.value.indexOf('@') == -1) {
	    NoError = 0;

	    //ErrorType = 3;
	    //$('#alerta').modal('toggle');

	    tryedandFailedEmail = 1;
	    $("#CEmailLabel").css('color', '#F05941');
	    $("#ContainerMail").addClass('animated infinite ' + ErrorAnimation);

	  } else {
	    $("#CEmailLabel").css('color', '#2F1B41');
	  }
	  if (NoError == 1) {
	    if (data[0] == "" || data[1] == undefined || data[2] == undefined) {
	      NoError = 0;
	      countError = 1;
	      tryedandFailedAge = 1;
	      $("#LabelCAge").css('color', '#F05941');
	      $("#CAgediv").addClass('animated infinite  ' + ErrorAnimation);
	    } else {
	      $("#LabelCAge").css('color', '#2F1B41');
	    }
	  }
	  if (NoError == 1) {
	    if (UserAge > LimitedAge) {
	      NoError = 0;
	      //ErrorType = 4;
	      //$('#alerta').modal('toggle')

	      tryedandFailedAge = 1;
	      $("#LabelCAge").css('color', '#F05941');
	      $("#CAgediv").addClass('animated infinite  ' + ErrorAnimation);
	    } else {
	      $("#LabelCAge").css('color', '#2F1B41');
	    }
	  }
	  if (NoError === 1) {

	    Fase1.style.display = 'none';
	    Fase2.style.display = '';
	    signDiv.style.display = 'none';
	  }

	}
	CreateAccount.onclick = function() {
	  tryedandFailedEmail = 0;
	  tryedandFailedAge = 0;
	  tryedandFailedPass1 = 0;
	  tryedandFailedPass2 = 0;
	  tryedandFailedPass3 = 0;
	  tryedandFailedUsername = 0;
	  var error = 0;
	  if (CPassword1.value == "") {
	    $("#Pass1").css('color', '#F05941');
	    $('#divPass1').addClass('animated infinite  ' + ErrorAnimation);
	    error = 1;
	    tryedandFailedPass1 = 1;
	  } else {
	    $("#Pass1").css('color', '#2F1B41');
	  }

	  if (CPassword2.value == "") {
	    $("#Pass2").css('color', '#F05941');
	    $('#divPass2').addClass('animated infinite  ' + ErrorAnimation);
	    error = 1;
	    tryedandFailedPass2 = 1;
	  } else {
	    $("#Pass2").css('color', '#2F1B41');
	  }
	  if (CPassword1.value != CPassword2.value) {
	    error = 1;
	    $("#Pass1").css('color', '#F05941');
	    $("#Pass2").css('color', '#F05941');

	    /*ErrorType = 5;
	    $('#alerta').modal('toggle')*/

	    tryedandFailedPass3 = 1;
	    $('#divPass1').addClass('animated  infinite  ' + ErrorAnimation);
	    $('#divPass2').addClass('animated  infinite  ' + ErrorAnimation);
	  }
	  if (error == 0) {
	    flag = -1;
	    socket.emit('signUp', {
	      email: CEmail.value,
	      username: CUsername.value,
	      age: CAge.value,
	      color: CColor.value,
	      password: CPassword1.value
	    });
	  }


	}
	signDivSignIn.onclick = function() {
	  socket.emit('signIn', {
	    username: signDivUsername.value,
	    password: signDivPassword.value
	  });
	}
	signDivSignUp.onclick = function() {
	  Fase1.style.display = '';
	  Fase2.style.display = 'none';
	  signDiv.style.display = 'none';
	}

	$("#CEmail").hover(function() {
	  if (tryedandFailedEmail === 1) {
	    $("#ContainerMail").removeClass('animated infinite  ' + ErrorAnimation).addClass('animated  ' + ErrorAnimation);
	  }
	});
	$("#CAge").hover(function() {
	  if (tryedandFailedAge === 1) {
	    $("#CAgediv").removeClass('animated infinite  ' + ErrorAnimation).addClass('animated  ' + ErrorAnimation);
	  }
	});
	$("#CPassword1").hover(function() {
	  if (tryedandFailedPass1 === 1 || tryedandFailedPass3 === 1) {
	    $("#divPass1").removeClass('animated infinite  ' + ErrorAnimation).addClass('animated  ' + ErrorAnimation);
	    $("#divPass2").removeClass('animated infinite  ' + ErrorAnimation).addClass('animated  ' + ErrorAnimation);
	  }
	});
	$("#CPassword2").hover(function() {
	  if (tryedandFailedPass1 === 1 || tryedandFailedPass3 === 1) {
	    $("#divPass1").removeClass('animated infinite  ' + ErrorAnimation).addClass('animated  ' + ErrorAnimation);
	    $("#divPass2").removeClass('animated infinite  ' + ErrorAnimation).addClass('animated  ' + ErrorAnimation);
	  }
	});
	$("#CUsername").hover(function() {
	  if (tryedandFailedUsername === 1) {
	    $("#ContainerUsername").removeClass('animated infinite  ' + ErrorAnimation).addClass('animated  ' + ErrorAnimation);
	  }
	});

	socket.on('signInResponse', function(data) {

	  if (data.success) {
	    signDiv.style.display = 'none';
	    gameDiv.style.display = 'inline-block';
	    ctx.canvas.width = window.innerWidth;
	    ctx.canvas.height = window.innerHeight;
	    ctxUi.canvas.width = "0px";
	    ctxUi.canvas.height = "0px";

	  } else {
	    ErrorType = 2;
	    $('#alerta').modal('toggle')
	  }

	  //
	});

	socket.on('signUpResponse', function(data) {
	  if (data.success) {

	    Fase1.style.display = 'none';
	    Fase2.style.display = 'none';
	    signDiv.style.display = '';
	    $("#CUsernameLabel").css('color', '#2F1B41');
	  } else {
	    ErrorType = 1;
	    $("#CUsernameLabel").css('color', '#F05941');
	    $('#alerta').modal('toggle');
	    tryedandFailedUsername = 1;
	    $("#ContainerUsername").removeClass('animated infinite  ' + ErrorAnimation);

	  }
	});

	$('#alerta').on('show.bs.modal', function(event) {
	  var modal = $(this)

	  switch (ErrorType) {
	    case 1: //Error signUp
	      modal.find('#tituloModal').text('This is weird...');
	      modal.find('#textoModal').text('Your account Username is taken! Try with another one please');
	      Fase1.style.display = '';
	      Fase2.style.display = 'none';
	      signDiv.style.display = 'none';
	      break;

	    case 2: //Error signUp
	      modal.find('#tituloModal').text('Well...');
	      modal.find('#textoModal').text('Combination wrong. Feel free to try again!');
	      break;
	      /*case 3://Error signUp
	      modal.find('#tituloModal').text('Email error!')
	      modal.find('#textoModal').text('What about using a correct E-MAIL')
	      	break;*/
	      /*case 4://Error signUp
	      modal.find('#tituloModal').text('Too little: ')
	      modal.find('#textoModal').text('This game ROULES doesnt let you come in. You must be 18 to play.')
	      	break;*/
	      /*case 5://Error signUp
	      modal.find('#tituloModal').text('Passwords arent the same')
	      modal.find('#textoModal').text('Try to insert the SAME password in both fields.')
	      	break;*/
	    default:
	      modal.find('#tituloModal').text('OH')
	      modal.find('#textoModal').text('Our tech group failed, report us')

	  }

	})

	//chat
	var chatText = document.getElementById('chat-text');
	var chatInput = document.getElementById('chat-input');
	var chatForm = document.getElementById('chat-form');
	var EverChatSow;


	$("#chat-input").focus(function() {
	  if (EverChatSow == 1) {
	    chatText.style.display = "inline-block";
	  }



	}).blur(function() {
	  chatText.style.display = "none";
	});


	socket.on('addToChat', function(data) {

	  if (data.admin === true) {
	    chatText.innerHTML += '<div id = "Comment" name="admin" style ="color:' + data.color + '">' + data.message + '</div>';
	    adminColor = true;
	  } else {
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
	  EverChatSow = 1;
	  e.preventDefault();
	  if (chatInput.value[0] === '@') {

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

	  } else {
	    socket.emit('sendMsgToServer', chatInput.value);
	  }
	  chatInput.value = '';
	}



	var Img = {};

	Img.cursor = new Image();

	Img.minero = new Image();
	Img.mine = new Image();
	Img.explode = new Image();
	Img.minerIco = new Image();

	Img.grass = new Image();
	var knight = [];
	for(var x = 1;x <= 29;x++){
		knight[x] = new Image();
		knight[x].src = 'client/img/bronze_knight/' + x + '.png';
	}
	//all + 1
	//0-3 attack
	//4-9 dead
	//10 - 13 hurt
	//14 - 18 idle
	// 19 - 23 run
	//24 - 28 walk


	var angle = 0;
	var i = 0;
	var j = 0;
	var prevTime = 0;
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
	  Img.cursor.src = '/client/img/' + self.cur + '.png';
		Img.minero.src = '/client/img/Miner.png';
		Img.mine.src = '/client/img/mine.png';
		Img.explode.src = '/client/img/explosion.png';
		Img.minerIco.src = '/client/img/minerIco.png';
		Img.grass.src = '/client/img/grass.png';


	  self.draw = function() {

			var AnimationSpeed = 100;
	    if (selfId != self.id) {
	      if (self.cur != undefined) {

						//rotarImagen("ctx",Img.minero,0,self.x,self.y,"CENTER","SpriteVertical",0,i*72,72,72);
						//rotarImagen("ctx",Img.mine,0,self.x,self.y,"CENTER","SpriteVertical",0,i*96,96,96);
						rotarImagen("ctx",Img.explode,0,self.x,self.y,"CENTER","SpriteVertical",i*64,j * 64,64,64);
						//rotarImagen("ctx",Img.minerIco,0,self.x,self.y,"CENTER");
						//rotarImagen("ctx",Img.grass,0,self.x,self.y,"CENTER");
						//rotarImagen("ctx",knight[i],0,j*20,self.y,"CENTER");

						curTime = +new Date();
						if(curTime - prevTime >= AnimationSpeed){
							i++;
							prevTime = curTime;
						}
						if(i == 8){
							i = 0;
							j++;
						}

						if(j == 3){
							j=0;
						}
	      }
	      return;
	   }
	  }

	  Player.list[self.id] = self;

	  return self;
	}
	Player.list = {};

	var selfId = null;

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

	setInterval(function() {
	  if (adminColor === true) {
	    var a = document.getElementsByName('admin');
	    var i = 0;
	    for (i = 0; i < a.length; i++) {
	      a[i].style.color = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
	    }
	  }

	  if (!selfId)
	    return;

	  ctx.clearRect(0, 0, document.getElementById('ctx').width, document.getElementById('ctx').height);

	  for (var i in Player.list)
	    Player.list[i].draw();

	}, 40);

	document.onkeypress = function(event) {
	  var letra = event.keyCode;
	  //socket.emit('keyPress',{inputId:'key',key: letra,state:true});
	  if ($('#signDiv').css('display') == 'block') {
	    if (letra === 13) {
	      $('#signDiv-signIn').trigger('click');
	    }
	  } else {
	    //Inside game
	  }

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

	rotarImagen = function(NombreCanvas,Img,angle,x,y,Locations,Type,initx,inity,width,height){
		angle = angle * Math.PI / 180;
		if(Type === "SpriteVertical"){
			ctxx = document.getElementById(NombreCanvas).getContext("2d");
			ctxx.save();
			ctxx.translate(x, y);
			ctxx.rotate(angle);
			ctxx.drawImage(Img,initx,inity,width,height,width / -2,height / -2,width,height);
			ctxx.restore();
		}else{
			if(Locations === "center" ||Locations === "Center"||Locations === "CENTER"){
				ctxx = document.getElementById(NombreCanvas).getContext("2d");
				ctxx.save();
				ctxx.translate(x, y);
				ctxx.rotate(angle);
				if(width == undefined ||height == undefined){
					ctxx.drawImage(Img,Img.width / -2,Img.height / -2, Img.width, Img.height);
				}else{
					ctxx.drawImage(Img,width / -2,height / -2, width, height);
				}
				ctxx.restore();
			}else if(Locations === "leftUp"||Locations === "left-up"||Locations === "leftup"||Locations === "LeftUp"||Locations === "LEFTUP"){
				ctxx = document.getElementById(NombreCanvas).getContext("2d");
				ctxx.save();
				ctxx.translate(x - Img.width / 2 , y - Img.height / 2);
				ctxx.rotate(angle);
				ctxx.drawImage(Img,Img.width / 2, Img.height / 2, Img.width, Img.height);
				ctxx.restore();
			}
		}
	}

OrientadoA = function(Px,Py,Ox,Oy,Quadrante){

	var AB =  Vector.Create(Px,Py,Ox,Oy);
var Neutro;
	if(Quadrante === 0){
	  Neutro = Vector.Create(0,0,1,0);
	}else if(Quadrante ===1 ){
		Neutro = Vector.Create(1,0,0,0);
	}else if(Quadrante ===2 ){
		Neutro = Vector.Create(0,0,1,0);
	}else if(Quadrante ===3 ){
		Neutro = Vector.Create(1,0,0,0);
	}

	var jeje = Vector.Angle(AB,Neutro);
	return jeje / Math.PI*180;
}

Distancia = function(Px,Py,Ox,Oy){
	return (Math.sqrt(Math.pow((Px-Ox),2)+Math.pow((Py-Oy),2)));
}

var Vector = {
	"Create": function(Px,Py,Ox,Oy){
		return [Math.abs(-Px+Ox),Math.abs(-Py+Oy)];
	},
	"Angle": function(vec1,vec2){
		return Math.acos( (Vector.ProducteEscalar(vec1,vec2)) / ( Vector.Modulo(vec1) * Vector.Modulo(vec2) ) );
	},
	"Modulo": function(array){
		return Math.sqrt(Math.pow(array[0],2)+Math.pow(array[1],2));
	},
	"ProducteEscalar":function(vec1,vec2){
		return (vec1[0]*vec2[0] + vec1[1]*vec2[1]);
	}
}
