
Inventory = function(socket,server){
    var self = {
        items:[], //{id:"itemId",amount:1}
		socket:socket,
		server:server,
    }
    self.addItem = function(id,amount,type){
		for(var i = 0 ; i < self.items.length; i++){
			if(self.items[i].id === id){
				self.items[i].amount += amount;
				self.items
				self.refreshRender();
				return;
			}
		}
		self.items.push({id:id,amount:amount,type:type});
		self.refreshRender();
    }
    self.removeItem = function(id,amount){
		for(var i = 0 ; i < self.items.length; i++){
			if(self.items[i].id === id){
				self.items[i].amount -= amount;
				if(self.items[i].amount <= 0)
					self.items.splice(i,1);
				self.refreshRender();
				return;
			}
		}    
    }
    self.hasItem = function(id,amount){
		for(var i = 0 ; i < self.items.length; i++){
			if(self.items[i].id === id){
				return self.items[i].amount >= amount;
			}
		}  
		return false;
    }
	self.refreshRender = function(){
		//server
		if(self.server){
			self.socket.emit('updateInventory',self.items);
			return;
		}
		//client only
		var inventory = document.getElementById("inventory");
		inventory.innerHTML = "";
		
		var inventory2 = document.getElementById("inventory2");
		inventory2.innerHTML = "";
		
		var inventory3 = document.getElementById("inventory3");
		inventory3.innerHTML = "";
		inventory3.style.left = WIDTH/2 -300 ;
		inventory3.style.top = HEIGHT/2 -250 ;
		var justOneTime = true;	
		var addButton = function(data,type){
			
			let item = Item.list[data.id];
			let button = document.createElement("button");
			button.style = "outline:none;"
			
			button.title = item.name;
			button.onclick = function(){
				self.socket.emit("useItem",item.id);
				button.blur();
			}
			
			button.style.width = 64;
			button.style.height = 64;
			
			button.style.padding = 0;
			button.style.border = 0;
			let img = document.createElement("img");
			img.style.margin = 0;
			img.src = "/client/img/"+item.id+ ".png";
			button.appendChild(img);
			if(type === "weapon"){
				inventory.appendChild(button);	
			}else if(type === "consumable"){
				inventory2.appendChild(button);	
			}else if(type === "upgrade"){
				if(justOneTime === true){
					justOneTime = false;
					inventory3.innerHTML += "<h1 style='margin-bottom:150px;margin-top:0px;margin-left:0px;font-size:40px;text-align:center'>Subes de nivel, elige una mejora:</p>";
				}
				inventory3.appendChild(button);	
			}
		}
		
		for(var i = 0 ; i < self.items.length; i++){	
				addButton(self.items[i],self.items[i].type);
		}
	}
	
	
	if(self.server){
		self.socket.on("useItem",function(itemId){
			if(!self.hasItem(itemId,1)){
				console.log("Cheater");
				return;
			}
			let item = Item.list[itemId];
			item.event(Player.list[self.socket.id]);			
		});
	}

	return self;
}


Item = function(id,name,event){
	var self = {
		id:id,
		name:name,
		event:event,	
	}
	Item.list[self.id] = self;
	return self;
}
Item.list = {};

Item("potion","Cura al pesonaje toda la vida",function(player){
	player.hp = player.hpMax ;
	player.inventory.removeItem("potion",1);
});

Item("dmageup","Sube el daño de los proyectiles",function(player){
	player.amoDmage += 1;
	player.inventory.removeItem("dmageup",1);
});

Item("speedup","Mejora la velocidad del personaje",function(player){
	player.maxSpd += 5;
	player.inventory.removeItem("speedup",1);
});

Item("hpup","Mejora la hp màxima",function(player){
	player.hpMax += 10;
	player.inventory.removeItem("hpup",1);
});

Item("regenup","Mejora la regeneracion de hp del jugador",function(player){
	player.hpregen += 0.001;
	player.inventory.removeItem("regenup",1);
});

Item("rangeup","Augmenta el alcance de los proyectiles",function(player){
	player.range += 15;
	player.inventory.removeItem("rangeup",1);
});

Item("amosizeup","Augmenta el tamaño de las balas",function(player){
	player.amoSize += 10;
	self.amoSpeed = self.amoSpeed/(0.1*self.amoSize);
	player.inventory.removeItem("amosizeup",1);
});

Item("atackspeedup","Mejora la velocidad de disparo",function(player){
	player.attackSpeed -= 3;
	player.inventory.removeItem("atackspeedup",1);
});

Item("escopeta","Usar escopeta",function(player){
	player.arma = "escopeta";
});
Item("metralleta","Usar metralleta",function(player){
	player.arma = "metralleta";
});
Item("bazoka","Usar bazoka",function(player){
	player.arma = "bazoka";
});

Item("superatack","Usar habilidad SUPERATACK",function(player){
	for(var i = 0; i < 360;i+=3){
		player.shootBullet(i);
	}
	player.inventory.removeItem("superatack",1);
	
});





