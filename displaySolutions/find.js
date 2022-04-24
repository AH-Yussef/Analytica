import {jacobi} from '../solvingAlgorithms/Jacobi.js';
import {gauss_seidil} from '../solvingAlgorithms/Gauss_Seidil.js';
import {gauss_elimination_standard, gauss_elimination_partial_pivoting} from '../solvingAlgorithms/gauss_elimination.js'
import {gaussJordan} from '../solvingAlgorithms/gauss-jordan.js';
import {choleskyDecomposition} from '../solvingAlgorithms/Cholesky.js';
import {solve_lu} from '../solvingAlgorithms/lu.js';
import {numberOfEquations} from "../app.js";
import {displayNumericalSolutions} from "./jacobiSeidelDisplay.js";
import {displayGaussSolution} from "./gaussDisplay.js";
import {displayLUSolution} from "./luDisplay.js";

export const parameters = {
  matrix: null,
  precision: null,
  numericalMethodsParams: {
    initialGuess: null,
    numberOfIterations: null,
    error: null,
  }
}

function getInputMatrix(){
    const inputMatrix = [];
    for(let i = 0; i < numberOfEquations; i++){
      inputMatrix[i] = [];
      let numberOfCurrentEqn = i + 1;
      for(let j = 0; j < numberOfEquations; j++){
        let coofInputId = `coof-${numberOfCurrentEqn}-${j+1}`;
        let currentCoofInput = document.getElementById(coofInputId);
        inputMatrix[i][j] = +currentCoofInput.value;
      }
      let constInput = document.getElementById(`const-${numberOfCurrentEqn}`);
      inputMatrix[i][numberOfEquations] = +constInput.value;
    }
    return inputMatrix;
}

function isMatrixInputCorrect(){
  for(let i = 0; i < numberOfEquations; i++){
    let numberOfCurrentEqn = i + 1;
    for(let j = 0; j < numberOfEquations; j++){
      let coofInputId = `coof-${numberOfCurrentEqn}-${j+1}`;
      let currentCoofInput = document.getElementById(coofInputId);
      let currentCoofInputValue = currentCoofInput.value;
      if(currentCoofInputValue === '') {
        highlightInput(currentCoofInput);
        return false;
      }
      else{
        removeHighlight(currentCoofInput);
      }
    }
    let constInput = document.getElementById(`const-${numberOfCurrentEqn}`);
    let constInputValue = constInput.value;
    if(constInputValue === ''){
      highlightInput(constInput);
      return false;
    }
    else{
      removeHighlight(constInput);
    }
  }

  return true;
}

function diagonalHasZeros(){
  for(let i = 0; i < numberOfEquations; i++){
    let numberOfCurrentEqn = i + 1;
    let coofInputId = `coof-${numberOfCurrentEqn}-${numberOfCurrentEqn}`;
    let currentCoofInput = document.getElementById(coofInputId);
    let currentCoofInputValue = currentCoofInput.value;
    if(+currentCoofInputValue === 0) {
      highlightInput(currentCoofInput);
      return true;
    }
    else{
      removeHighlight(currentCoofInput);
    }
  }
  return false;
}
//precision parameter
function getPrecision(){
  const decimalPointsInput = document.getElementById("precision-input");
  const precision = Math.abs(decimalPointsInput.value);
  if(precision == '') return 16;
  return precision;
}

//jacobi and seidal parameters
function getStoppingCondition(){
  const stoppingConditionSelect = document.getElementById("stopping-conditions-select");
  const stoppingConditionChosen = stoppingConditionSelect.value;
  const stoppingConditionInput = document.getElementById("stopping-condition-input");
  const stoppingConditionValue = Math.abs(stoppingConditionInput.value);
  
  let numberOfIterations = 0;
  let error = 0;
  if(stoppingConditionChosen == 1){
    numberOfIterations = stoppingConditionValue;
    error = null;
  }
  else{
    numberOfIterations = null;
    error = stoppingConditionValue;
  }
  return {
    itrNum: numberOfIterations, 
    err: error
  };
}

function getIntialGuess(){
  const initialGuessInput = document.getElementById("initial-guess-input");
  const initialGuessValue = initialGuessInput.value;
  const initialGuessVector = initialGuessValue.split(',');
  return initialGuessVector;
}

