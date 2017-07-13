	var socket = io();
	var ErrorAnimation = "shake"

	ctx = $("#GameCanvas")[0].getContext('2d');
	//Error detection
	var ErrorType = 0;
	var tryedandFailedEmail = 0;
	var tryedandFailedAge = 0;
	var tryedandFailedPass1 = 0;
	var tryedandFailedPass2 = 0;
	var tryedandFailedPass3 = 0;
	var tryedandFailedUsername = 0;

	//Input help load
	$(function() {
	  $('[data-toggle="tooltip"]').tooltip()
	})
	//SignUp - SignIn Dynamics
	$("#GoInicio").click(function() {
	  $("#CrearCuenta1").css("display", "none");
	  $("#CrearCuenta2").css("display", "none");
	  $("#signDiv").css("display", "");
	  $("#ContainerMail").removeClass('animated infinite  ' + ErrorAnimation);
	  $("#CAgediv").removeClass('animated infinite  ' + ErrorAnimation);
	});
	$("#Step0").click(function() {
	  $("#CrearCuenta1").css("display", "");
	  $("#CrearCuenta2").css("display", "none");
	  $("#signDiv").css("display", "none");
	  $("#ContainerMail").removeClass('animated infinite  ' + ErrorAnimation);
	  $("#CAgediv").removeClass('animated infinite  ' + ErrorAnimation);
	});
	$("#Step1").click(function() {
	  $("#divPass1").removeClass('animated infinite  ' + ErrorAnimation);
	  $("#divPass2").removeClass('animated infinite  ' + ErrorAnimation);

	  tryedandFailedEmail = 0;
	  tryedandFailedAge = 0;
	  tryedandFailedPass1 = 0;
	  tryedandFailedPass2 = 0;
	  tryedandFailedPass3 = 0;
	  tryedandFailedUsername = 0;
	  var NoError = 1;
	  var data = $("#CAge").val().split('-');
	  var UserAge = new Date();
	  var LimitedAge = new Date();
	  UserAge.setFullYear(data[0], data[1] - 1, data[2]);
	  LimitedAge.setFullYear(1999, 11, 31);
	  var countError = 0;

	  if ($("#CEmail").val().indexOf('@') == -1) {
	    NoError = 0;
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
	    if (UserAge > LimitedAge || UserAge > 100) {
	      NoError = 0;
	      tryedandFailedAge = 1;
	      $("#LabelCAge").css('color', '#F05941');
	      $("#CAgediv").addClass('animated infinite  ' + ErrorAnimation);
	    } else {
	      $("#LabelCAge").css('color', '#2F1B41');
	    }
	  }
	  if (NoError === 1) {
	    $("#CrearCuenta1").css("display", "none");
	    $("#CrearCuenta2").css("display", "");
	    $("#signDiv").css("display", "none");
	  }

	});
	$("#CA").click(function() {
	  tryedandFailedEmail = 0;
	  tryedandFailedAge = 0;
	  tryedandFailedPass1 = 0;
	  tryedandFailedPass2 = 0;
	  tryedandFailedPass3 = 0;
	  tryedandFailedUsername = 0;
	  var error = 0;
	  if ($("#CPassword1").val() == "") {
	    $("#Pass1").css('color', '#F05941');
	    $('#divPass1').addClass('animated infinite  ' + ErrorAnimation);
	    error = 1;
	    tryedandFailedPass1 = 1;
	  } else {
	    $("#Pass1").css('color', '#2F1B41');
	  }

	  if ($("#CPassword2").val() == "") {
	    $("#Pass2").css('color', '#F05941');
	    $('#divPass2').addClass('animated infinite  ' + ErrorAnimation);
	    error = 1;
	    tryedandFailedPass2 = 1;
	  } else {
	    $("#Pass2").css('color', '#2F1B41');
	  }
	  if ($("#CPassword1").val() != $("#CPassword2").val()) {
	    error = 1;
	    $("#Pass1").css('color', '#F05941');
	    $("#Pass2").css('color', '#F05941');
	    tryedandFailedPass3 = 1;
	    $('#divPass1').addClass('animated  infinite  ' + ErrorAnimation);
	    $('#divPass2').addClass('animated  infinite  ' + ErrorAnimation);
	  }
	  if (error == 0) {
	    socket.emit('signUp', {
	      email: $("#CEmail").val(),
	      username: $("#CUsername").val(),
	      age: $("#CAge").val(),
	      color: $("#CColor").val(),
	      password: $("#CPassword1").val()
	    });
	  }
	});
	$("#signDiv-signIn").click(function() {
	  socket.emit('signIn', {
	    username: $("#signDiv-username").val(),
	    password: $("#signDiv-password").val()
	  });
	});
	$("#signDiv-signUp").click(function() {
	  $("#CrearCuenta1").css("display", "");
	  $("#CrearCuenta2").css("display", "none");
	  $("#signDiv").css("display", "none");
	});
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
	$('#alerta').on('show.bs.modal', function(event) {
	  var modal = $(this)
	  switch (ErrorType) {
	    case 1: //Error signUp
	      modal.find('#tituloModal').text('This is weird...');
	      modal.find('#textoModal').text('Your account Username is taken! Try with another one please');
	      $("#CrearCuenta1").css("display", "");
	      $("#CrearCuenta2").css("display", "none");
	      $("#signDiv").css("display", "none");
	      break;
	    case 2: //Error signUp
	      modal.find('#tituloModal').text('Well...');
	      modal.find('#textoModal').text('Combination wrong. Feel free to try again!');
	      break;
	    default:
	      modal.find('#tituloModal').text('OH')
	      modal.find('#textoModal').text('Our tech group failed, report us')

	  }
	});

	socket.on('signInResponse', function(data) {

	  if (data.success) {
	    $("#gameDiv").css("display", "inline-block");
	    $("#signDiv").css("display", "none");


	    ctx.canvas.width = window.innerWidth;
	    ctx.canvas.height = window.innerHeight;


	  } else {
	    ErrorType = 2;
	    $('#alerta').modal('toggle')
	  }

	  //
	});
	socket.on('signUpResponse', function(data) {
	  if (data.success) {
	    $("#CrearCuenta1").css("display", "none");
	    $("#CrearCuenta2").css("display", "none");
	    $("#signDiv").css("display", "");
	    $("#CUsernameLabel").css('color', '#2F1B41');
	  } else {
	    ErrorType = 1;
	    $("#CUsernameLabel").css('color', '#F05941');
	    $('#alerta').modal('toggle');
	    tryedandFailedUsername = 1;
	    $("#ContainerUsername").removeClass('animated infinite  ' + ErrorAnimation);

	  }
	});

	var Input = new input();

	var Img = {};
	Img.cursor = new Image();
	Img.minero = new Image();
	Img.mine = new Image();
	Img.explode = new Image();
	Img.minerIco = new Image();
	Img.groundBasic = new Image();
	Img.limit = new Image();


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
	  Img.groundBasic.src = '/client/img/grass.png';
	  Img.limit.src = '/client/img/Limits.png';


	  self.draw = function() {

	    var AnimationSpeed = 100;
	    if (selfId != self.id) {
	      if (self.cur != undefined) {

	        //rotarImagen("ctx",Img.minero,0,self.x,self.y,"CENTER","SpriteVertical",0,i*72,72,72);
	        //rotarImagen("ctx",Img.mine,0,self.x,self.y,"CENTER","SpriteVertical",0,i*96,96,96);
	        //rotarImagen("ctx",Img.explode,0,self.x,self.y,"CENTER","SpriteVertical",i*64,j * 64,64,64);
	        //rotarImagen("ctx",Img.minerIco,0,self.x,self.y,"CENTER");
	        //rotarImagen("ctx",Img.groundBasic,0,self.x,self.y,"CENTER");
	        //rotarImagen("ctx",knight[i],0,j*20,self.y,"CENTER");

	      }
	      return;
	    }
	  }

	  Player.list[self.id] = self;

	  return self;
	}

	var selfId = null;
	Player.list = {};

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


	var millis = 0;
	var lastMillis = 0;

	Mines = new buildMines(0, 0, 12, 40, 40);

	var Resolution = window.innerWidth / window.innerHeight;

	var intento = 10;
	$(window).resize(function() {
	  location.reload();
	});

	setInterval(function() {
	  millis = +new Date();

	  var a = document.getElementsByName('admin');
	  var i = 0;
	  for (i = 0; i < a.length; i++) {
	    a[i].style.color = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
	  }

	  console.log(window.innerWidth + " " + window.innerHeight);


	  if (!selfId)
	    return;


	  ctx.clearRect(0, 0, $("#GameCanvas").css("width"), $("#GameCanvas").css("height"));


	  //Terrain
	  for (var x = -1; x < window.innerWidth / Img.groundBasic.width; x++) {
	    for (var y = -1; y < window.innerHeight / Img.groundBasic.height; y++) {
	      ctx.drawImage(Img.groundBasic, x * Img.groundBasic.width, y * Img.groundBasic.height, Img.groundBasic.width + 1, Img.groundBasic.height + 1);
	    }
	  }


	  for (var x = 0; x < window.innerWidth / intento; x++) {
	    //ctx.drawImage(Img.limit,x*Img.limit.width,0, Img.limit.width, Img.limit.height);
	    rotarImagen("GameCanvas", Img.limit, 0, intento / 2 + x * intento, 150, "leftUp", "SpriteVertical", 0, 0, 64, 64, intento, intento);
	  }
	  /*
	  		for(var x = 0;x < window.innerWidth / Img.limit.width ;x++){
	  			ctx.drawImage(Img.limit,x*Img.limit.width,window.innerHeight - Img.limit.height/2, Img.limit.width, Img.limit.height);
	  		}
	  		for(var y = 0;y < window.innerHeight / Img.limit.height ;y++){
	  			ctx.drawImage(Img.limit,Img.limit.width,Img.limit.height * y, Img.limit.width, Img.limit.height);
	  		}
	  		for(var y = 0;y < window.innerHeight / Img.limit.height ;y++){
	  			ctx.drawImage(Img.limit,window.innerWidth - Img.limit.width/2,Img.limit.height * y, Img.limit.width, Img.limit.height);
	  		}
	  */


	  //Minas
	  for (var x = 0; x < Mines.numeroMinas; x++) {
	    rotarImagen("GameCanvas", Img.mine, 0, Mines.Minax[x], Mines.Minay[x], "CENTER", "SpriteVertical", 0, Mines.FrameMina[x] * 96, 96, 96, Mines.widthMina, Mines.heightMina);
	    FrameMina = Math.round(Math.random() * 1);
	  }


	  for (var i in Player.list)
	    Player.list[i].draw();

	}, 40);


	rotarImagen = function(NombreCanvas, Img, angle, x, y, Locations, Type, initx, inity, width, height, desiredSizex, desiredSizey) {
	  angle = angle * Math.PI / 180;
	  if (Type === "SpriteVertical") {
	    ctxx = document.getElementById(NombreCanvas).getContext("2d");
	    ctxx.save();
	    ctxx.translate(x, y);
	    ctxx.rotate(angle);
	    if (desiredSizey == undefined) {
	      ctxx.drawImage(Img, initx, inity, width, height, width / -2, height / -2, width, height);
	    } else {
	      ctxx.drawImage(Img, initx, inity, width, height, width / -2, height / -2, desiredSizex, desiredSizey);
	    }

	    ctxx.restore();
	  } else {
	    if (Locations === "center" || Locations === "Center" || Locations === "CENTER") {
	      ctxx = document.getElementById(NombreCanvas).getContext("2d");
	      ctxx.save();
	      ctxx.translate(x, y);
	      ctxx.rotate(angle);
	      if (width == undefined || height == undefined) {
	        ctxx.drawImage(Img, Img.width / -2, Img.height / -2, Img.width, Img.height);
	      } else {
	        ctxx.drawImage(Img, width / -2, height / -2, width, height);
	      }
	      ctxx.restore();
	    } else if (Locations === "leftUp" || Locations === "left-up" || Locations === "leftup" || Locations === "LeftUp" || Locations === "LEFTUP") {
	      ctxx = document.getElementById(NombreCanvas).getContext("2d");
	      ctxx.save();
	      ctxx.translate(x - Img.width / 2, y - Img.height / 2);
	      ctxx.rotate(angle);
	      ctxx.drawImage(Img, Img.width / 2, Img.height / 2, Img.width, Img.height);
	      ctxx.restore();
	    }
	  }
	}

	OrientadoA = function(Px, Py, Ox, Oy, Quadrante) {

	  var AB = Vector.Create(Px, Py, Ox, Oy);
	  var Neutro;
	  if (Quadrante === 0) {
	    Neutro = Vector.Create(0, 0, 1, 0);
	  } else if (Quadrante === 1) {
	    Neutro = Vector.Create(1, 0, 0, 0);
	  } else if (Quadrante === 2) {
	    Neutro = Vector.Create(0, 0, 1, 0);
	  } else if (Quadrante === 3) {
	    Neutro = Vector.Create(1, 0, 0, 0);
	  }

	  var jeje = Vector.Angle(AB, Neutro);
	  return jeje / Math.PI * 180;
	}

	Distancia = function(Px, Py, Ox, Oy) {
	  return (Math.sqrt(Math.pow((Px - Ox), 2) + Math.pow((Py - Oy), 2)));
	}

	var Vector = {
	  "Create": function(Px, Py, Ox, Oy) {
	    return [Math.abs(-Px + Ox), Math.abs(-Py + Oy)];
	  },
	  "Angle": function(vec1, vec2) {
	    return Math.acos((Vector.ProducteEscalar(vec1, vec2)) / (Vector.Modulo(vec1) * Vector.Modulo(vec2)));
	  },
	  "Modulo": function(array) {
	    return Math.sqrt(Math.pow(array[0], 2) + Math.pow(array[1], 2));
	  },
	  "ProducteEscalar": function(vec1, vec2) {
	    return (vec1[0] * vec2[0] + vec1[1] * vec2[1]);
	  }
	}
