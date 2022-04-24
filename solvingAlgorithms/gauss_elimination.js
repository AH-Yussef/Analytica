function calc_zero_rows_of_Matrix(array) {
    var res_arr = [array.length, array.length] /*arr[0] represent rank of matrix & arr[1] represent rank aug matrix*/
    var matrix_elem
    var aug_matrix_elem
    var matrix_zero_rows = 0
    var aug_matrix_zero_rows = 0
    let array_copy = JSON.parse(JSON.stringify(array));
    for (var i = 0; i < array_copy.length; i++) {
        for (var k = i + 1; k < array_copy.length; k++) {
            if(array_copy[i][i] == 0){
                //pivoting
                let row = max_row(array_copy, i);
                swap(array_copy, i, row);
            }
            var factor = -array_copy[k][i] / array_copy[i][i];
            for (var j = i; j < array_copy.length + 1; j++) {
                if (i == j) {
                    array_copy[k][j] = 0;
                } else {
                    array_copy[k][j] += factor * array_copy[i][j];
                }
            }
        }
    }

    for (var i = 0; i < array_copy.length; i++) {
        matrix_elem = 0
        aug_matrix_elem = 0
        for (var j = 0, k = 0; j < array_copy[0].length - 1; j++, k++) {
            if (array_copy[i][j] == 0) {
                matrix_elem++;
                aug_matrix_elem++;
            } else {
                break;
            }
        }
        if (array_copy[i][array_copy[0].length - 1] == 0) {
            aug_matrix_elem++
        }
        if (matrix_elem == array_copy[0].length - 1) {
            matrix_zero_rows++;
        }
        if (aug_matrix_elem == array_copy[0].length) {
            aug_matrix_zero_rows++;
        }
    }
    res_arr[0] -= matrix_zero_rows;
    res_arr[1] -= aug_matrix_zero_rows;
    return res_arr
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function max_row(array, i){
        // Search for maximum in this column
        var max = array[i][i];
        var maxRow = i;
        for(var j=i+1; j<array.length ; j++) {
            if (Math.abs(array[j][i]) > max) {
                max = Math.abs(array[j][i]);
                maxRow = j;
            }
        }
    return maxRow
}

function swap (array,i, maxRow){
    for (var j=i; j<array.length + 1; j++) {
        var tmp = array[maxRow][j];
        array[maxRow][j] = array[i][j];
        array[i][j] = tmp;
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function scale_matrix(array){
    var max = -1;
    for (var i = 0 ; i < array.length ; i++){
        max = -1;
        for(var j = 0 ; j < array[0].length ; j++){
            if (array[i][j] > max){
                max = array[i][j];
            }
        }
        // dividing each coeff with max 
        for(var j = 0 ; j < array[0].length ; j++){
            array[i][j] = array[i][j] / max;
        }
    }
    return array;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export function gauss_elimination_standard(matrix, precision) {
    const array = [];
    for(let r = 0; r < matrix.length; r++) array[r] = [...matrix[r]];
    const solution = {
        solutionStatus:"",
        finalAnswer:[],
        steps:[],
        backwardSub: [],
    }
    var str = ""
    //unique solution when rank matrix == rank aug matrix == num of variables
    //0 ------> no solution
    //1 ------> unique solution
    //-1 ------> infinite 
    str = "";
    var swap_str = ""
    //forward elimination
    for (var i = 0; i < array.length; i++) {
        for (var k = i + 1; k < array.length; k++) {
            if(array[i][i] == 0){
                //pivoting
                let row = max_row(array, i);
                swap(array, i, row);
                swap_str.concat("swap row ", i, " with row ",row);
            }
            var factor = -array[k][i] / array[i][i];
            factor = factor.toPrecision(precision);
            for (var j = i; j < array.length + 1; j++) {
                if (i == j) {
                    array[k][j] = 0;
                } else {
                    array[k][j] += factor * array[i][j];
                    array[k][j] = +array[k][j].toPrecision(precision)
                }
            }
            solution.steps.push(new Step (str.concat("multiply row ", i+1, " by " , factor, " ,then add it to row " , k+1),array));
        }
    }        
    if (calc_zero_rows_of_Matrix(array)[0] == calc_zero_rows_of_Matrix(array)[1] && calc_zero_rows_of_Matrix(array)[1] == array[0].length - 1) {
        solution.solutionStatus = 1;
        let answer_arr = [];
        let subValues = [];
        //backward subistitution
        for(let i = array.length - 1; i >= 0  ; i--){
            const backSubStep = {
                formula: [],
                values: [],
            };
            backSubStep.formula.push(array[i][array.length]);

            let sum = 0;
            for (let j = i + 1 ; j < array.length ; j++) {
                backSubStep.formula.push(-1* array[i][j]);
                
                sum += array[i][j] * answer_arr[j];
                sum = +sum.toPrecision(precision);
            }
            backSubStep.formula.push(array[i][i]);
            backSubStep.values = [...subValues.reverse()];
            solution.backwardSub.push(backSubStep); 
            
            answer_arr[i] = +(array[i][array.length] - sum) / array[i][i];
            answer_arr[i] = +answer_arr[i].toPrecision(precision);
            subValues.push(answer_arr[i]);
        }
        solution.finalAnswer = answer_arr;
    // infinite number of solutions as rank matrix == rank aug matrix != number of variables (free variables)
    }else if (calc_zero_rows_of_Matrix(array)[0] == calc_zero_rows_of_Matrix(array)[1] && calc_zero_rows_of_Matrix(array)[1] != array[0].length - 1){
        solution.solutionStatus = -1;
    // no solutions as rank matrix != rank aug matrix
    }else if(calc_zero_rows_of_Matrix(array)[0] != calc_zero_rows_of_Matrix(array)[1]){
        solution.solutionStatus = 0;
    }
    return solution;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export function gauss_elimination_partial_pivoting(matrix, precision){
    const array = [];
    for(let r = 0; r < matrix.length; r++) array[r] = [...matrix[r]];
    const solution = {
        solutionStatus:"",
        finalAnswer:[],
        steps:[],
        backwardSub: [],
    }
    let str = "";
    let scaled_matrix = [];
    for(let r = 0; r < matrix.length; r++) scaled_matrix[r] = [...array[r]];
    scaled_matrix = scale_matrix(scaled_matrix)
    //0 ----> no solution
    //1 ----> unique solution
    //-1 ---> infinite solution
    str = "";
    for (var i = 0; i < array.length; i++) {
        var maxRow = max_row(scaled_matrix, i);
        swap(array,i,maxRow);
        swap(scaled_matrix,i,maxRow);
        if(i != maxRow){
            solution.steps.push(new Step(str.concat("swap row ",i, " with row ", maxRow), array));
        }
        for (var k = i + 1; k < array.length; k++) {
            var factor = -array[k][i] / array[i][i];
            factor = factor.toPrecision(precision)
            var scaled_factor = -scaled_matrix[k][i] / scaled_matrix[i][i];
            scaled_factor = scaled_factor.toPrecision(precision)
            for(var j = i ; j < array.length + 1 ; j++){
                if (i == j) {
                    array[k][j] = 0;
                    scaled_matrix[k][j] = 0;
                } else {
                    array[k][j] += factor * +(array[i][j]).toPrecision(precision);
                    array[k][j] = +(array[k][j]).toPrecision(precision);
                    scaled_matrix[k][j] += scaled_factor * +(scaled_matrix[i][i])
                    scaled_matrix[k][j] = +(scaled_matrix[k][j]).toPrecision(precision);
                }
            }
            solution.steps.push(new Step (str.concat("multiply row ", i+1, " by " , factor, " ,then add it to row " , k+1),array));
        }
    }    
    if (calc_zero_rows_of_Matrix(array)[0] == calc_zero_rows_of_Matrix(array)[1] && calc_zero_rows_of_Matrix(array)[1] == array[0].length - 1) {
        solution.solutionStatus = 1;

        let answer_arr = [];
        let subValues = [];
        //backward subistitution
        for(let i = array.length - 1; i >= 0  ; i--){
            const backSubStep = {
                formula: [],
                values: [],
            };
            backSubStep.formula.push(array[i][array.length]);

            let sum = 0;
            for (let j = i + 1 ; j < array.length ; j++) {
                backSubStep.formula.push(-1* array[i][j]);
                
                sum += array[i][j] * answer_arr[j];
                sum = +sum.toPrecision(precision);
            }
            backSubStep.formula.push(array[i][i]);
            backSubStep.values = [...subValues.reverse()];
            solution.backwardSub.push(backSubStep); 
            
            answer_arr[i] = +(array[i][array.length] - sum) / array[i][i];
            answer_arr[i] = +answer_arr[i].toPrecision(precision);
            subValues.push(answer_arr[i]);
        }
        solution.finalAnswer = answer_arr;
    // infinite number of soln
    }else if (calc_zero_rows_of_Matrix(array)[0] == calc_zero_rows_of_Matrix(array)[1] && calc_zero_rows_of_Matrix(array)[1] != array[0].length - 1){
        solution.solutionStatus = -1;
    // no solution
    }else if (calc_zero_rows_of_Matrix(array)[0] != calc_zero_rows_of_Matrix(array)[1] ){
        solution.solutionStatus = 0;
    }
    
return solution;
}

// console.log(gauss_elimination_partial_pivoting(test, 5));



// console.log(gauss_elimination_partial_pivoting(test,5));

function Step(discreption, matrix){
    this.discreption = discreption
    const array = [];
    for(let r = 0; r < matrix.length; r++) array[r] = [...matrix[r]];
    this.matrix = array;
}

