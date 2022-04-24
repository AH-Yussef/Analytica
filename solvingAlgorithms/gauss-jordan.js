// to append steps of solution
function Step(discreption, matrix){
      this.discreption = discreption;
      this.matrix = matrix;
}


// vor pivoting the aug matrix to avoid dividing by zero
function pivoting(augArray){

    var numOfRows = augArray.length;
    for (var i = 0; i < numOfRows-1; i++){
          var pivotRow = augArray[i];
          if (pivotRow[i]==0){
              for (var j = numOfRows - 1; j > -1 ; j--){
                    var lastRow = augArray[j];
                    if (lastRow[i]!==0){
                          var TEMP = JSON.parse(JSON.stringify(augArray[i]));// swapping 2 rows
                          augArray[i] = JSON.parse(JSON.stringify(augArray[j]));
                          augArray[j] = JSON.parse(JSON.stringify(TEMP));
                          break;
                     }
        
               }
            }
    }
}

export function gaussJordan(matrix, precision){
      const augArray = [];
      for(let r = 0; r < matrix.length; r++) augArray[r] = [...matrix[r]];

      const solution = {
          solutionStatus: "", //or inf or no soln 
          finalAnswer: [1, 2, 3], //x1, x2, x3, ..., xn
          steps: [

                ]
      }       
      

      let numOfRows = augArray.length;
      let numOfColumns = augArray[0].length;
      let stepsCounter = 0;

      // forward elimination
      for (let i = 0; i < numOfRows; i++) { 
            let pivotRow = augArray[i];
            pivoting(augArray);
            for (let j = i + 1; j < numOfRows; j++) {
                  let currentRow = augArray[j];
                  if(currentRow[i] !== 0) {
                        let rowMul = - currentRow[i]/pivotRow[i];
                        for (let k = i; k < currentRow.length; k++) {
                              currentRow[k] = currentRow[k]+pivotRow[k] * rowMul;
                              currentRow[k] = +currentRow[k].toFixed(precision);
                         }
                         rowMul = +rowMul.toFixed(precision); 
                         let stringStep = `Multiply row${i+1} by ${rowMul.toFixed(precision)} and adding it to row${j+1}`;
                         let stepArray = JSON.parse(JSON.stringify(augArray));
                         solution.steps[stepsCounter]= new Step(stringStep,stepArray);
                         stepsCounter = stepsCounter + 1;
                    }                        
              }
        }


      // backward elimination
      for (let i = numOfRows - 1; i > -1 ; i--) {
            let pivotRow = augArray[i];
              if (pivotRow[i]==0){
                    break;
              }
              for (let j = i - 1; j > -1; j--) {
                  let currentRow = augArray[j];
                      if(currentRow[i] !== 0 && pivotRow[i]!==0) {
                        let rowMul = - currentRow[i]/pivotRow[i];
                           for (let k = 0; k < currentRow.length; k++) {
                                    currentRow[k] = currentRow[k] + pivotRow[k] * rowMul;
                                    currentRow[k] = +currentRow[k].toFixed(precision);
                           }
                           rowMul = +rowMul.toFixed(precision); 
                           let stringStep = `Multiply row${i+1} by ${rowMul} and adding it to row${j+1}`;
                           let stepArray = JSON.parse(JSON.stringify(augArray));
                          solution.steps[stepsCounter]= new Step(stringStep,stepArray);
                          stepsCounter = stepsCounter + 1;
                        }
                }
        }

        // getting final solution
        for (var g = 0; g < numOfRows; g++) {
                  solution.finalAnswer[g] = augArray[g][numOfColumns - 1] / augArray[g][g];
                  solution.finalAnswer[g] = +solution.finalAnswer[g].toFixed(precision);

        }

        // deciding the solution status
        solution.solutionStatus = 1;
        for (var g = 0; g < numOfRows; g++) {
            solution.solutionStatus = 1;
            if(isNaN(solution.finalAnswer[g])){
                  solution.solutionStatus = -1;
            } 
            if(solution.finalAnswer[g]==Infinity||solution.finalAnswer[g]==-Infinity){
                  solution.solutionStatus = 0;
                  break;
            }
          }

    return solution;

}
