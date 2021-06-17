var all_birds = allUrl();
var pipe_imgs = [];
var bird_imgs = [];
var pipe = [];
var birds = [];
var to_splice = false;
const NN_shape = [4,3,1];
var decision_mean = [];
var gen = 1;
var speed = 5;
var frequency = 100;

var population = 25;
var player_left;
var current_score = 0;
var score_list = new Array(population).fill(0);
var max_score = 0;
var gp;
var death_img;


function preload(){
	//bird_imgs.push(loadImage("https://i.imgur.com/dRwL411.png"));
	//bird_imgs.push(loadImage("https://i.imgur.com/JytIBKo.png"));

	for (var i = 0; i < all_birds.length; i++){
		bird_imgs.push(loadImage(all_birds[i]));
	}
	
	pipe_imgs.push(loadImage("https://i.imgur.com/1w06ia2.png"));
	pipe_imgs.push(loadImage("https://i.imgur.com/k0PiQeM.png"));
	
}

function rect_collision(rect_a, rect_b){
	if (rect_a[0] < rect_b[0] + rect_b[2] &&
		rect_a[0] + rect_a[2] > rect_b[0] &&
		rect_a[1] < rect_b[1] + rect_b[3] &&
		rect_a[3] + rect_a[1] > rect_b[1]){
			return true;
		}
	return false;
}

function reset(){
	next_gen();
	pipe = [];
	score_list = new Array(population).fill(0);
	current_score = 0;
	gen += 1;
}

function setup(){
	createCanvas(700, 400);
	gp = createGraphics(400,400);
	// randomSeed(12);
	for (var i = 0; i < population; i++){
		birds.push(new Bird([bird_imgs[i*2], bird_imgs[i*2+1]], new Neural_network(NN_shape)));
	}
}

function draw(){
	background(157,213,230);
	gp.background(51);
	
	if (frameCount % frequency == 0){
		if (current_score % 5 == 0)
			speed += 0.1;
	    pipe.push(new Pipe(pipe_imgs));
		for (var i = 0; i < birds.length; i++){
			birds[i].passed.push(0);
		}
	}
	
	for (var i = pipe.length-1; i >= 0; i--){
	        pipe[i].show();
	        pipe[i].update();
			
	        if (pipe[i].x < -24){
				to_splice = true;
			}
			
	        for (var j = 0; j < birds.length; j++){
				if(birds[j].dead){
					continue;
				}
				if (birds[j].passed[i] == 0 && birds[j].x > (pipe[i].x+pipe[i].width/2)){
						birds[j].passed[i] = 1;
						birds[j].score += 1;
						score_list[j] += 1;
				}
				if (rect_collision(birds[j].my_rect, pipe[i].my_rect1)){
						birds[j].show();
						birds[j].dead = true;
				}
				if (rect_collision(birds[j].my_rect, pipe[i].my_rect2)){
						birds[j].show();
						birds[j].dead = true;
				}
				if (to_splice){
					birds[j].passed.splice(i, 1);
				}
			}
			if (to_splice){
				pipe.splice(i, 1);
				to_splice = false;
			}
	}
	
	player_left = 0;
	for (var i = 0; i < birds.length; i++){
		if (birds[i].dead){
			continue;
		}
		player_left++;
		birds[i].update();
		birds[i].show();
	}
	current_score = Math.max(...score_list);
	max_score = Math.max(max_score, current_score);


	
	if (!player_left){
		reset();
		speed = 5;
	}
	

	gp.push();
	gp.fill(255);
	gp.strokeWeight(4);
	gp.stroke(0);
	gp.textSize(16);
	gp.text("birbs left: " + player_left.toString(), gp.width-120, 20);
	gp.text("generation: " + gen.toString(), gp.width/2-70, 20);
	gp.text("score: " + current_score.toString(), 15, 20);
	gp.text("max score: " + max_score.toString(), gp.width-120, gp.height-20);
	gp.pop();
	image(gp, 0, 0);


	let padx = 0.02 * (width-gp.width);
	let pady = 0.01 * height;
	let x = gp.width + 20;
	let y = 0;

	strokeWeight(2);
	stroke(0);
	textSize(16);

	for (let i = 0; i < birds.length; i++){
		push();
		birds[i].showScore(x+padx, y+pady);
		if (birds[i].dead){
			fill(0,70);
			stroke(0, 70);
		}
		 // + birds[i].max_score
		text(" : ", birds[i].width*1.5 + x + padx, birds[i].height*1.5 + y - pady);
		pop();

		y += birds[i].width * 1.5;
		if (y + birds[i].height * 1.5 >= height){
			y = 0;
			x += 2 * (birds[i].width * 1.5 + padx);
		}
	}
	//noLoop();

}