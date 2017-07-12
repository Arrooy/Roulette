buildMines = function(Index,SegundoIndex,NumeroMinas,widthMina,heightMina){
	self = this;
	self.Minax	=	[];
	self.Minay	=	[];
	self.widthMina = widthMina;
	self.heightMina = heightMina;
	self.numeroMinas = NumeroMinas;
	self.FrameMina = [];

var dontExplode = 0;

	for (var s = Index;s < self.numeroMinas;s++){
/*
		if(s < 3){
			self.FrameMina[s] = 1;
			self.Minax[s] =  self.heightMina*2;
			self.Minay[s] = window.innerHeight / 2 - self.heightMina * 4 + s * self.heightMina;
		}else if(s<=5 && s >= 3){
			self.FrameMina[s] = 1;
			self.Minax[s] =  self.heightMina*2;
			self.Minay[s] = window.innerHeight / 2 + self.heightMina + s * self.heightMina;
		}else if (s<=8 && s>= 6){
			self.FrameMina[s] = 1;
			self.Minax[s] =  window.innerWidth - self.heightMina*0.5;
			self.Minay[s] = window.innerHeight / 2 - self.heightMina * 4 + (s-6) * self.heightMina;
		}else {
			self.FrameMina[s] = 1;
			self.Minax[s] =  window.innerWidth - self.heightMina*0.5;
			self.Minay[s] = window.innerHeight / 2 + self.heightMina + (s-6) * self.heightMina;
		}
*/
		if(s >= 6){
			self.FrameMina[s] = 1;
			self.Minax[s] =  window.innerWidth - self.heightMina*0.5;
			self.Minay[s] = window.innerHeight / 2 - self.heightMina * 2 + (s-6) * self.heightMina;
		}else{
			self.FrameMina[s] = 0;
			self.Minax[s] =  self.heightMina*2;
			self.Minay[s] = window.innerHeight / 2 - self.heightMina * 2 + s * self.heightMina;
		}
	}

		/*
		var valorx = Math.random()*window.innerWidth;
		var valory = Math.random()*window.innerHeight;

		if(valorx < widthMina)
			valorx = widthMina;
		if(valorx > window.innerWidth - widthMina)
			valorx = window.innerWidth - widthMina;
		if(valory < heightMina)
			valory = heightMina;
		if(valory > window.innerHeight - heightMina)
			valory = window.innerHeight - heightMina;

		var dontExplode = 0;
	do{
		var flag = 0;
		for(var a = SegundoIndex;a < s;a++){
			while((Distancia(self.Minax[a],self.Minay[a],valorx,valory) < self.widthMina || Distancia(self.Minax[a],self.Minay[a],valorx,valory) < self.heightMina)){
				valorx = Math.random()*window.innerWidth;
				valory = Math.random()*window.innerHeight;
				flag = 1;
				dontExplode++;
				if(dontExplode >= 500){
					console.log("QUICK FORCE QUIT DUE TO BITCHES");
					dontExplode = 0;
					break;
				}
			}
		}

	}while(flag == 1);
		self.Minax[s] = valorx;
		self.Minay[s] = valory;
		self.FrameMina[s] = 1;
	}*/

}
