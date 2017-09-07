var socket = io();
var ErrorAnimation = "shake"
var ready = 0;
ctx = $("#GameCanvas")[0].getContext('2d'); //HEROORR
//Error detection
var ErrorType = 0;
var tryedandFailedEmail = 0;
var tryedandFailedAge = 0;
var tryedandFailedPass1 = 0;
var tryedandFailedPass2 = 0;
var tryedandFailedPass3 = 0;
var tryedandFailedUsername = 0;

var gameStart = 0;
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


  if ($("#CEmail").val().indexOf('@') == -1) {
    NoError = 0;
    tryedandFailedEmail = 1;
    $("#CEmailLabel").css('color', '#F05941');
    $("#ContainerMail").addClass('animated infinite ' + ErrorAnimation);

  } else {
    $("#CEmailLabel").css('color', '#2F1B41');
  }


  if ($("#CUsername").val().length < 5) {
    NoError = 0;
    tryedandFailedUsername = 1;
    $("#CUsernameLabel").css('color', '#F05941');
    $("#ContainerUsername").addClass('animated infinite  ' + ErrorAnimation);
  }

  if (NoError == 1) {
    if (data[0] == "" || data[1] == undefined || data[2] == undefined) {
      NoError = 0;

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

document.addEventListener('keypress', function(e) {

  if ($("#CrearCuenta2").css("display") !== "none" && e.keyCode === 13) {
    $('#CA').click();
  }

  if ($("#CrearCuenta1").css("display") !== "none" && e.keyCode === 13) {
    $('#Step1').click();
  }
  if ($("#signDiv").css("display") !== "none" && e.keyCode === 13) {
    $('#signDiv-signIn').click();
  }
});

socket.on('signInResponse', function(data) {

  if (data.success) {
    setUp();
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

var setUp = function() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  $("#gameDiv").css("display", "inline-block");
  $("#signDiv").css("display", "none");
  ready = 1;
}
