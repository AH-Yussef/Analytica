function Step(discreption, L){
    this.discreption = discreption;
    this.L = L;
}
function Sub(formula, subValues){
    this.formula = formula;
    this.subValues = subValues;
}

function transpose(matrix) {
	var Transpose = [];
	var numOfRows = matrix.length;
	var numOfColumns = matrix[0].length;

		for (var i=0 ; i<numOfColumns ; i++) {
			Transpose.push([]);
			for (var j=0 ; j<numOfRows ; j++) {
				Transpose[i].push(matrix[j][i]);
			}
		}
	return Transpose;
}

function getL(matrix,precision,solution) {

    var numOfRows = matrix.length;
    var numOfColumns = matrix[0].length;
    var L = [];
    var stepsCounter = 0;
	if (matrix.length !== matrix[numOfRows -1].length) throw Error('Input matrix must be square or lower triangle');
	
    for (var i=0 ; i<numOfRows ; i++) {
		L[i] = [];
		for (var j=0 ; j<numOfColumns ; j++) {
			L[i][j] = 0;
		}
    }
    
    L[0][0] = +Math.sqrt(matrix[0][0]).toFixed(precision);
    var stringStep =  "\\[l_{"+(1)+(1)+"} = \\sqrt {a_{"+(1)+(1)+"} - \\displaystyle \\sum_{k=1}^{i-1}{l_{ik}^2}} = \\sqrt {"+matrix[0][0]+" - \\displaystyle \\sum_{k=1}^{"+(0)+"}{l_{ik}^2}} = "+L[0][0]+"\\]";
    var stepL = JSON.parse(JSON.stringify(L));
    solution.steps[stepsCounter] = new Step(stringStep, stepL)
    stepsCounter = stepsCounter + 1;
    
	
	for (var i=1 ; i<numOfRows ; i++) {
	    for (var j=0 ; j<i; j++) {
            if(matrix[j][j]!=0){
		        L[i][j] = +UpperTerm(matrix[i][j], L, i, j, precision).toFixed(precision) / L[j][j];
                L[i][j] = +L[i][j].toFixed(precision);
                var stringStep = "\\[l_{"+(i+1)+(j+1)+"} = {a_{"+(i+1)+(j+1)+"} + \\displaystyle \\sum_{k=1}^{j-1}{l_{jk}.l_{ik}} \\over l_{"+(j+1)+(j+1)+"}} = {"+matrix[i][j]+" + \\displaystyle \\sum_{k=1}^{"+(j)+"}{l_{jk}.l_{ik}} \\over "+L[j][j]+"} = "+L[i][j]+" \\]";
                var stepL = JSON.parse(JSON.stringify(L));
                solution.steps[stepsCounter] = new Step(stringStep, stepL)
                stepsCounter = stepsCounter + 1;

            }
	    }
	    L[i][i] = Math.sqrt(+UpperTerm(matrix[i][i], L, i, i , precision).toFixed(precision));
        L[i][i] = +L[i][i].toFixed(precision);
        var stringStep =  "\\[l_{"+(i+1)+(i+1)+"} = \\sqrt {a_{"+(i+1)+(i+1)+"} - \\displaystyle \\sum_{k=1}^{i-1}{l_{ik}^2}} = \\sqrt {"+matrix[i][i]+" - \\displaystyle \\sum_{k=1}^{"+(i)+"}{l_{ik}^2}} = "+L[i][i]+"\\]";
        var stepL = JSON.parse(JSON.stringify(L));
        solution.steps[stepsCounter] = new Step(stringStep, stepL)
        stepsCounter = stepsCounter + 1;
    }
    solution.LU.l_matrix = JSON.parse(JSON.stringify(L));
    
	return L;
    }
    
    function UpperTerm(A_ij, L, i, j, precision) {

       var UpperTerm = +A_ij.toFixed(precision);
	    for (var k=0 ; k<j ; k++) {
            UpperTerm -= +(L[i][k]).toFixed(precision) * (+(L[j][k]).toFixed(precision));
        }
	return UpperTerm;
    }

    function solveCholesky(matrix, b, precision){
        const solution = {
            canBeSolved : true, // 1:can be solved  2: can't be solved maybe non symmetric or non positive definite
            symmetric : true, // 1:symmetric   2:nonsymmetric (LU can be found or not)
            finalAnswer : [1,2,3],
            LU:{
                u_matrix: [],

                l_matrix:[],
            },
            steps: [
                {
                    discreption: "kkkkk",
                    L:[]
        
                }
            ],
            backwardSub: [
                {
                    formula:[],
                    subValues:[]
                }
            ],
            forwardSub:
            {
                formula:[],
                subValues:[]
            },
            forwardRsults: []
        
        }
        solution.symmetric = isSymmetric(matrix);
        solution.canBeSolved = isSymmetric(matrix);
        var L = getL(matrix,precision,solution);
        if(solution.symmetric === true){
            solution.canBeSolved = isPositiveDefinite(L);
        }
        var Ltranspose = transpose(L);
        solution.LU.u_matrix = JSON.parse(JSON.stringify(Ltranspose));
        var numOfRows = matrix.length;
        //forward
        var y = new Array(numOfRows);
        for (var i=0 ; i<numOfRows ; i++) {
            var sum = 0;
            var formulaArray = [b[i]];
            for (var j=0 ; j<i ; j++) {
                 sum += (+L[i][j].toFixed(precision)) * (+y[j].toFixed(precision));
                 formulaArray.push(-L[i][j]);
            }
            sum = +sum.toFixed(precision);
            formulaArray.push(L[i][i]);
            solution.forwardSub[i] = new Sub(JSON.parse(JSON.stringify(formulaArray)),JSON.parse(JSON.stringify(y)));
            y[i] = (b[i] - sum) / L[i][i];;
            y[i] = +y[i].toFixed(precision);
            solution.forwardRsults.push(y[i]);
            
            
        }
   
        var x = new Array(numOfRows);
        for (var i= numOfRows-1 ; 0<=i ; i--) {
            var sum = 0;
            var formulaArray = [y[i]];
            if (Ltranspose[i][i] === 0) {
                continue;
            }
            for (let j = i + 1; j < numOfRows; j++) {
                sum += (+Ltranspose[i][j].toFixed(precision)) * (+x[j].toFixed(precision));
                formulaArray.push(-Ltranspose[i][j]);
            }
            sum = +sum.toFixed(precision);
            formulaArray.push(Ltranspose[i][i]);
            const subValues = [];
            for(let elem of x){
                if(elem == null) continue;
                subValues.push(elem);
            }
            solution.backwardSub[numOfRows-1-i] = new Sub(JSON.parse(JSON.stringify(formulaArray)),JSON.parse(JSON.stringify(subValues)));
            x[i] = (y[i] - sum) / Ltranspose[i][i];
            x[i] = +x[i].toFixed(precision);
        }
        solution.finalAnswer = JSON.parse(JSON.stringify(x));
        return solution;
   }

	function isPositiveDefinite(L){
        var status = true;
        var numOfRows = L.length
        var numOfColumns = L[0].length;
    	for (var i=0 ; i<numOfRows ; i++) {
        	
			for (var j=0 ; j<numOfColumns ; j++) {
        		if(isNaN(L[i][j])){
			    	status = false;
                	return status;
           		 }
			}
		}
        return status;
    }

    function isSymmetric(matrix){
        var status = true;
        var numOfRows = matrix.length
        var numOfColumns = matrix[0].length;
    	for (var i=0 ; i<numOfRows ; i++) {
        	
			for (var j=0 ; j<numOfColumns ; j++) {
        		if(matrix[i][j]!==matrix[j][i]){
			    	status = false;
                	return status;
           		 }
			}
		}
        return status;
    }


    export function choleskyDecomposition(matrix, precision){
        const coofMatrix = [];
        const constVector = [];
        const numberOfRows = matrix.length;
        for(let r = 0; r < numberOfRows; r++) {
           const row = []; 
           for(let c = 0; c < numberOfRows; c++){
               row.push(matrix[r][c]);
           }
           coofMatrix.push(row);
           constVector.push(matrix[r][numberOfRows]);
        }
        return solveCholesky(coofMatrix, constVector, precision);
    }
