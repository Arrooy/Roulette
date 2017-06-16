	var socket = io();

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

	var ErrorType ;
	var ChatOpened;
	var adminColor = false;

	var CEmail = document.getElementById('CEmail');

	var CUsername = document.getElementById('CUsername');

	var CColor = document.getElementById('CColor');

	var CAge = document.getElementById('CAge');


	var CPassword1 = document.getElementById('CPassword1');

	var CPassword2 = document.getElementById('CPassword2');

	ReHOme.onclick = function(){
		Fase1.style.display = '';
		Fase2.style.display = 'none';
		signDiv.style.display = 'none';
	}

	NextStep1.onclick =function(){
		var NoError = 1;
		var data = CAge.value.split('-');
		var UserAge = new Date();
		UserAge.setFullYear(data[0],data[1]-1,data[2]);
		var LimitedAge = new Date();
		LimitedAge.setFullYear(1999,11,31);
		var countError = 0;
		if(CEmail.value.indexOf('@') == -1){
			NoError = 0;
			ErrorType = 3;
			$("#CEmailLabel").css('color','#F05941');
			$('#alerta').modal('toggle')
		}else{
			$("#CEmailLabel").css('color','#2F1B41');
		}
		if(NoError == 1){
			if (data[0] == "" || data[1] == undefined || data[2] == undefined){
				NoError = 0;
				countError = 1;
				$("#LabelCAge").css('color','#F05941');
			}else{
				$("#LabelCAge").css('color','#2F1B41');
			}
		}
		if(NoError == 1){
			if(UserAge > LimitedAge){
				NoError = 0;
				ErrorType = 4;
				$("#LabelCAge").css('color','#F05941');
				$('#alerta').modal('toggle')
			}else{
				$("#LabelCAge").css('color','#2F1B41');
			}
		}
		if(NoError === 1){

			Fase1.style.display = 'none';
			Fase2.style.display = '';
			signDiv.style.display = 'none';
		}

	}
	CreateAccount.onclick = function(){
		var error = 0;
		if(CPassword1.value == ""){
			$("#Pass1").css('color','#F05941');
			error = 1;
		}else{
			$("#Pass1").css('color','#2F1B41');
		}

		if(CPassword2.value == ""){
			$("#Pass2").css('color','#F05941');
			error = 1;
		}else{
			$("#Pass2").css('color','#2F1B41');
		}
		if(CPassword1.value != CPassword2.value){
			error = 1;
			ErrorType = 5;
			$('#alerta').modal('toggle')
		}
		if(error == 0){
			socket.emit('signUp',{
				email:CEmail.value,
				username:CUsername.value,
				age:CAge.value,
				color:CColor.value,
				password:CPassword1.value
			});
		}


	}
	signDivSignIn.onclick = function(){
		socket.emit('signIn',{username:signDivUsername.value,password:signDivPassword.value});
	}
	signDivSignUp.onclick = function(){
		Fase1.style.display = '';
		Fase2.style.display = 'none';
		signDiv.style.display = 'none';

	}
	socket.on('signInResponse',function(data){
		if(data.success){
			signDiv.style.display = 'none';
			gameDiv.style.display = 'inline-block';
			ctx.canvas.width = window.innerWidth;
			ctx.canvas.height = window.innerHeight;
			ctxUi.canvas.width = "0px";
			ctxUi.canvas.height ="0px";

		} else{
			ErrorType = 2;
			$('#alerta').modal('toggle')
		}

//
	});

	socket.on('signUpResponse',function(data){
		if(data.success){

			Fase1.style.display = 'none';
			Fase2.style.display = 'none';
			signDiv.style.display = '';
			$("#CUsernameLabel").css('color','#2F1B41');
		}else{
			ErrorType = 1;
			$("#CUsernameLabel").css('color','#F05941');
			$('#alerta').modal('toggle')
		}
	});

	$('#alerta').on('show.bs.modal', function (event) {
  var modal = $(this)

	switch (ErrorType) {
		case 1://Error signUp
		modal.find('#tituloModal').text('This is weird...')
		modal.find('#textoModal').text('Your account Username is taken! try again')
		Fase1.style.display = '';
		Fase2.style.display = 'none';
		signDiv.style.display = 'none';
			break;

			case 2://Error signUp
			modal.find('#tituloModal').text('Well...')
			modal.find('#textoModal').text('Combination wrong. Feel free to try again!')
				break;
				case 3://Error signUp
				modal.find('#tituloModal').text('Email error!')
				modal.find('#textoModal').text('What about using a correct E-MAIL')
					break;
					case 4://Error signUp
					modal.find('#tituloModal').text('Too little: ')
					modal.find('#textoModal').text('This game ROULES doesnt let you come in. You must be 18 to play.')
						break;
						case 5://Error signUp
						modal.find('#tituloModal').text('Passwords arent the same')
						modal.find('#textoModal').text('Try to insert the SAME password in both fields.')
							break;
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
		if(EverChatSow == 1){
			chatText.style.display = "inline-block";
		}



	}).blur(function() {
		chatText.style.display = "none";
	});


	socket.on('addToChat',function(data){

		if(data.admin === true){
			chatText.innerHTML += '<div id = "Comment" name="admin" style ="color:'+data.color+'">' + data.message + '</div>';
			adminColor = true;
		}else{
			var divisios = [];
			var numberN = 0;
			for(var i = data.message.length/40;i>=0;i--){
				chatText.innerHTML += '<div id = "Comment" style ="color:'+data.color+'">'+data.message.slice(numberN,numberN+40) + '</div>';
				numberN +=40;
			}
		}

		chatText.scrollTop = chatText.scrollHeight;
	});

	chatForm.onsubmit = function(e){
		EverChatSow = 1;
		e.preventDefault();
		if(chatInput.value[0] === '@'){

			if(chatInput.value.indexOf(",") !== -1){
				if(chatInput.value.slice(1,chatInput.value.indexOf(',')) !== Player.list[selfId].name){

					socket.emit('sendPmToServer',{
						username:chatInput.value.slice(1,chatInput.value.indexOf(',')),
						message:chatInput.value.slice(chatInput.value.indexOf(',') + 1),
					});

				}else{
					chatText.innerHTML += '<div style ="color:#000000">Que solo estas...</div>';
				}

				}else{
				chatText.innerHTML += '<div style ="color:#000000">Error, La sintaxis requiere @USERNAME,MESSAGE</div>';
			}

		}else{
			socket.emit('sendMsgToServer',chatInput.value);
		}
		chatInput.value = '';
	}


	var Img = {};

	Img.cursor = new Image();



	var Player = function(initPack){
		var self = {};
		self.id = initPack.id;
		self.hp = initPack.hp;
		self.hpMax = initPack.hpMax;
		self.xp = initPack.xp;
		self.name = initPack.name;
		self.lvl = initPack.lvl;
		self.team = initPack.team;
		self.cur = initPack.cur;
		self.x = initPack.x;
		self.y = initPack.y;
		Img.cursor.src = '/client/img/'+self.cur+'.png';

		self.draw = function(){



			if(selfId != self.id){
				if(self.cur != undefined){
						ctx.drawImage(Img.cursor,0,0,Img.cursor.width,Img.cursor.height,self.x-Img.cursor.width/2,self.y-Img.cursor.height/2,Img.cursor.width,Img.cursor.height);
				}
				return;
			}

		}

		Player.list[self.id] = self;

		return self;
	}
  Player.list = {};

	var selfId = null;

	socket.on('init',function(data){
		if(data.selfId)
			selfId = data.selfId;

		for(var i = 0 ; i < data.player.length; i++){
			new Player(data.player[i]);
		}
	});

	socket.on('update',function(data){

		for(var i = 0 ; i < data.player.length; i++){
			var pack = data.player[i];
			var p = Player.list[pack.id];
			if(p){
				if(pack.hp !== undefined)
					p.hp = pack.hp;
				if(pack.xp !== undefined)
					p.xp = pack.xp;
				if(pack.lvl !== undefined)
					p.lvl = pack.lvl;
				if(pack.hpMax !== undefined)
					p.hpMax = pack.hpMax;
				if(pack.team !== undefined)
					p.team = pack.team;
				if(pack.cur !== undefined)
					p.cur = pack.cur;
					if(pack.x !== undefined)
						p.x = pack.x;
					if(pack.y !== undefined)
						p.y = pack.y;
			}
		}
	});

	socket.on('remove',function(data){
		for(var i = 0 ; i < data.player.length; i++){
			delete Player.list[data.player[i]];
		}
	});

	setInterval(function(){
		if(adminColor === true){
      var a  = document.getElementsByName('admin');
      var i = 0;
      for(i = 0;i<a.length;i++){
        a[i].style.color = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
      }
		}

		if(!selfId)
			return;

		ctx.clearRect(0,0,document.getElementById('ctx').width,document.getElementById('ctx').height);

		for(var i in Player.list)
			Player.list[i].draw();

	},40);

	document.onmousedown = function(event){
		socket.emit('keyPress',{inputId:'press',x:event.clientX,y:event.clientY,state:true});
	}
	document.onmouseup = function(event){
		socket.emit('keyPress',{inputId:'press',x:event.clientX,y:event.clientY,state:false});
	}
	document.onmousemove = function(event){
		socket.emit('keyPress',{inputId:'mouseMoved',x:event.clientX,y:event.clientY});
	}

	document.oncontextmenu = function(event){
		event.preventDefault();
	}
