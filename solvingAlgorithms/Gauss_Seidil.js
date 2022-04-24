export function gauss_seidil(matrix, initial_guess=[0,0,0], num_iters=null, error=null, precision=16){
    //checking convergence
    let is_convergent = null;
    if(num_iters == null){
        let num_higher=0;
        let num_higher_equal=0;
        for(let i=0; i<matrix.length; i++){
            let sum=0;
            for(let j=0; j<matrix.length; j++){
                if(j==i) continue;
                sum += Math.abs(matrix[i][j]);
            }
            if(Math.abs(matrix[i][i]) > sum) num_higher++;
            if(Math.abs(matrix[i][i]) >= sum) num_higher_equal++;
            if(Math.abs(matrix[i][i]) < sum){
                is_convergent = false;
                break;
            }
        }
        if(num_higher_equal == matrix.length && num_higher != 0) is_convergent = true;
        else is_convergent=false;
    }
    if(is_convergent == null) is_convergent = true;
    //end check
    
    let current_iteration_values = [...initial_guess];
    let iterations = 0;
    let calculated_error = Number.MAX_SAFE_INTEGER;
    let object = {
        status,
        equations: [],
        calculations: [],
        results: [],
        errors: []
    }
    object.status = is_convergent;
    while(true){
        if((num_iters != null && iterations == num_iters) || (error != null && calculated_error <= error)) break;
        calculated_error = 0;
        let iteration_calculations = [];
        let iteration_errors = [];
        for(let i=0; i<matrix.length; i++){
            let equation = [];
            equation.push(matrix[i][matrix.length].toString());
            let calculation = [];
            let row_result = matrix[i][matrix.length];
            for(let j=0; j<matrix.length; j++){
                if(j == i) continue;
                equation.push((-matrix[i][j]).toString());
                calculation.push(((Number(current_iteration_values[j])).toPrecision(precision)).toString());
                row_result -= Number(current_iteration_values[j]).toPrecision(precision) * matrix[i][j];
            }
            equation.push(matrix[i][i].toString());
            row_result /= matrix[i][i];
            row_result = row_result.toPrecision(precision);

            // get error of each element and check for max
            let intermediate_error = Math.abs((row_result - current_iteration_values[i]) * 100 / row_result);
            if(calculated_error < intermediate_error) calculated_error = intermediate_error;
            iteration_errors.push(intermediate_error.toString());
            // end of getting error

            current_iteration_values[i] = row_result;
            if(iterations === 0) object.equations.push(equation);
            calculation.push(row_result.toString());
            iteration_calculations.push(calculation);
        }
        object.calculations.push([...iteration_calculations]);
        object.results.push([...current_iteration_values]);
        object.errors.push([...iteration_errors]);
        iterations++;
        if(!is_convergent && iterations == 1000 || iterations == 10000) break;
    }
    return object;
}
// TESTING
let matrix = [[3, 2, 1, 11], [-1, 1, 0, 3], [2, 1, -3, 16]];
let initial_guess = [1, 1, 1];
let num_iters = null;
let error = 0.000005; // the number is in percentage
let precision = 2;
// END TESTING


// console.log(gauss_seidil(matrix, initial_guess, num_iters, error, precision));
