import { AssignmentBlock, EqualityBlock, ExpressionBlock, FunctionBlock, LogicBlock, ScopeBlock } from "./classes/CodeBlock.js";
import { lineMaker } from "./drag_drop.js";
import { VariableBlock, LiteralBlock, DummyLiteralBlock } from "./classes/ValueBlock.js";

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


lineMaker(document.getElementById("test2"));

function parseScope() {

}

console.log(document.getElementsByClassName("run-button"));

function runCode () {
    console.log("clicked");
    let lines = document.getElementsByClassName("tab-contents")[0].getElementsByClassName("line");
    let list = [];

    let vars = document.getElementById("variableContainer").getElementsByClassName("variable-block");
    for (let i = 0; i < vars.length; i++) {
        let b = {
            "type": "value",
        }
        if (vars[i].dataset.subType === "number") {
            b["field"] = "num"
            b["num"] = vars[i].getElementsByClassName("number-input")[0].value
        } else {
            b["field"] = "text"
            b["text"] = vars[i].getElementsByClassName("string-input")[0].value
        }
        list.push({
            "type": "function",
            "field": "operation",
            "operation": "assign_variable",
            "A": {
                "type": "variable",
                "name": vars[i].dataset.name
            },
            "B": b
        })
    }


    for (let i = 0; i < lines.length; i++) {
        let blocks = lines[i].getElementsByClassName("code-block");
        if (blocks.length) {
            console.log(blocks[0].dataset.blockType + " : " + blocks[0].dataset.subType);
            let blockObject = {"type": blocks[0].dataset.blockType, "instruction": blocks[0].dataset.subType};
            if (blockObject.type === "function" && blockObject.instruction === "print") {
                // blockObject["input"] = [];
                let input = blocks[0].getElementsByClassName('value')[0];
                if (input) {
                    blockObject.input = {"type": "variable", "name": input.dataset.name };
                }
                console.log(blockObject);
                list.push(blockObject);
            }
            if (blocks.length > 1) {
                blockObject["input"] = [];
                for (let j = 1; j < blocks.length; j++) {
                    console.log("input: " + blocks[j].dataset.blockType + " : " + blocks[j].dataset.subType);
                    blockObject["input"].push({"type": blocks[j].dataset.blockType, "field": blocks[0].dataset.subType});
                }
            }



            if (blockObject.type === "scope") {

                // go to next child
                i++;
                // make a list of children
                

                // let stack = 

                // go through all the block's children
                while (lines[i].parentNode.parentNode.className === "scope-container") {
                    let blocks = lines[i].getElementsByClassName("code-block");
                    if (blocks.length) {
                        console.log("child: " + blocks[0].dataset.blockType + " : " + blocks[0].dataset.subType);
                        let blockObject = {"type": blocks[0].dataset.blockType, "field": blocks[0].dataset.subType};
                        if (blocks.length > 1) {
                            blockObject["children"] = [];
                            for (let j = 1; j < blocks.length; j++) {
                                console.log(blocks[j].dataset);
                                console.log("child: " + blocks[j].dataset.blockType + " : " + blocks[j].dataset.subType);
                                blockObject["children"].push({"type": blocks[j].dataset.blockType, "field": blocks[j].dataset.subType});
                            }
                        }
                    }
                    i++;
                }

                // add the block after getting all children
                list.push(blockObject);
            }
            
        }
        
        // if (blocks) {
        //     
        // }
        
    }
    console.log(list);
    let blockList = {"blocks": list}
    console.log(blockList);
    let clone;
    fetch("http://localhost:5215/api/runPython", {
      method: "POST",
      body: JSON.stringify(blockList),
      headers: {"Content-type": "application/json; charset=UTF-8"}
    }).then((res) => {
        clone = res.clone();
        return res.json();
    }).then((json) => {
        document.getElementById("console-textarea").value = json;
    }, (rej) => {
        clone.text().then((text) => {
            //console.log(text); 
            document.getElementById("console-textarea").value = text;
            console.log(consoleOutput = document.getElementById("console-textarea").value);
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
    checkAnswer();
}

document.getElementsByClassName("run-button")[0].onclick = function() {compileAndCheck();}

console.log("here");
