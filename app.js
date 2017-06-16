//var mongojs = require("mongojs");
//var db = null;//mongojs('localhost:27017/myGame', ['account','progress']);


var mongoClient = require("node_modules/mongodb").MongoClient;
var url = "mongodb://roulette:hn85YJZ9pNpaTbxiTGtMKodxJroA8JvyKlwzs8K764TdFRSUx7bMv0xupDCFMQ8wdSmAJy9WtNtSipiqoA2E1A==@roulette.documents.azure.com:10255/?ssl=true";
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  db.createCollection("Accounts", function(err, res) {
    if (err) throw err;
    console.log("Table created!");
    db.close();
  });
});

require('./Entity');


var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));

serv.listen(process.env.PORT || 2000);
console.log("Server started.");

SOCKET_LIST = {};


var isValidPassword = function(data,cb){
	return cb(true);
	/*db.account.find({username:data.username,password:data.password},function(err,res){
		if(res.length > 0)
			cb(true);
		else
			cb(false);
	});*/
}
var isUsernameTaken = function(data,cb){
	return cb(false);
	/*db.account.find({username:data.username},function(err,res){
		if(res.length > 0)
			cb(true);
		else
			cb(false);
	});*/
}

var addUser = function(data,cb){
	return cb();
	/*db.account.insert({username:data.username,password:data.password},function(err){
		cb();
	});*/
}

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
	socket.id = Math.random();
	SOCKET_LIST[socket.id] = socket;

	socket.on('signIn',function(data){

		isValidPassword(data,function(res){
			if(res){
				Player.onConnect(socket,data);

				socket.emit('signInResponse',{success:true});
			} else {
				socket.emit('signInResponse',{success:false});
			}
		});
	});
	socket.on('signUp',function(data){
		isUsernameTaken(data,function(res){
			if(res){
				socket.emit('signUpResponse',{success:false});
			} else {
				addUser(data,function(){
					socket.emit('signUpResponse',{success:true});
				});
			}
		});
	});


	socket.on('disconnect',function(){
		delete SOCKET_LIST[socket.id];
		Player.onDisconnect(socket);
	});
});



setInterval(function(){
	var packs = Entity.getFrameUpdateDate();

	for(var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		socket.emit('init',packs.initPack);
		socket.emit('update',packs.updatePack);
		socket.emit('remove',packs.removePack);
	}
},1000/25);
