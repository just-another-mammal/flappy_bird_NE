function Pipe(imgs){
	this.x = gp.width;
	this.opening = 80;
	this.y = random(gp.height-this.opening);
	this.width = 24;
	this.height = 400;
	this.my_rect1 = [this.x, this.y-gp.height, this.width, this.height];
	this.my_rect2 = [this.x, this.y+this.opening, this.width, this.height];
	
	
	this.show = function(){
		gp.imageMode(CORNER);
		gp.image(imgs[1], this.x, this.y-gp.height);
		gp.image(imgs[0], this.x, this.y+this.opening);
		//rect(this.my_rect1[0],this.my_rect1[1],this.my_rect1[2],this.my_rect1[3]);
		//rect(this.my_rect2[0],this.my_rect2[1],this.my_rect2[2],this.my_rect2[3]);
	}
	
	this.update = function(){
		this.x -= speed;
		this.my_rect1 = [this.x, this.y-gp.height, this.width, this.height];
		this.my_rect2 = [this.x, this.y+this.opening, this.width, this.height];
	}
}