function areJacobi_SeidilParametersCorrect(){
  const stoppingConditionInput = document.getElementById("stopping-condition-input");
  const stoppingConditionValue = stoppingConditionInput.value;
  if(stoppingConditionValue === ""){
    highlightInput(stoppingConditionInput);
    return false;
  }
  else{
    removeHighlight(stoppingConditionInput);
  }

  const initialGuessInput = document.getElementById("initial-guess-input");
  const initialGuessValue = initialGuessInput.value;
  if(initialGuessValue === ""){
    highlightInput(initialGuessInput);
    return false; 
  }
  else{
    removeHighlight(initialGuessInput);
  }

  const correctMatrix = isMatrixInputCorrect();
  if(!correctMatrix) return false;

  if(diagonalHasZeros()) return false;

  return true;
}

function areAlgebricMethodsParametersCorrect(){
  const correctMatrix = isMatrixInputCorrect();
  if(!correctMatrix) return false;
  return true;
}

//jacobi and Siedil parameters setup
function getJacobiParameters(){
  parameters.matrix = getInputMatrix();
  parameters.precision = getPrecision();
  parameters.numericalMethodsParams.initialGuess = getIntialGuess();
  const stoppingCond = getStoppingCondition();
  parameters.numericalMethodsParams.numberOfIterations = stoppingCond.itrNum;
  parameters.numericalMethodsParams.error = stoppingCond.err;
}
//Gauss methods parameters setup
function getAlgebricParameters(){
  parameters.matrix = getInputMatrix();
  parameters.precision = getPrecision();
}

//calling the propper solving algorithm
export function callSolvingMethod(){
  //returning null indicates that method cannot be called
  const solvingMethodSelect = document.getElementById("operations-options-selector");
  const methodCodeChosen = solvingMethodSelect.value;
  if( methodCodeChosen == 1 || 
      methodCodeChosen == 2 ||
      methodCodeChosen == 3){
    if(!areAlgebricMethodsParametersCorrect()) return false;
    getAlgebricParameters();
    const solution = callGuass(methodCodeChosen);
    document.getElementById("solution").innerHTML = "";
    displayGaussSolution(solution, methodCodeChosen);
    console.log(solution);
    return true;
  }
  if(methodCodeChosen == 4){
    if(!areAlgebricMethodsParametersCorrect()) return false;
    getAlgebricParameters();
    const luType = document.getElementById("lu-types-selector").value;
    const solution = callLU(luType);
    document.getElementById("solution").innerHTML = "";
    displayLUSolution(solution, luType);
    return true;
  }
  else if(methodCodeChosen == 5 || methodCodeChosen == 6){
    if(!areJacobi_SeidilParametersCorrect()) return false;
    getJacobiParameters();
    const solution = callJacobiORseidelMethod(methodCodeChosen);
    document.getElementById("solution").innerHTML = "";
    displayNumericalSolutions(solution);
    console.log(solution);
    return true;
  }
}

//calling different methods
function callJacobiORseidelMethod(methodId){//5 seidel - 6 jacobi
  const matrix = parameters.matrix;
  const initialGuess = parameters.numericalMethodsParams.initialGuess;
  const numberOfIterations = parameters.numericalMethodsParams.numberOfIterations;
  const error = parameters.numericalMethodsParams.error;
  const precision = parameters.precision;
  let solution = null;
  if(methodId == 5) solution = gauss_seidil(matrix, initialGuess, numberOfIterations, error, precision);
  else if(methodId == 6) solution = jacobi(matrix, initialGuess, numberOfIterations, error, precision);
  return solution;
}

function callGuass(methodId){
  const matrix = parameters.matrix;
  const precision = parameters.precision;
  let solution = null;
  if(methodId == 1) solution = gauss_elimination_standard(matrix, precision);
  else if(methodId == 2) solution = gauss_elimination_partial_pivoting(matrix, precision);
  else if(methodId == 3) solution = gaussJordan(matrix, precision);
  return solution;
}

function callLU(luType){
  const matrix = parameters.matrix;
  const precision = parameters.precision;
  let solution = null;
  if(luType == 1) solution = solve_lu(matrix, false, precision)
  else if(luType == 2)solution = solve_lu(matrix, true, precision)
  else if(luType == 3) solution = choleskyDecomposition(matrix, precision);
  return solution;
}



//interface user mistakes handling
function highlightInput(missingParameterInput){ //highlight missing input parameter in red
  missingParameterInput.style.border = "1px solid #e3364d";
}

function removeHighlight(missingParameterInput){
  missingParameterInput.style.border = "1px solid darkgray";
}