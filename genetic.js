function next_gen(){
	var prob = softmax(score_list);
	prob = arr_pow(prob, 0.4);
	prob = softmax(prob);
	var ordered_prob = prob.slice().sort((x,y) => x-y);
	var offspring = [];
	var parents;
	var mutation_prob;
	for (var i = 0; i < birds.length/2; i++){
		for (var j = 0; j < 100; j++){
			parents = [choice(prob, ordered_prob), choice(prob, ordered_prob)];
			if (parents[0] != parents[1]){ break; }
		}
		mutation_prob = 1;//1 - (birds[parents[0]].score/110 + birds[parents[1]].score/110)/2;
		offspring.push(...breed(birds[parents[0]].NN, 
							 	birds[parents[1]].NN, mutation_prob));
	}
	for (var i = 0; i < birds.length; i++){
		birds[i].reset();
		birds[i].NN.weights = offspring[i];
	}
}

function breed(parent1, parent2, mutation){
	var offspring1_weight = parent1.weight_init();
	var offspring2_weight = parent2.weight_init();

	for (var weight_num = 0; weight_num < parent1.weights.length; weight_num++){
		for (var rows = 0; rows < parent1.weights[weight_num].length; rows++){
			for (var cols = 0; cols < parent1.weights[weight_num][rows].length; cols++){
				offspring1_weight[weight_num][rows][cols] = random([parent1.weights[weight_num][rows][cols], 
								 									parent2.weights[weight_num][rows][cols]]);
				if (random() < 0.05 * mutation){
					offspring1_weight[weight_num][rows][cols] *= random([0.9, 1.1]);
				}
				if (random() < 0.005 * mutation){
					offspring1_weight[weight_num][rows][cols] = random(-2,2);
				}
				offspring2_weight[weight_num][rows][cols] = random([parent1.weights[weight_num][rows][cols], 
																	parent2.weights[weight_num][rows][cols]]);
				if (random() < 0.05 * mutation){
					offspring2_weight[weight_num][rows][cols] *= random([0.9, 1.1]);
				}
				if (random() < 0.005 * mutation){
					offspring2_weight[weight_num][rows][cols] = random(-2,2);
				}
			}
		}
	}
	return [offspring1_weight, offspring2_weight];
}

function arr_pow(arr, y){
	result = [];
	for (var i = 0; i < arr.length; i++){
		result.push(Math.pow(arr[i], y));
	}
	return result;
}

function all_index(arr, value){
	result = [];
	for (var i = arr.length; i >= 0; i--){
		if (value == arr[i]) { result.push(i); }
	}
	return result;
}

function choice(p, ordered_p){
	rand = random();
	for (var i = 0; i < p.length-1; i++){
		if (!i){
			if (rand < ordered_p[i]){
				return random(all_index(p, ordered_p[i]));
			}
		}
		else{
			if (ordered_p[i] <= rand < ordered_p[i+1]){
				return random(all_index(p, ordered_p[i]));
			}
		}
	}
	return random(all_index(p, ordered_p[i]));
}

function softmax(x){
	result = []
	max_value = Math.max(...x);
	var sum = 0;
	for (var i = 0; i < x.length; i++){
		result.push(Math.exp(x[i] - max_value));
		sum += result[i];
	}
	for (var i = 0; i < result.length; i++){
		result[i] /= sum;
	}
	return result;
}

/* perfect bird 


[[[-0.022915415231625724, -2.305934741462318, 2.2006689356234226, 2.5340632497703184]
  [2.1288662348529925, -0.03240605129218377, -1.768087502827405, -1.5835564609085586]
  [2.7868519781371894, 2.004209802007105, 1.7900763042009147, 0.4881408983586719]
  [2.5740078248093976, 1.0374673874783158, -2.904542690045503, 0.9792962939719395]],
 [[0.5355662320653705]
  [-3.094074267986879]
  [2.0617702040407373]
  [0.1339052044062708]]]

*/