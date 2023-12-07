import { AssignmentBlock, EqualityBlock, ExpressionBlock, FunctionBlock, LogicBlock, ScopeBlock } from "./classes/CodeBlock.js";
import { lineMaker } from "./drag_drop.js";
import { VariableBlock, LiteralBlock, DummyLiteralBlock } from "./classes/ValueBlock.js";
import { BlockParser } from "./classes/BlockParser.js";
import { uploadDiv } from "./kodeFiles.js";

function test(){
    alert("Testing");
}

let expressionCon = document.getElementById("expressionContainer");
let varCon = document.getElementById("variableContainer");
let logicCon = document.getElementById("logicContainer");
let scopeCon = document.getElementById("scopeContainer");
let equalityCon = document.getElementById("equalityContainer");
let functionCon = document.getElementById("functionContainer");
let assCon = document.getElementById("assignmentContainer");

for(let i = 0; i < DummyLiteralBlock.subTypes.length; i++)
{
    let block = new DummyLiteralBlock(DummyLiteralBlock.subTypes[i]);
    varCon.appendChild(block.element);
}

// iterate through all the subtypes in assignment block

for (let i = 0; i < AssignmentBlock.subTypes.length; i++) 
{
    let block = new AssignmentBlock(AssignmentBlock.subTypes[i]);
    block.element.className += " dummy";
    assCon.appendChild(block.element);
}

// iterate through all the subtypes in equality block

for (let i = 0; i < EqualityBlock.subTypes.length; i++)
{
    let block = new EqualityBlock(EqualityBlock.subTypes[i]);
    block.element.className += " dummy";
    equalityCon.appendChild(block.element);
}

// iterate through all the subtypes in expression block

for (let i = 0; i < ExpressionBlock.subTypes.length; i++)
{
    let block = new ExpressionBlock(ExpressionBlock.subTypes[i]);
    block.element.className += " dummy";
    expressionCon.appendChild(block.element);
}

// iterate through all the subtypes in function block
let block = new FunctionBlock("print");
block.element.className += " dummy";
functionCon.appendChild(block.element);

// iterate through all the subtypes in logic block

for (let i = 0; i < LogicBlock.subTypes.length; i++)
{
    let block = new LogicBlock(LogicBlock.subTypes[i]);
    block.element.className += " dummy";
    logicCon.appendChild(block.element);
}

// iterate through all the subtypes in scope block

for (let i = 0; i < ScopeBlock.subTypes.length; i++)
{
    let block = new ScopeBlock(ScopeBlock.subTypes[i]);
    block.element.className += " dummy";
    scopeCon.appendChild(block.element);
}

const codeDiv = document.getElementById("test2");
let codeDivToSave = codeDiv.outerHTML;
lineMaker(codeDiv);

let varContainer = document.getElementById("variableContainer");
let codeContainer = document.getElementsByClassName("tab-contents")[0];
let URL = "http://localhost:5215";
let urltest = "https://codecraft.azurewebsites.net" // url for deployment


function runCode () {
    // upload the div to the db
    uploadDiv(codeDivToSave)

    // get the variables first
    let vars = varContainer.getElementsByClassName("variable-block");

    // add all the vars to the list
    let list = BlockParser.parseVars(vars);
    
    // get the code container
    let container = codeContainer.getElementsByClassName("active")[0];

    // add all the lines to the list
    list = list.concat(BlockParser.parseLines(container, false));
    
    // create the block list
    let blockList = {"blocks": list};
    console.log(blockList);

    // send it to the server to be compiled
    let clone;
    fetch(urltest + "/api/runPython", {
      method: "POST",
      body: JSON.stringify(blockList),
      headers: {"Content-type": "application/json; charset=UTF-8"}
    }).then((res) => {
        // clone if you only have text
        clone = res.clone();
        return res.json();
    }).then((json) => {
        // put it in the console
        document.getElementById("console-textarea").value = json;
        consoleOutput = document.getElementById("console-textarea");
        console.log(json);
    }, (rej) => {
        clone.text().then((text) => {
            // put it in the console if there is only text
            document.getElementById("console-textarea").value = text;
            consoleOutput = document.getElementById("console-textarea");
            console.log(text);
        }).then(() => checkAnswer());
    }).then(() => checkAnswer());
};

let answerIsCorrect = false;
    let consoleOutput = document.getElementById("console-textarea").value;
    let answer = "hello world"; // for question 1
    const checkmarkImage = document.getElementById('checkmark');
    const checkmarkContainer = document.querySelector('.checkmark-image');
    const incorrectAnswerMessageContainer = document.querySelector('.wrong-answer-message');

function checkAnswer()
    {
    consoleOutput = document.getElementById("console-textarea").value;
      console.log("run button clicked");
      console.log("consoleOutput: ", consoleOutput);
      console.log("answer: ", answer);

      if (consoleOutput.trim() === answer)
      {
        answerIsCorrect = true;
      } else
      {
        answerIsCorrect = false;
      }

      console.log("answerIsCorrect: ", answerIsCorrect);

      if (answerIsCorrect)
      {
        incorrectAnswerMessageContainer.innerHTML = '';
        checkmarkContainer.innerHTML = '<img src="/images/checkMark.png" alt="check mark image" id="checkmark">';
        console.log("IF checkmarkContainer: ", checkmarkContainer);
      } else
      {
        // Clear previous content in checkmarkContainer
        checkmarkContainer.innerHTML = '';

        incorrectAnswerMessageContainer.innerHTML = 'Oops! Let us try again :) ';
      }
}
    

function compileAndCheck() {
    runCode();
}

document.getElementById("run-button").onclick = function() {compileAndCheck();}

