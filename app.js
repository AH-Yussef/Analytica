import {callSolvingMethod} from "./displaySolutions/find.js";

const addEquationBtn = document.getElementById("increase");
const deleteEquationBtn = document.getElementById("decrease");
const numberOfEquationsInput = document.getElementById("equations-num");
const changeEquationsNumBtn = document.getElementById("change-equations-num-btn");
const equations = document.getElementById("equations");
const equation1Coofs = document.getElementById("equation-coof-1");
const equation2Coofs = document.getElementById("equation-coof-2");
const operationsSelect = document.getElementById("operations-options-selector");
const luConfig = document.getElementById("lu-config");
const iterationConfig = document.getElementById("iteration-config");
const stoppingConditions = document.getElementById("stopping-conditions-select")
const stoppingConditionLable = document.getElementById("iteration-config-label")
const resetBtn = document.getElementById("reset-btn");
const findBtn = document.getElementById("find-btn");
const backBtn = document.getElementById("back-btn");
const initailGuessConfig = document.getElementById("initial-guess-config");
const initailGuessInput = document.getElementById("initial-guess-input")

//helper variables
const elementsToShow = [];
export let numberOfEquations = 2;
const equationsCoofsHolders = [equation1Coofs, equation2Coofs];

// events
addEquationBtn.onclick = () => {
  numberOfEquationsInput.value = numberOfEquations + 1;
  createNewEquation();
}

deleteEquationBtn.onclick = () => {
  if(numberOfEquations > 2) {
    numberOfEquationsInput.value = numberOfEquations - 1;
    deleteEquation();
  }
}

resetBtn.onclick = () => reset();

findBtn.onclick = () => {
  const correct = callSolvingMethod();
  if(!correct) return;
  hideEquationsArea();
  showSolutionsArea();
}

backBtn.onclick = () => {
  reset();
  hideSolutionsArea();
  showEquationsArea();
  resetSolutionsArea();
}

changeEquationsNumBtn.onclick = () => {
  const inputValue = numberOfEquationsInput.value;
  if(inputValue < 2){
    numberOfEquationsInput.value = numberOfEquations;
    return;
  }
  if(inputValue == numberOfEquations) return;
  if(inputValue < numberOfEquations){
    const numOfEqnToBeDeleted = numberOfEquations - inputValue;
    for(let i = 0; i < numOfEqnToBeDeleted; i++){
      deleteEquation();
    }
  }
  if(inputValue > numberOfEquations){
    const numOfEqnToBeCreated = inputValue - numberOfEquations;
    for(let i = 0; i < numOfEqnToBeCreated; i++){
      createNewEquation();
    }
  }
}

operationsSelect.onchange = () => {
  const optionChoosed = +operationsSelect.value;
  if(optionChoosed == 4){
    luConfig.style.visibility = 'visible';
    luConfig.style.display = 'block';
    iterationConfig.style.visibility = 'hidden';
    iterationConfig.style.display = 'none';

    initailGuessConfig.style.visibility = "hidden";
    initailGuessConfig.style.display = "none";
  }
  else if(optionChoosed == 5 || optionChoosed == 6){
    luConfig.style.visibility = 'hidden';
    luConfig.style.display = 'none';
    iterationConfig.style.visibility = 'visible';
    iterationConfig.style.display = 'block';

    initailGuessConfig.style.visibility = "visible";
    initailGuessConfig.style.display = "block";

    initailGuessInput.value = "1, 1, 1";
  }
  else{
    luConfig.style.visibility = 'hidden';
    luConfig.style.display = 'none';
    iterationConfig.style.visibility = 'hidden';
    iterationConfig.style.display = 'none';

    initailGuessConfig.style.visibility = "hidden";
    initailGuessConfig.style.display = "visible";
  }
}

stoppingConditions.onchange = () => {
  const optionChoosed = +stoppingConditions.value;
  if(optionChoosed === 1){
    stoppingConditionLable.innerHTML = "iteration";
  }
  else{
    stoppingConditionLable.innerHTML = "%";
  }
}


