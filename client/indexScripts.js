	var socket = io();

	//sign
	var signDiv = document.getElementById('signDiv');
	var signDivUsername = document.getElementById('signDiv-username');
	var signDivSignIn = document.getElementById('signDiv-signIn');
	var signDivSignUp = document.getElementById('signDiv-signUp');
	var signDivPassword = document.getElementById('signDiv-password');
	var ctx = document.getElementById("ctx").getContext("2d");
	var ctxUi = document.getElementById("ctx-ui").getContext("2d");
	var ErrorType ;

	var adminColor = false;

	signDivSignIn.onclick = function(){
		socket.emit('signIn',{username:signDivUsername.value,password:signDivPassword.value});
	}
	signDivSignUp.onclick = function(){
		socket.emit('signUp',{username:signDivUsername.value,password:signDivPassword.value});
	}
	socket.on('signInResponse',function(data){
		if(data.success){
			signDiv.style.display = 'none';
			gameDiv.style.display = 'inline-block';


		} else{
			ErrorType = 2;
			$('#alerta').modal('toggle')
		}

//
	});

	socket.on('signUpResponse',function(data){
		if(data.success)

		else{
			ErrorType = 1;
			$('#alerta').modal('toggle')
		}
	});

	$('#alerta').on('show.bs.modal', function (event) {
  var modal = $(this)
	console.log(ErrorType);
	switch (ErrorType) {
		case 1://Error signUp
		modal.find('#tituloModal').text('This is weird...')
		modal.find('#textoModal').text('We cant handle your account, try again in about 3 minutes.')
			break;

			case 2://Error signUp
			modal.find('#tituloModal').text('Well...')
			modal.find('#textoModal').text('Combination wrong. Feel free to try again!')
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

	socket.on('addToChat',function(data){
		if(data.admin === true){
			chatText.innerHTML += '<div name="admin" style ="color:'+data.color+'">' + data.message + '</div>';
			adminColor = true;
		}else{
			var divisios = [];
			var numberN = 0;
			for(var i = data.message.length/40;i>=0;i--){
				chatText.innerHTML += '<div style ="color:'+data.color+'">'+data.message.slice(numberN,numberN+40) + '</div>';
				numberN +=40;
			}
		}

		chatText.scrollTop = chatText.scrollHeight;
	});

	chatForm.onsubmit = function(e){
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


	/*var Img = {};

	Img.hgun1r = new Image();
	Img.hgun1r.src = '/client/img/6right.png';
  */

	var Player = function(initPack){
		var self = {};
		self.id = initPack.id;
		self.hp = initPack.hp;
		self.hpMax = initPack.hpMax;
		self.xp = initPack.xp;
		self.name = initPack.name;
		self.lvl = initPack.lvl;
		self.team = initPack.team;

		self.draw = function(){


			ctx.fillStyle = 'black';
			ctx.fillText(self.name + " ( "+self.team + " "+self.lvl+" )",x - 2.5*self.hpMax,y-50,100);

			if(selfId != self.id)
				return;
			var xp = self.xp;
			ctx.fillStyle = 'black';
			ctx.fillRect(0,HEIGHT - 15,WIDTH - 505,12);
			ctx.fillStyle = 'green';
			ctx.fillRect(0,HEIGHT - 15,(WIDTH - 505)*(self.xp/(10*self.lvl)),12);
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

		ctx.clearRect(0,0,WIDTH,HEIGHT);

		for(var i in Player.list)
			Player.list[i].draw();

	},40);

	document.onmousedown = function(event){
		socket.emit('keyPress',{inputId:'press',x:event.clientX,y:event.clientY,state:true});
	}
	document.onmouseup = function(event){
		socket.emit('keyPress',{inputId:'press',x:event.clientX,y:event.clientY,state:false});
	}

	document.oncontextmenu = function(event){
		event.preventDefault();
	}
