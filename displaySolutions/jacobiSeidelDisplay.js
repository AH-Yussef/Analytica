import {numberOfEquations} from "../app.js";
import {parameters} from "./find.js";
import {printEquations} from "./generalFunctions.js";

const solutionArea = document.getElementById("solution");

function printResultsTable(solutoin, isConvergent){
  const answerLabel = document.createElement('div');
  answerLabel.className = "solutions-label";
  answerLabel.innerHTML = "$$\\underline{\\text{Iterations results and abolute errors:}}$$";
  solutionArea.appendChild(answerLabel);

  const allIterationsErrors = solutoin.errors;
  const allIterationsResults = solutoin.results;

  const tableRows = isConvergent ? allIterationsErrors.length: 10;

  const solutionsTable = document.createElement('table');
  const solutionsTableHeader = document.createElement('tr');
  const firstColTitle  = document.createElement("th");
  firstColTitle.innerHTML = "$$iteration$$";
  solutionsTableHeader.appendChild(firstColTitle);

  for(let col = 0; col < numberOfEquations; col++){
    const variableTitle = document.createElement('th');
    const varSubScript = col + 1;
    variableTitle.innerHTML = `$$x_${varSubScript}$$`;
    solutionsTableHeader.appendChild(variableTitle);

    const variableErrorTitle = document.createElement('th');
    variableErrorTitle.innerHTML = `$$\\bigl|&#x03F5_a\\bigr|_${varSubScript}\\%$$`;
    solutionsTableHeader.appendChild(variableErrorTitle);
  }
  solutionsTable.appendChild(solutionsTableHeader);

  for(let row = 0; row < tableRows; row++){
    const newRow = document.createElement('tr');

    const iterationNumber = row + 1;
    const iterationNumberCell = document.createElement('td');
    iterationNumberCell.innerHTML = `$$${iterationNumber}$$`
    newRow.appendChild(iterationNumberCell);

    const currentIterationResults = allIterationsResults[row];
    const currentIterationErrors = allIterationsErrors[row];

    for(let col = 0; col < numberOfEquations; col++){
      const variableResult = document.createElement('td');
      variableResult.innerHTML = `$$${currentIterationResults[col]}$$`;
      newRow.appendChild(variableResult);

      const variableError = document.createElement('td');
      variableError.innerHTML = `$$${(+currentIterationErrors[col]).toFixed(parameters.precision)}$$`;
      newRow.appendChild(variableError);
    }

    solutionsTable.appendChild(newRow);
  }

  solutionArea.appendChild(solutionsTable);
}

function printFormulas(solution){
  const formulaLabel = document.createElement('div');
  formulaLabel.className = "solutions-label";
  formulaLabel.innerHTML = "$$\\underline{Formulas:}$$";
  solutionArea.appendChild(formulaLabel);

  const formulas = solution.equations;

  const formulasArea = document.createElement('div');
  formulasArea.className = "formulas-display";

  for(let i = 0; i < numberOfEquations; i++){
    const newFormulaContainer = document.createElement('div');
    const currentFormulaComponents = formulas[i];
    const constant = currentFormulaComponents[0];
    const primaryVarIndex = i + 1;
    let numerator = `${constant}`;
    let secondaryVarIndex = 1;
    for(let j = 1; j < numberOfEquations; j++){
      if(secondaryVarIndex === primaryVarIndex) secondaryVarIndex++;
      const coof = currentFormulaComponents[j];
      if(coof == 0) continue;
      else if(coof > 0) numerator += `+${coof}x_${secondaryVarIndex++}`;
      else numerator += `${coof}x_${secondaryVarIndex++}`;
    }
    const denominator = `${currentFormulaComponents[numberOfEquations]}`;
    const formula = `$$x_${primaryVarIndex}=\\frac{${numerator}}{${denominator}}$$`;

    newFormulaContainer.innerHTML = formula;
    formulasArea.appendChild(newFormulaContainer);
  }

  solutionArea.appendChild(formulasArea);
}