//functions
function addEquation(){
  const newEquation = document.createElement('div');
  newEquation.id = `equation-${numberOfEquations}`;
  newEquation.className = "eqn";
  newEquation.style.visibility = 'hidden';
  elementsToShow.push(newEquation);

  const newEquationCoofs = document.createElement('div');
  newEquationCoofs.id = `equation-coof-${numberOfEquations}`;
  newEquationCoofs.className = "eqn-coof";

  for(let i = 1; i <= numberOfEquations; i++){
    if(i != 1){
      const plusSign = document.createElement('div');
      plusSign.className = "sign";
      plusSign.id = `sign-${numberOfEquations}-${i}`
      plusSign.innerHTML = "$$+$$";
      newEquationCoofs.appendChild(plusSign);
    }

    const coofInput = document.createElement('input');
    coofInput.type = "number";
    coofInput.className = "eqn-input";
    coofInput.id = `coof-${numberOfEquations}-${i}`;
    newEquationCoofs.appendChild(coofInput);

    const variable = document.createElement('div');
    variable.innerHTML = `$$x_{${i}}$$`;
    variable.className = "var";
    variable.id = `var-${numberOfEquations}-${i}`;
    newEquationCoofs.appendChild(variable);
  }

  const newEquationConst = document.createElement('div');
  newEquationConst.id = `equation-const-${numberOfEquations}`;
  newEquationConst.className = "eqn-const";

  const equal = document.createElement('div');
  equal.innerHTML = "$$=$$";
  equal.className = "sign";
  newEquationConst.appendChild(equal);

  const constInput = document.createElement('input');
  constInput.type = "number";
  constInput.className = "eqn-input";
  constInput.id = `const-${numberOfEquations}`;
  newEquationConst.appendChild(constInput);

  newEquation.appendChild(newEquationCoofs);
  newEquation.appendChild(newEquationConst);

  equations.appendChild(newEquation);

  equationsCoofsHolders.push(newEquationCoofs);
}

function appendCurrentEquations(){
  numberOfEquations ++;
  let n = 1;
  for(const equationCoofs of equationsCoofsHolders){
    const plusSign = document.createElement('div');
    plusSign.innerHTML = "$$+$$";
    plusSign.className = "sign";
    plusSign.id = `sign-${n}-${numberOfEquations}`
    plusSign.style.visibility = 'hidden';
    elementsToShow.push(plusSign);
    equationCoofs.appendChild(plusSign);

    const coofInput = document.createElement('input');
    coofInput.type = "number";
    coofInput.className = "eqn-input";
    coofInput.id = `coof-${n}-${numberOfEquations}`
    coofInput.style.visibility = 'hidden';
    elementsToShow.push(coofInput);
    equationCoofs.appendChild(coofInput);

    const variable = document.createElement('div');
    variable.innerHTML = `$$x_{${numberOfEquations}}$$`;
    variable.className = "var";
    variable.id = `var-${n}-${numberOfEquations}`
    variable.style.visibility = 'hidden';
    elementsToShow.push(variable);
    equationCoofs.appendChild(variable);

    n++;
  }
}

function showElements(){
  for(let elem of elementsToShow){
    elem.style.visibility = 'visible';
  }
  elementsToShow.length = 0;
}

//delete an equation
function deleteEquation(){
  const equation = document.getElementById(`equation-${numberOfEquations}`);
  equation.remove();
  equationsCoofsHolders.splice(numberOfEquations-1, 1);
  for(let i = 1; i <= numberOfEquations-1; i++){
    document.getElementById(`sign-${i}-${numberOfEquations}`).remove();
    document.getElementById(`coof-${i}-${numberOfEquations}`).remove();
    document.getElementById(`var-${i}-${numberOfEquations}`).remove();
  }
  numberOfEquations--;
}

function createNewEquation(){
  appendCurrentEquations();
  addEquation();
  MathJax.Hub.Queue(["Typeset",MathJax.Hub])
  setTimeout(() => showElements(), 100);
}

function reset(){
  const numOfEqnToBeDeleted = numberOfEquations - 2;
  for(let i = 0; i < numOfEqnToBeDeleted; i++){
    deleteEquation();
  }
  for(let i = 1; i <= 2; i++){
    for(let j = 1; j <= 2; j++){
      document.getElementById(`coof-${i}-${j}`).value = "";
    }
    document.getElementById(`const-${i}`).value = "";
  }
}

function hideEquationsArea(){
  const equationsInputArea = document.getElementById("equations");
  equationsInputArea.style.visibility = "hidden";
  equationsInputArea.style.display = "none";
  
  const equaitonsInputControlBar = document.getElementById("equation-input-control");
  equaitonsInputControlBar.style.visibility = "hidden";
  equaitonsInputControlBar.style.display = "none";
}

