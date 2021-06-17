function Neural_network(model){
	this.model = model;

	this.weight_init = function(){
		var result = [];
		for (var i = 0; i < this.model.length-1; i++){
			result.push([]);
			for (var j = 0; j < this.model[i]; j++){
				result[i].push([]);
				for (var k = 0; k < this.model[i+1]; k++){
					result[i][j].push(random(-2,2));
				}
			}
		}
		return result;
	}

	this.weights = this.weight_init();

	this.getDim = function(x){
	    var dim = [];
	    for (;;) {
	        dim.push(x.length);

	        if (Array.isArray(x[0])) {
	            x = x[0];
	        } else {
	            break;
	        }
	    }
	    return dim;
	}

	this.ReLU = function(x){
		var result = [];
		for (var i = 0; i < x.length; i++){
			result.push([]);
			for (var j = 0; j < x[i].length; j++){
				result[i].push(+(x[i][j] > 0)*x[i][j]);
			}
		}
		return result;
	}

	this.tanh = function(x){
		var result = [];
		for (var i = 0; i < x.length; i++){
			result.push([]);
			for (var j = 0; j < x[i].length; j++){
				result[i].push(Math.tanh(x[i][j]));
			}
		}
		return result;
	}

	this.dot = function(matrix_a, matrix_b){
		if (matrix_a[0].length != matrix_b.length){
			throw "the dimensions don't match";
		}
		result = [];
		for (var row = 0; row < matrix_a.length; row++){
			result.push([]);
			for (var col = 0; col < matrix_b[0].length; col++){
				result[row][col] = 0;
				for (var elem = 0; elem < matrix_b.length; elem++){
					result[row][col] += matrix_a[row][elem]*matrix_b[elem][col]
				}
			}
		}
		return result;
	}

	this.forward = function(input){
		if (this.getDim(input).length == 1){
			input = [input];
		}
		var a = [input];
		var z = [];
		for (var i = 0; i < this.weights.length; i++){
			z.push(this.tanh(this.dot(a[i], this.weights[i])));
			a.push(z[i]);
		}

		return z[z.length-1][0][0];
		
	}

}