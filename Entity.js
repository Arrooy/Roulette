
adminId = 0;

var initPack = {player:[],bullet:[]};
var removePack = {player:[],bullet:[]};



Entity = function(param){
	var self = {
		x:250,
		y:250,
		spdX:0,
		spdY:0,
		id:"",
		maplvl:1,
		
	}
	if(param){
		if(param.x)
			self.x = param.x;
		if(param.y)
			self.y = param.y;
		if(param.maplvl)
			self.maplvl = param.maplvl;
		if(param.id)
			self.id = param.id;
		
		
	}
	self.update = function(){
		self.updatePosition();
	}
	self.updatePosition = function(){
		self.x += self.spdX;
		self.y += self.spdY;
	}
	self.getDistance = function(pt){
		return Math.sqrt(Math.pow(self.x-pt.x,2) + Math.pow(self.y-pt.y,2));
	}
	return self;
}
Entity.getFrameUpdateDate = function(){
	var pack = {
		initPack:{
			player:initPack.player,
			bullet:initPack.bullet,
		},
		removePack:{
			player:removePack.player,
			bullet:removePack.bullet,
		},
		updatePack:{
			player:Player.update(),
			bullet:Bullet.update(),
		},
	};
	initPack.player = [];
	initPack.bullet = [];
	removePack.player = [];
	removePack.bullet = [];
	return pack;
}
var randomVar = 0;

Player = function(param){
	var self = Entity(param);
	
	
	self.name = param.name;
	self.pressingRight = false;
	self.pressingLeft = false;
	self.pressingUp = false;
	self.pressingDown = false;
	self.pressingAttack = false;
	self.mouseAngle = 0;
	self.maxSpd = 10;
	self.hp = 10;
	self.hpMax = 10;
	self.score = 0;
	self.color = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
	self.inventory = new Inventory(param.socket,true);
		
	var super_update = self.update;
	self.update = function(){
		self.updateSpd();
		
		
		if(self.score >= 1){
			self.inventory.addItem("potion",1);
			self.score = 0;
		}
		if(self.inventory.hasItem("potion",randomVar)){
			self.inventory.addItem("superatack",1);
			randomVar+=5;
		}
		
		super_update();
		
		if(self.pressingAttack){
			self.shootBullet(self.mouseAngle);
		}
	}
	self.shootBullet = function(angle){	
		Bullet({
			parent:self.id,
			angle:angle,
			x:self.x,
			y:self.y,
			maplvl:self.maplvl,
		});
	}
	
	self.updateSpd = function(){
		if(self.pressingRight)
			self.spdX = self.maxSpd;
		else if(self.pressingLeft)
			self.spdX = -self.maxSpd;
		else
			self.spdX = 0;
		
		if(self.pressingUp)
			self.spdY = -self.maxSpd;
		else if(self.pressingDown)
			self.spdY = self.maxSpd;
		else
			self.spdY = 0;		
	}
	
	self.getInitPack = function(){
		return {
			id:self.id,
			x:self.x,
			y:self.y,	
			number:self.number,	
			hp:self.hp,
			hpMax:self.hpMax,
			score:self.score,
			name:self.name,
			maplvl:self.maplvl,
		};		
	}
	self.getUpdatePack = function(){
		return {
			id:self.id,
			x:self.x,
			y:self.y,
			hp:self.hp,
			score:self.score,
			maplvl:self.maplvl,
		}	
	}
	
	Player.list[self.id] = self;
	
	initPack.player.push(self.getInitPack());
	return self;
}
Player.list = {};
Player.onConnect = function(socket,data){
	var map = 1;
	WIDTH = data.width;
	HEIGHT = data.height;
	var player = Player({
		id:socket.id,
		maplvl:map,
		name:data.username,
		socket:socket,
	});
	
	socket.on('keyPress',function(data){
		if(data.inputId === 'left')
			player.pressingLeft = data.state;
		else if(data.inputId === 'right')
			player.pressingRight = data.state;
		else if(data.inputId === 'up')
			player.pressingUp = data.state;
		else if(data.inputId === 'down')
			player.pressingDown = data.state;
		else if(data.inputId === 'attack')
			player.pressingAttack = data.state;
		else if(data.inputId === 'mouseAngle')
			player.mouseAngle = data.state;
		else if(data.inputId === 'space')
			player.pressingAttack = data.state;
		
	});
	
	socket.on('sendMsgToServer',function(data){
		var admin = false;
		for(var i in SOCKET_LIST){
			if(Player.list[socket.id].name === "Admin"){
				adminId = socket.id;
				 admin = true;
			}
			
			SOCKET_LIST[i].emit('addToChat',{message:Player.list[socket.id].name + ': ' + data,color:Player.list[socket.id].color,admin:admin});
			
		}
	});
	
	socket.on('sendPmToServer',function(data){
		var recipientSocket = null;
		for(var i in Player.list){
			if(Player.list[i].name === data.username)
				recipientSocket = SOCKET_LIST[i];		
		}
		if(recipientSocket === null){
			socket.emit('addToChat',{message:'The player ' + data.username + 'is not connected',color:"#000000",admin:false});
		}else{
			recipientSocket.emit('addToChat',{message:'Private message from ' + player.name + ": " + data.message,color:"#000000",admin:false});
			socket.emit('addToChat',{message:'Player ' + data.username + " recived : " + data.message,color:"#000000",admin:false});
		}
	});
	
	socket.on('evalServer',function(data){
		if(!DEBUG)
			return;
		var res = eval(data);
		socket.emit('evalAnswer',res);		
	});
	
	socket.emit('init',{
		selfId:socket.id,
		player:Player.getAllInitPack(),
		bullet:Bullet.getAllInitPack(),
	})
}
Player.getAllInitPack = function(){
	var players = [];
	for(var i in Player.list)
		players.push(Player.list[i].getInitPack());
	return players;
}

