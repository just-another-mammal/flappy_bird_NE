function Bird(imgs, NN){
	this.x = 60;
	this.y = gp.height/2;
	this.gravity = 0.2;
	this.velocity = 0;
	this.width = 24;
	this.height = 22;
	this.score = 0;
	this.max_score = 0;
	this.passed = [];
	this.dead = false;
	this.NN = NN;
	this.my_rect = [this.x-(this.width/2), this.y-(this.height/2), this.width, this.height];

	this.imgHolder = createGraphics(this.width, this.height);
	this.imgHolder.tint(255, 90);
	this.imgHolder.image(imgs[1], 0, 0);
	this.transparentImg = this.imgHolder.get();
	
	this.show = function(){
		gp.imageMode(CENTER);
		if (this.velocity < 0){
			gp.image(imgs[1], this.x, this.y);
		}
		else{
			gp.image(imgs[0], this.x, this.y);
		}
		//rect(this.my_rect[0],this.my_rect[1],this.my_rect[2],this.my_rect[3]);
	}

	this.showScore = function(x, y){
		if (0){//this.velocity < 0 || this.dead ){
			if (this.dead){
				image(this.transparentImg, x, y, this.width*1.5, this.height*1.5);
			} else{
				image(imgs[1], x, y, this.width*1.5, this.height*1.5);
			}
		}
		else{
			image(imgs[0], x, y, this.width*1.5, this.height*1.5);
		}
	}
	
	this.up = function(){
		this.velocity = -5.2;
	}
	
	this.update = function(){
		
		if (!pipe.length){
			pipe_input = 1;
			top_pipe_y = 0;
			bottom_pipe_y = 1;
		}
		else{
			pipe_focus = 0;
			if (pipe[0].x < 40 && pipe.length > 1){
				pipe_focus = 1;
			}
			pipe_input = pipe[pipe_focus].x / gp.width;
			top_pipe_y = pipe[pipe_focus].y / gp.height;
			bottom_pipe_y = (pipe[pipe_focus].y + pipe[pipe_focus].opening) / gp.height;
		}

		decision = this.NN.forward([this.y/gp.height, pipe_input, top_pipe_y, bottom_pipe_y]);
		
		// decision_mean.push(decision);

		if (decision > 0){
			this.up();
		}
		
		this.velocity += this.gravity;
		this.y += this.velocity;
		
		if (this.y > gp.height){
			this.y = gp.height;
		}
		if (this.y < 0){
			this.y = 0;
		}
		this.my_rect = [this.x-(this.width/2), this.y-(this.height/2), this.width, this.height];

		this.max_score = Math.max(this.score, this.max_score);
	}
	
	this.reset = function(){
		this.x = 60;
		this.y = height/2;
		this.gravity = 0.2;
		this.velocity = 0;
		this.width = 24;
		this.height = 22;
		this.score = 0;
		this.passed = [];
		this.dead = false;
	}
}