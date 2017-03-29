
adminId = 0;

var initPack = {player:[],bullet:[]};
var removePack = {player:[],bullet:[]};

var DEBUG = false;

Entity = function(param){
	var self = {
		x:250,
		y:250,
		spdX:0,
		spdY:0,
		id:"",
		lvl:1,
	}
	if(param){
		if(param.x)
			self.x = param.x;
		if(param.y)
			self.y = param.y;
		if(param.lvl)
			self.lvl = param.lvl;
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
	
	self.team = param.team;
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
	self.xp = 1;
	self.color = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
	
	self.inventory = new Inventory(param.socket,true);	
	self.range = 10;
	self.amoSize = 15;
	self.amoDmage = 1;
	self.kills = 0;
	self.hpregen = 0;
	self.attackSpeed = 10;
	self.arma = "pistola";
	self.amoSpeed = 13;
	
	self.cooldown = 0;
	self.regenNotFull = true;
	var super_update = self.update;
	
	self.update = function(){
		
		self.updateSpd();
				
		if(self.regenNotFull === true)
			self.hp += self.hpregen;
		
		if(self.hp >= self.hpMax){
			self.hp = self.hpMax;
			self.regenNotFull = false;
		}else{
			self.regenNotFull = true;
		}
			
		if(self.xp >= 10*self.lvl){
			self.lvl++;
			self.xp = 0;
			if(self.lvl === 2){
			   self.inventory.addItem("metralleta",1,"weapon");
			   }
			if(self.lvl === 3){
			   self.inventory.addItem("escopeta",1,"weapon");
			   }
			if(self.lvl === 4){
			   self.inventory.addItem("bazoka",1,"weapon");
			   }
			
			
			
			self.inventory.addItem("potion",1,"consumable");
			self.inventory.addItem("regenup",1,"upgrade");
			self.inventory.addItem("hpup",1,"upgrade");
			self.inventory.addItem("speedup",1,"upgrade");
			self.inventory.addItem("dmageup",1,"upgrade");
			self.inventory.addItem("amosizeup",1,"upgrade");
			self.inventory.addItem("rangeup",1,"upgrade");
			self.inventory.addItem("atackspeedup",1,"upgrade");
			//LEVEL UP
		}
		
		super_update();
		self.cooldown += 1;
		
		if(self.pressingAttack){
			if(self.arma === "escopeta" && self.cooldown >= self.attackSpeed*1.8){
				for(var i = -8; i <= 8;i+=2){
					self.shootBullet(self.mouseAngle + i);
				}
				self.cooldown = 0;
			}else if (self.arma === "metralleta" && self.cooldown >= self.attackSpeed*0.5){
				self.shootBullet(self.mouseAngle);
				self.cooldown = 0;
			}else if(self.cooldown >= self.attackSpeed && self.arma === "pistola"  ){
				self.shootBullet(self.mouseAngle);
				self.cooldown = 0;
			}else if(self.cooldown >= self.attackSpeed*5 && self.arma === "bazoka" ){
				
			}
			
		}
	}

	self.shootBullet = function(angle){	
		Bullet({
			parent:self.id,
			angle:angle,
			x:self.x,
			y:self.y,
			lvl:self.lvl,
			range:self.range,
			amoSize:self.amoSize,
			bulletDmage:self.amoDmage,
			speed:self.amoSpeed,
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
			xp:self.xp,
			name:self.name,
			lvl:self.lvl,
			kills:self.kills,
			damage:self.amoDmage,
			range:self.range,
			amoSize:self.amoSize,
			spd:self.maxSpd,
			atackSpeed:self.attackSpeed,
			team:self.team,
			angle:self.mouseAngle,
		};		
	}
	self.getUpdatePack = function(){
		return {
			id:self.id,
			x:self.x,
			y:self.y,
			hp:self.hp,
			hpMax:self.hpMax,
			xp:self.xp,
			lvl:self.lvl,
			kills:self.kills,
			damage:self.amoDmage,
			range:self.range,
			amoSize:self.amoSize,
			spd:self.maxSpd,
			team:self.team,
			angle:self.mouseAngle,
		}	
	}
	
	Player.list[self.id] = self;
	
	initPack.player.push(self.getInitPack());
	return self;
}
Player.list = {};
Player.onConnect = function(socket,data){
	var lvl = 1;
	WIDTH = data.width;
	HEIGHT = data.height;
	var player = Player({
		id:socket.id,
		lvl:lvl,
		name:data.username,
		socket:socket,
		team:data.team,
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
			if(admin === true){
				SOCKET_LIST[i].emit('addToChat',{message:RandomAdmin + ': ' + data,color:Player.list[socket.id].color,admin:admin});
			}else{
				SOCKET_LIST[i].emit('addToChat',{message:Player.list[socket.id].name + ': ' + data,color:Player.list[socket.id].color,admin:admin});	
			}
			
			
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
	self.maxSpeed = param.speed;
	self.spdX = Math.cos(param.angle/180*Math.PI) * self.maxSpeed;
	self.spdY = Math.sin(param.angle/180*Math.PI) * self.maxSpeed;
	self.angle = param.angle;
	self.parent = param.parent;
	self.timer = 0;
	self.toRemove = false;
	
	self.range = param.range;//32;
	self.amoSize = param.amoSize;//100
	self.dmage = param.bulletDmage;//1
	
	var super_update = self.update;
	self.update = function(){

		if(self.timer++ > self.range)
			self.toRemove = true;
		
		super_update();
		
		for(var i in Player.list){
			var p = Player.list[i];
			var shooter = Player.list[self.parent];
			
			if(self.getDistance(p) < self.amoSize && self.parent !== p.id && shooter.team !== p.team){
				p.hp -= self.dmage;
								
				if(p.hp <= 0){
					
					if(shooter){
						shooter.xp += p.xp;
						shooter.kills++;
					}
					
					p.hp = p.hpMax;
					p.xp = 1;
					p.x = Math.random() * WIDTH;
					p.y = Math.random() * HEIGHT;					
				}
				self.toRemove = true;
			}
		}
		//IMPLEMENTAR SHOOTER PISTOLA BALAS, SALEN DE CABEZA!
		
		/*	if(self.angle < 0)
					self.angle = 360 + self.angle;		

			if(self.angle >= 45 && self.angle < 135){
				
			}else if(self.angle >= 135 && self.angle < 225){
				
			}else if(self.angle >= 225 && self.angle < 315){
				
			}else{
				
			}*/
					
		
	}
	self.getInitPack = function(){
		return {
			id:self.id,
			x:self.x,
			y:self.y,	
			lvl:self.lvl,
			angle:self.angle,
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
