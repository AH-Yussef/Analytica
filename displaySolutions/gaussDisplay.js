import { numberOfEquations } from "../app.js";
import { printEquations } from "./generalFunctions.js";
import { printFinalAnswer } from "./generalFunctions.js";

const solutionArea = document.getElementById("solution");

function printSolutionStatus(solution){
  const solutionsStatus = +solution.solutionStatus;
  const solutionStatusContainer = document.createElement('div');
  if(solutionsStatus === 0){
    solutionStatusContainer.innerHTML = "$$\\text{The system has no solution}$$";
  }
  else if(solutionsStatus === 1){
    solutionStatusContainer.innerHTML = "$$\\text{The system has a unique solution}$$";
    solutionArea.appendChild(solutionStatusContainer);
  }
  else{
    solutionStatusContainer.innerHTML = "$$\\text{The system has an infinite number of Solutions}$$";
    solutionArea.appendChild(solutionStatusContainer);
  }
  solutionArea.appendChild(solutionStatusContainer);
  return solutionsStatus;
}

function printMatrixSteps(solution){
  const steps = solution.steps;
  const numberOfSteps = steps.length;

  if(numberOfSteps == 0) return;

  const matrixStepsLabel = document.createElement('div');
  matrixStepsLabel.className = "solutions-label";
  matrixStepsLabel.innerHTML = "$$\\underline{Steps:}$$";
  solutionArea.appendChild(matrixStepsLabel);

  const allStepsContainer = document.createElement('div');
  allStepsContainer.className = "steps-display";

  for(let step = 0; step < numberOfSteps; step++){
    const currentStep = steps[step];
    const discreption =  currentStep.discreption;
    const matrix = currentStep.matrix;

    const stepContaineer = document.createElement('div');
    stepContaineer.className = "step-container";

    const discreptionContainer = document.createElement('div');
    discreptionContainer.innerHTML = `$$\\text{${discreption}}$$`;
    discreptionContainer.className = "single-step";
    stepContaineer.appendChild(discreptionContainer);

    const matrixContainer = document.createElement('div');
    matrixContainer.className = "single-step";
    matrixContainer.innerHTML = `$$\\begin{bmatrix}`;
    for(let i = 0; i < numberOfEquations; i++){
      const matrixRow = matrix[i];
      for(let j = 0; j < numberOfEquations; j++){
        matrixContainer.innerHTML += `${matrixRow[j]} &`;
      }
      matrixContainer.innerHTML += `${matrixRow[numberOfEquations]} \\\\`;
    }
    matrixContainer.innerHTML += `\\end{bmatrix}$$`;
    stepContaineer.appendChild(matrixContainer);
    allStepsContainer.appendChild(stepContaineer);
  }
  solutionArea.appendChild(allStepsContainer);
}

function printBackwardSub(solution){
  const backWardSubLabel = document.createElement('div');
  backWardSubLabel.className = "solutions-label";
  backWardSubLabel.innerHTML = "$$\\underline{\\text{Backward substitution:}}$$";
  solutionArea.appendChild(backWardSubLabel);

  const backwardSubContainer = document.createElement('div');
  backwardSubContainer.className = "answers-display";

  const backSubSteps = solution.backwardSub;

  for(let i = 0; i < numberOfEquations; i++){
    const currVarIndex = numberOfEquations-i;
    const step = backSubSteps[i];
    const formula = step.formula;
    const subValues = step.values;
    const finalAnswer = solution.finalAnswer;

    let stepStr = `$$x_${currVarIndex}=\\frac`;
    let numerator = `${formula[0]}`;
    let denominator = `${formula[formula.length -1]}`
    let varIndex = currVarIndex;
    for(let j = 1; j < formula.length -1; j++){
      if(varIndex === currVarIndex) varIndex++;
      const coof = formula[j];
      if(coof == 0) continue;
      else if(coof > 0) numerator += `+${coof} x_${varIndex++}`;
      else numerator += `${coof}x_${varIndex++}`;
    }

    stepStr += `{${numerator}}{${denominator}} = \\frac`

    numerator = `${formula[0]}`;
    for(let j = 1; j < formula.length -1; j++){
      const coof = formula[j];
      if(coof == 0) continue;
      else if(coof > 0) numerator += `+${coof}(${subValues[j-1]})`;
      else numerator += `${coof}(${subValues[j-1]})`;
    }
    stepStr += `{${numerator}}{${denominator}} = ${finalAnswer[numberOfEquations-i-1]}$$`;

    const stepContainer = document.createElement('div');
    stepContainer.className = "single-step";
    stepContainer.innerHTML = stepStr;

    backwardSubContainer.appendChild(stepContainer);
  }
  solutionArea.appendChild(backwardSubContainer);
}


function printJordanFinalSolution(solution){
  if(solution.steps.length === 0) return;
  const finalStepLabel = document.createElement('div');
  finalStepLabel.className = "solutions-label";
  finalStepLabel.innerHTML = "$$\\underline{\\text{Final step:}}$$";
  solutionArea.appendChild(finalStepLabel);

  const finalStepContainer = document.createElement('div');
  finalStepContainer.className = "answers-display";

  const steps = solution.steps;
  const finalStep = steps[steps.length-1];
  const finalMatrix = finalStep.matrix;
  const finalAnswer = solution.finalAnswer;

  for(let i = 0; i < numberOfEquations; i++){
    const currVarIndex = i+1;
    
    let stepStr = `$$x_${currVarIndex}=\\frac`;
    let numerator = `${finalMatrix[i][numberOfEquations]}`
    let denominator = `${finalMatrix[i][i]}`;

    stepStr += `{${numerator}}{${denominator}} = ${finalAnswer[i]}$$`;

    const stepContainer = document.createElement('div');
    stepContainer.className = "single-step";
    stepContainer.innerHTML = stepStr;

    finalStepContainer.appendChild(stepContainer);
  }
  solutionArea.appendChild(finalStepContainer);
}


export function displayGaussSolution(solution, methodId){
  printEquations();
  const solutionsStatus = printSolutionStatus(solution);
  //final Answer
  if(solutionsStatus == 1) printFinalAnswer(solution);
  //forward elimination
  printMatrixSteps(solution);
  //substitution
  if(solutionsStatus == 1) {
    if(methodId == 3) printJordanFinalSolution(solution);
    else printBackwardSub(solution);
  }
  MathJax.Hub.Queue(["Typeset",MathJax.Hub])
} 