function showEquationsArea(){
  const equationsInputArea = document.getElementById("equations");
  equationsInputArea.style.visibility = "visible";
  equationsInputArea.style.display = "block";
  
  const equationsLabel = document.getElementById("equations-label");
  equationsLabel.innerHTML = "Equations";

  const equaitonsInputControlBar = document.getElementById("equation-input-control");
  equaitonsInputControlBar.style.visibility = "visible";
  equaitonsInputControlBar.style.display = "flex";
}

function showSolutionsArea(){
  const solutionsArea = document.getElementById("solution");
  solutionsArea.style.visibility = "visible";
  solutionsArea.style.display = "flex";

  const equationsLabel = document.getElementById("equations-label");
  equationsLabel.innerHTML = "Solution";

  const backBtn = document.getElementById("back-btn");
  backBtn.style.visibility = "visible";
  backBtn.style.display = "flex";
}

function hideSolutionsArea(){
  const solutionsArea = document.getElementById("solution");
  solutionsArea.style.visibility = "hidden";
  solutionsArea.style.display = "none";

  const backBtn = document.getElementById("back-btn");
  backBtn.style.visibility = "hidden";
  backBtn.style.display = "none";
}

function resetSolutionsArea(){
  const solutionsArea = document.getElementById("solution");
  solutionsArea.innerHTML = "";
}

////read from file
const fileInput = document.getElementById("file-input");
const uploadBtn = document.getElementById("upload-btn");

fileInput.onchange = () => {
    if ('files' in fileInput && fileInput.files.length > 0){
      const file = fileInput.files[0];
      readFileContent(file)
      .then( content => {
        getMatrix(content);
        fileInput.value = "";
      })
      .catch( error => console.log(error))
    }
}

function readFileContent(file) {
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
      reader.onload = event => resolve(event.target.result)
      reader.onerror = error => reject(error)
      reader.readAsText(file)
    });
}


function getMatrix(content){
    const matrix = [];
    const matrixRows = content.split("\n");
    for(const row of matrixRows){
        if(row == "") continue;
        const matrixRow = [];
        const cols = row.split(' ');
        for(const elem of cols){
            matrixRow.push(+elem);
        }
        matrix.push(matrixRow);
    }

    changeAutomatically(matrix);
}

function changeAutomatically(matrix){
    const inputValue = matrix.length;
    if(inputValue < 2){
      numberOfEquationsInput.value = numberOfEquations;
      return;
    }

    if(inputValue < numberOfEquations){
      const numOfEqnToBeDeleted = numberOfEquations - inputValue;
      for(let i = 0; i < numOfEqnToBeDeleted; i++){
        deleteEquation();
      }
    }
    if(inputValue > numberOfEquations){
      const numOfEqnToBeCreated = inputValue - numberOfEquations;
      for(let i = 0; i < numOfEqnToBeCreated; i++){
        createNewEquation();
      }
    }
  
    for(let i = 0; i < matrix.length; i++){
      let numberOfCurrentEqn = i + 1;
      for(let j = 0; j < matrix.length; j++){
        let coofInputId = `coof-${numberOfCurrentEqn}-${j+1}`;
        let currentCoofInput = document.getElementById(coofInputId);
        currentCoofInput.value = matrix[i][j];
      }
      let constInput = document.getElementById(`const-${numberOfCurrentEqn}`);
      constInput.value = matrix[i][matrix.length];
    }  
  }

  function fireInfoPopUp(){
    const popUpBackground = document.createElement('div');
    popUpBackground.className = 'pop-up-background';
    document.body.appendChild(popUpBackground);

    const popUp = document.createElement('div');
    popUp.className = 'pop-up';
    popUpBackground.appendChild(popUp);

    const msg = document.createElement('h2');
    msg.innerText = "file must be a .txt file";
    popUp.appendChild(msg);

    const info = document.createElement('div');
    info.innerHTML = "equations must be listed as below <br/>6&emsp;2&emsp;3&emsp;1<br/>2&emsp;4&emsp;1&emsp;1<br/>3&emsp;1&emsp;8&emsp;1";
    info.className = "info";
    popUp.appendChild(info);

    const confrimBtn = document.createElement('span');
    confrimBtn.innerText = 'Ok';
    confrimBtn.className = 'pop-up-close-button ok-btn';   

    confrimBtn.onclick = () => {
      fileInput.click();
      document.body.removeChild(popUpBackground); 
    }

    popUp.appendChild(confrimBtn);
  }

  uploadBtn.onclick = () => fireInfoPopUp();