function printSteps(solution, isDivergent = false){
  const stepsLabel = document.createElement('div');
  stepsLabel.className = "solutions-label";
  stepsLabel.innerHTML = "$$\\underline{Steps:}$$";
  solutionArea.appendChild(stepsLabel);

  const formulas = solution.equations;
  const calculations = solution.calculations;
  const absErrors = solution.errors;
  
  const allStepsArea = document.createElement('div');
  allStepsArea.className = "steps-display";

  const numberOfIterations = calculations.length;
  let prevVector = parameters.numericalMethodsParams.initialGuess;
  for(let itr = 0; itr < numberOfIterations; itr++){
    const stepContainer = document.createElement('div');
    stepContainer.className = "step-container";

    const iterationLabel = document.createElement('div');
    iterationLabel.className = "solutions-label";
    iterationLabel.innerHTML = `$$\\underline{iteration(${itr+1})}$$`;
    stepContainer.appendChild(iterationLabel);

    const currentIteratinosCalc = calculations[itr];
    const currentIteratinosErrors = absErrors[itr];
    let currVector = [];
    let maxError = 0;
    for(let i = 0; i < numberOfEquations; i++){
      //substitution
      const varIndex = i + 1;
      const currentEqnCalc = currentIteratinosCalc[i];
      const newFormulaContainer = substituteInFormula(varIndex, currentEqnCalc, formulas);
      newFormulaContainer.className = "single-step";
      stepContainer.appendChild(newFormulaContainer);

      //appending the iteration vector
      const newX = currentEqnCalc[numberOfEquations -1];
      currVector.push(newX);
      //absolute Error
      const oldX = prevVector[i];
      const itrError = currentIteratinosErrors[i];
      if(+itrError > maxError) maxError = itrError;
      const newErrorFormulaContainer = getErrorFormula(varIndex, newX, oldX, itrError);
      newErrorFormulaContainer.className = "sigle-step";
      stepContainer.appendChild(newErrorFormulaContainer);
    }
    //max iteration error
    const maxErrorInfo = document.createElement('div');
    maxError = (+maxError).toFixed(parameters.precision);
    maxErrorInfo.innerHTML = `$$\\text{The maximum absolute relative error after iteration(${itr+1})} = ${maxError}\\%$$`;
    maxErrorInfo.className = "sigle-step";
    stepContainer.appendChild(maxErrorInfo);

    //iteration vector
    const newVectorContainer = getVectorFormat(currVector, itr+1);
    newVectorContainer.className = "sigle-step";
    stepContainer.appendChild(newVectorContainer);
    prevVector = [...currVector];

    allStepsArea.appendChild(stepContainer);
  }
  solutionArea.appendChild(allStepsArea);
}

function substituteInFormula(varIndex, values, formulas){
  const newFormulaContainer = document.createElement('div');
  const currentFormulaComponents = formulas[varIndex-1];
  const constant = currentFormulaComponents[0];
  const primaryVarIndex = varIndex;
  let numerator = `${constant}`;
  for(let j = 0; j < numberOfEquations-1; j++){
    const coof = currentFormulaComponents[j];
    const valueToSub = values[j];
    if(coof == 0) continue;
    else if(coof > 0) numerator += `+${coof}(${valueToSub})`;
    else numerator += `${coof}(${valueToSub})`;
  }
  const denominator = `${currentFormulaComponents[numberOfEquations]}`;
  const result = values[numberOfEquations-1];
  const formula = `$$x_${primaryVarIndex}=\\frac{${numerator}}{${denominator}}=${result}$$`;

  newFormulaContainer.innerHTML = formula;
  return newFormulaContainer;
}

function getErrorFormula(varIndex, newX, oldX, error){
  const errorFormulaContainer = document.createElement('div');
  let errorFormula = `$$\\bigl|&#x03F5_a\\bigr|_${varIndex}=`;
  const numerator = `${newX}-${oldX}`;
  const denominator = `${newX}`;
  errorFormula += `\\left|\\frac{${numerator}}{${denominator}}\\right|\\times 100=${(+error).toFixed(parameters.precision)}\\%$$`;
  errorFormulaContainer.innerHTML = errorFormula;
  return errorFormulaContainer;
}

function getVectorFormat(vector, iterationNumber){
  const iterationVectorContainer = document.createElement('div');
  const vectorLen = vector.length;
  let vectorVars = `$$\\text{After iteration(${iterationNumber}): }\\begin{bmatrix}`;
  let vectorVals = `\\begin{bmatrix}`;
  for(let i = 0; i < vectorLen-1; i++){
    vectorVars += `x_${i+1}\\\\`;
    vectorVals += `${vector[i]}\\\\`;
  }
  vectorVars += `x_${vectorLen}\\end{bmatrix}=`;
  vectorVals += `${vector[vectorLen -1]}\\end{bmatrix}$$`;
  iterationVectorContainer.innerHTML = vectorVars + vectorVals;
  return iterationVectorContainer;
}

function printDirvegeMsg(){
  const divergeMsg = document.createElement('div');
  divergeMsg.innerHTML = "$$\\text{.\n.\n.\nthis System of linear equations is Divergent}$$"
  solutionArea.appendChild(divergeMsg);
}


export function displayNumericalSolutions(solution){
  const isConvergent = solution.status;
  printEquations();
  printResultsTable(solution, isConvergent);
  if(isConvergent){
    printFormulas(solution);
    printSteps(solution);
  }
  else printDirvegeMsg();
  MathJax.Hub.Queue(["Typeset",MathJax.Hub])
}