Player.onDisconnect = function(socket){
	delete Player.list[socket.id];
	removePack.player.push(socket.id);
}
Player.update = function(){
	var pack = [];
	for(var i in Player.list){
		var player = Player.list[i];
		player.update();
		pack.push(player.getUpdatePack());		
	}
	return pack;
}

Bullet = function(param){
	var self = Entity(param);
	self.id = Math.random();
	self.spdX = Math.cos(param.angle/180*Math.PI) * 10;
	self.spdY = Math.sin(param.angle/180*Math.PI) * 10;
	self.angle = param.angle;
	self.parent = param.parent;
	self.timer = 0;
	self.toRemove = false;
	var super_update = self.update;
	
	
	self.update = function(){
		if(self.timer++ > 100)
			self.toRemove = true;
		super_update();
		
		for(var i in Player.list){
			var p = Player.list[i];
			if(self.maplvl === p.maplvl && self.getDistance(p) < 32 && self.parent !== p.id){
				p.hp -= 1;
								
				if(p.hp <= 0){
					var shooter = Player.list[self.parent];
					if(shooter)
						shooter.score += 1;
					p.hp = p.hpMax;
					p.x = Math.random() * WIDTH;
					p.y = Math.random() * HEIGHT;					
				}
				self.toRemove = true;
			}
		}
	}
	self.getInitPack = function(){
		return {
			id:self.id,
			x:self.x,
			y:self.y,	
			maplvl:self.maplvl
		};
	}
	self.getUpdatePack = function(){
		return {
			id:self.id,
			x:self.x,
			y:self.y,		
		};
	}
	
	Bullet.list[self.id] = self;
	initPack.bullet.push(self.getInitPack());
	return self;
}
Bullet.list = {};

Bullet.update = function(){
	var pack = [];
	for(var i in Bullet.list){
		var bullet = Bullet.list[i];
		bullet.update();
		if(bullet.toRemove){
			delete Bullet.list[i];
			removePack.bullet.push(bullet.id);
		} else
			pack.push(bullet.getUpdatePack());		
	}
	return pack;
}

Bullet.getAllInitPack = function(){
	var bullets = [];
	for(var i in Bullet.list)
		bullets.push(Bullet.list[i].getInitPack());
	return bullets;
}
